import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      throw new Error('Invalid signature')
    }

    console.log('Processing webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabaseClient)
        break
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabaseClient)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabaseClient)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, supabaseClient)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, supabaseClient)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error.message || 'Webhook processing failed' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Handle successful checkout
async function handleCheckoutCompleted(session: any, supabaseClient: any) {
  const userId = session.metadata?.user_id
  if (!userId) {
    console.error('No user_id in checkout session metadata')
    return
  }

  // Update user profile with subscription info
  await supabaseClient
    .from('user_profiles')
    .update({
      stripe_customer_id: session.customer,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  console.log(`Checkout completed for user: ${userId}`)
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: any, supabaseClient: any) {
  const customerId = subscription.customer
  const userId = subscription.metadata?.user_id

  if (!userId) {
    // Try to find user by customer ID
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()
    
    if (!profile) {
      console.error('No user found for customer:', customerId)
      return
    }
  }

  // Determine subscription tier based on price ID
  const priceId = subscription.items.data[0]?.price?.id
  let tier = 'free'
  
  if (priceId?.includes('advanced')) tier = 'advanced_ai'
  else if (priceId?.includes('ultra')) tier = 'ultra_intelligent'
  else if (priceId?.includes('phd')) tier = 'phd_level'

  // Update subscription in database
  await supabaseClient
    .from('user_profiles')
    .update({
      subscription_status: subscription.status,
      subscription_tier: tier,
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId || profile.user_id)

  console.log(`Subscription updated for user: ${userId || profile.user_id}, status: ${subscription.status}`)
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: any, supabaseClient: any) {
  const customerId = subscription.customer

  // Find user by customer ID
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('No user found for customer:', customerId)
    return
  }

  // Update subscription status
  await supabaseClient
    .from('user_profiles')
    .update({
      subscription_status: 'canceled',
      subscription_tier: 'free',
      stripe_subscription_id: null,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', profile.user_id)

  console.log(`Subscription canceled for user: ${profile.user_id}`)
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: any, supabaseClient: any) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription

  // Find user by customer ID
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('No user found for customer:', customerId)
    return
  }

  // Log payment success
  await supabaseClient
    .from('payment_history')
    .insert({
      user_id: profile.user_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      created_at: new Date().toISOString()
    })

  console.log(`Payment succeeded for user: ${profile.user_id}, amount: ${invoice.amount_paid}`)
}

// Handle failed payment
async function handlePaymentFailed(invoice: any, supabaseClient: any) {
  const customerId = invoice.customer

  // Find user by customer ID
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('No user found for customer:', customerId)
    return
  }

  // Log payment failure
  await supabaseClient
    .from('payment_history')
    .insert({
      user_id: profile.user_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      created_at: new Date().toISOString()
    })

  // Update subscription status if needed
  await supabaseClient
    .from('user_profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', profile.user_id)

  console.log(`Payment failed for user: ${profile.user_id}, amount: ${invoice.amount_due}`)
}
