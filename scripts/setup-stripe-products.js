#!/usr/bin/env node

/**
 * Scholar AI Stripe Products Setup Script
 * 
 * This script automatically creates all the necessary Stripe products and prices
 * for the Scholar AI subscription tiers.
 * 
 * Usage: node scripts/setup-stripe-products.js
 * 
 * Make sure to set your STRIPE_SECRET_KEY environment variable first!
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Scholar AI subscription tiers configuration
const subscriptionTiers = {
  advanced_ai: {
    name: 'Advanced AI-Powered Research Platform',
    description: 'Perfect for students and early researchers',
    monthlyPrice: 2900, // €29.00 in cents
    yearlyPrice: 2400,  // €24.00 in cents (when billed yearly)
    features: [
      '50 research queries/month',
      'Standard citation formats (APA, MLA, Chicago)',
      'PDF export functionality',
      'Email support',
      'Basic collaboration tools'
    ]
  },
  ultra_intelligent: {
    name: 'Ultra-Intelligent Academic Platform',
    description: 'For serious researchers and small teams',
    monthlyPrice: 9900, // €99.00 in cents
    yearlyPrice: 7900,  // €79.00 in cents (when billed yearly)
    features: [
      'Unlimited research queries',
      'All citation formats + BibTeX',
      'Advanced collaboration workspace',
      'University SSO integration',
      'Priority support',
      'Real-time research synthesis',
      'Advanced export formats'
    ]
  },
  phd_level: {
    name: 'PhD-Level Academic Intelligence',
    description: 'Enterprise-grade research platform',
    monthlyPrice: 29900, // €299.00 in cents
    yearlyPrice: 24900,  // €249.00 in cents (when billed yearly)
    features: [
      'Unlimited research queries',
      'Multi-user management dashboard',
      'Advanced analytics and reporting',
      'White-label customization',
      'Dedicated account manager',
      'API access for custom integrations',
      'SSO integration',
      'GDPR compliance tools',
      'Priority processing',
      'Custom training and onboarding'
    ]
  }
};

async function createStripeProducts() {
  console.log('🚀 Setting up Scholar AI Stripe products...\n');

  const results = {
    products: {},
    prices: {}
  };

  try {
    for (const [tierId, tierConfig] of Object.entries(subscriptionTiers)) {
      console.log(`📦 Creating product: ${tierConfig.name}`);

      // Create the product
      const product = await stripe.products.create({
        name: tierConfig.name,
        description: tierConfig.description,
        metadata: {
          tier_id: tierId,
          features: JSON.stringify(tierConfig.features)
        }
      });

      results.products[tierId] = product.id;
      console.log(`✅ Product created: ${product.id}`);

      // Create monthly price
      console.log(`💰 Creating monthly price for ${tierConfig.name}`);
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tierConfig.monthlyPrice,
        currency: 'eur',
        recurring: {
          interval: 'month'
        },
        metadata: {
          tier_id: tierId,
          billing_cycle: 'monthly'
        }
      });

      results.prices[`${tierId}_monthly`] = monthlyPrice.id;
      console.log(`✅ Monthly price created: ${monthlyPrice.id}`);

      // Create yearly price
      console.log(`💰 Creating yearly price for ${tierConfig.name}`);
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tierConfig.yearlyPrice,
        currency: 'eur',
        recurring: {
          interval: 'year'
        },
        metadata: {
          tier_id: tierId,
          billing_cycle: 'yearly'
        }
      });

      results.prices[`${tierId}_yearly`] = yearlyPrice.id;
      console.log(`✅ Yearly price created: ${yearlyPrice.id}`);
      console.log('');
    }

    // Generate environment variables
    console.log('🔧 Generated Environment Variables:');
    console.log('=====================================');
    console.log('# Add these to your .env file:');
    console.log('');
    
    for (const [tierId] of Object.entries(subscriptionTiers)) {
      const monthlyPriceId = results.prices[`${tierId}_monthly`];
      const yearlyPriceId = results.prices[`${tierId}_yearly`];
      
      console.log(`VITE_STRIPE_PRICE_${tierId.toUpperCase()}_MONTHLY=${monthlyPriceId}`);
      console.log(`VITE_STRIPE_PRICE_${tierId.toUpperCase()}_YEARLY=${yearlyPriceId}`);
    }

    console.log('');
    console.log('🎉 All Stripe products and prices created successfully!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Copy the environment variables above to your .env file');
    console.log('2. Update your Vercel environment variables');
    console.log('3. Set up webhook endpoints');
    console.log('4. Test the payment flow');
    console.log('');
    console.log('🔗 Useful Links:');
    console.log('- Stripe Dashboard: https://dashboard.stripe.com');
    console.log('- Products: https://dashboard.stripe.com/products');
    console.log('- Webhooks: https://dashboard.stripe.com/webhooks');

    return results;

  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message);
    process.exit(1);
  }
}

async function main() {
  // Check if Stripe secret key is provided
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is required');
    console.log('💡 Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.js');
    process.exit(1);
  }

  // Check if we're in test mode
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.log('⚠️  WARNING: You are using a live Stripe key!');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('Are you sure you want to create live products? (y/N): ', resolve);
    });

    readline.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled');
      process.exit(0);
    }
  }

  await createStripeProducts();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createStripeProducts, subscriptionTiers };
