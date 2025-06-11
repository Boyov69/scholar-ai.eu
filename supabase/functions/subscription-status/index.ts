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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select(`
        subscription_status,
        subscription_tier,
        stripe_customer_id,
        stripe_subscription_id,
        current_period_start,
        current_period_end,
        cancel_at_period_end
      `)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      // Return default free tier status
      return new Response(
        JSON.stringify({
          status: 'inactive',
          tier: 'free',
          customerId: null,
          subscriptionId: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // If user has a Stripe subscription, sync with Stripe to ensure accuracy
    let subscriptionData = {
      status: profile.subscription_status || 'inactive',
      tier: profile.subscription_tier || 'free',
      customerId: profile.stripe_customer_id,
      subscriptionId: profile.stripe_subscription_id,
      currentPeriodStart: profile.current_period_start,
      currentPeriodEnd: profile.current_period_end,
      cancelAtPeriodEnd: profile.cancel_at_period_end || false
    }

    // Sync with Stripe if subscription exists
    if (profile.stripe_subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
        
        // Update local data with Stripe data
        subscriptionData = {
          status: subscription.status,
          tier: profile.subscription_tier || 'free', // Keep local tier mapping
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }

        // Update database if there are differences
        if (
          profile.subscription_status !== subscription.status ||
          profile.cancel_at_period_end !== subscription.cancel_at_period_end
        ) {
          await supabaseClient
            .from('user_profiles')
            .update({
              subscription_status: subscription.status,
              current_period_start: subscriptionData.currentPeriodStart,
              current_period_end: subscriptionData.currentPeriodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
        }
      } catch (stripeError) {
        console.error('Error syncing with Stripe:', stripeError)
        // Continue with database data if Stripe sync fails
      }
    }

    return new Response(
      JSON.stringify(subscriptionData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
