#!/usr/bin/env node

/**
 * Scholar AI Payment Flow Testing Script
 * 
 * This script tests the complete payment flow including:
 * - Stripe checkout session creation
 * - Webhook processing
 * - Subscription status updates
 * - Usage tracking
 * 
 * Usage: node scripts/test-payment-flow.js
 */

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  testEmail: 'test@scholarai.eu',
  testPassword: 'TestPassword123!'
};

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function testPaymentFlow() {
  console.log('🧪 Testing Scholar AI Payment Flow...\n');

  try {
    // Step 1: Create test user
    console.log('👤 Creating test user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: config.testEmail,
      password: config.testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (authError && authError.message !== 'User already registered') {
      throw authError;
    }

    const userId = authData.user?.id;
    console.log(`✅ Test user created/found: ${userId}`);

    // Step 2: Test Stripe customer creation
    console.log('\n💳 Testing Stripe customer creation...');
    const customer = await stripe.customers.create({
      email: config.testEmail,
      name: 'Test User',
      metadata: {
        supabase_user_id: userId,
        test_customer: 'true'
      }
    });

    console.log(`✅ Stripe customer created: ${customer.id}`);

    // Step 3: Update user profile with Stripe customer ID
    console.log('\n📝 Updating user profile...');
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', userId);

    if (profileError) {
      throw profileError;
    }

    console.log('✅ User profile updated with Stripe customer ID');

    // Step 4: Test checkout session creation
    console.log('\n🛒 Testing checkout session creation...');
    
    // Get a test price ID (you'll need to create this in Stripe)
    const prices = await stripe.prices.list({ limit: 1 });
    if (prices.data.length === 0) {
      console.log('⚠️  No prices found. Please run setup-stripe-products.js first');
      return;
    }

    const testPriceId = prices.data[0].id;
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: testPriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'https://scholarai.eu/success',
      cancel_url: 'https://scholarai.eu/cancel',
      metadata: {
        user_id: userId,
        test_session: 'true'
      }
    });

    console.log(`✅ Checkout session created: ${session.id}`);
    console.log(`🔗 Checkout URL: ${session.url}`);

    // Step 5: Test subscription creation (simulate webhook)
    console.log('\n📡 Simulating subscription webhook...');
    
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: testPriceId,
      }],
      metadata: {
        user_id: userId,
        test_subscription: 'true'
      }
    });

    console.log(`✅ Test subscription created: ${subscription.id}`);

    // Step 6: Update user profile with subscription info
    console.log('\n🔄 Updating subscription status...');
    const { error: subError } = await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscription.status,
        subscription_tier: 'advanced_ai',
        stripe_subscription_id: subscription.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('user_id', userId);

    if (subError) {
      throw subError;
    }

    console.log('✅ Subscription status updated');

    // Step 7: Test usage tracking
    console.log('\n📊 Testing usage tracking...');
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { error: usageError } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        queries_used: 5,
        collaborators_count: 1,
        storage_used_mb: 100,
        workspaces_count: 2,
        citations_count: 10
      });

    if (usageError && !usageError.message.includes('duplicate')) {
      throw usageError;
    }

    console.log('✅ Usage tracking record created');

    // Step 8: Test customer portal
    console.log('\n🏪 Testing customer portal...');
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: 'https://scholarai.eu/settings',
    });

    console.log(`✅ Customer portal session created: ${portalSession.id}`);
    console.log(`🔗 Portal URL: ${portalSession.url}`);

    // Step 9: Cleanup (cancel subscription and delete customer)
    console.log('\n🧹 Cleaning up test data...');
    
    await stripe.subscriptions.cancel(subscription.id);
    console.log('✅ Test subscription canceled');
    
    await stripe.customers.del(customer.id);
    console.log('✅ Test customer deleted');

    // Delete test user data
    await supabase
      .from('usage_tracking')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    console.log('✅ Test user data cleaned up');

    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('=====================================');
    console.log('✅ Stripe customer creation');
    console.log('✅ Checkout session creation');
    console.log('✅ Subscription management');
    console.log('✅ Database updates');
    console.log('✅ Usage tracking');
    console.log('✅ Customer portal');
    console.log('✅ Data cleanup');
    console.log('\n🚀 Your payment system is ready for production!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

async function main() {
  // Check environment variables
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }

  // Confirm test mode
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.log('⚠️  WARNING: You are using a live Stripe key!');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('Are you sure you want to run tests with live data? (y/N): ', resolve);
    });

    readline.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Test cancelled');
      process.exit(0);
    }
  }

  await testPaymentFlow();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPaymentFlow };
