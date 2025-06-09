# Stripe Setup Guide for Scholar AI

This guide will help you configure Stripe for your Scholar AI application to enable payment processing.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com if you don't have one)
2. Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Starts with `sk_test_` (keep this secure!)

## Step 2: Update Your Environment Variables

Replace the placeholder values in your `.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

**Important**: 
- Never commit your actual secret key to version control
- The publishable key is safe to expose in frontend code
- The secret key should only be used on the server side

## Step 3: Create Stripe Products and Prices

In your Stripe Dashboard:

1. Go to **Products** → **Add product**
2. Create products for each subscription tier:

### Advanced AI-Powered Research Platform
- **Name**: Advanced AI-Powered Research Platform
- **Description**: 50 queries/month, Crow & Falcon agents
- **Pricing**: 
  - Monthly: €29/month (create price ID)
  - Yearly: €290/year (create price ID)

### Ultra-Intelligent Research Suite
- **Name**: Ultra-Intelligent Research Suite
- **Description**: 200 queries/month, All agents including Owl
- **Pricing**: 
  - Monthly: €79/month (create price ID)
  - Yearly: €790/year (create price ID)

### PhD-Level Research Command Center
- **Name**: PhD-Level Research Command Center
- **Description**: Unlimited queries, All agents, Priority support
- **Pricing**: 
  - Monthly: €199/month (create price ID)
  - Yearly: €1990/year (create price ID)

3. After creating each price, copy the Price ID (starts with `price_`)

## Step 4: Update Price IDs in Configuration

Update your `.env` file with the actual price IDs:

```env
# Stripe Price IDs
VITE_STRIPE_PRICE_ADVANCED_MONTHLY=price_YOUR_ADVANCED_MONTHLY_ID
VITE_STRIPE_PRICE_ADVANCED_YEARLY=price_YOUR_ADVANCED_YEARLY_ID
VITE_STRIPE_PRICE_ULTRA_MONTHLY=price_YOUR_ULTRA_MONTHLY_ID
VITE_STRIPE_PRICE_ULTRA_YEARLY=price_YOUR_ULTRA_YEARLY_ID
VITE_STRIPE_PRICE_PHD_MONTHLY=price_YOUR_PHD_MONTHLY_ID
VITE_STRIPE_PRICE_PHD_YEARLY=price_YOUR_PHD_YEARLY_ID
```

## Step 5: Set Up Webhook (For Production)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add to your `.env`:

```env
VITE_STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## Step 6: Fix Cross-Origin Errors

The Stripe cross-origin errors occur when Stripe tries to create payment iframes. To fix this:

1. Ensure you're using the correct Stripe publishable key
2. Make sure your domain is properly configured in Stripe
3. For local development, Stripe should work with `localhost`

## Step 7: Test Your Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Use Stripe test cards for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

## Step 8: Configure Stripe for Production

When ready for production:

1. Switch to **Live Mode** in Stripe Dashboard
2. Get your live API keys (start with `pk_live_` and `sk_live_`)
3. Update your production environment variables
4. Ensure your domain is added to Stripe's allowed domains

## Troubleshooting

### Cross-Origin Errors
If you still see cross-origin errors:
1. Check that your Stripe publishable key is correct
2. Ensure you're not accidentally using the secret key in frontend code
3. Clear your browser cache and cookies
4. Try in an incognito/private window

### Payment Element Not Loading
1. Verify Stripe.js is loaded correctly
2. Check browser console for specific errors
3. Ensure your publishable key has the correct permissions

## Security Best Practices

1. **Never expose your secret key** in frontend code
2. **Use environment variables** for all sensitive data
3. **Validate webhooks** using the webhook secret
4. **Use HTTPS** in production
5. **Implement proper error handling** for failed payments

## Next Steps

After setting up Stripe:
1. Implement the backend API endpoints for payment processing
2. Set up webhook handlers for subscription management
3. Test the complete payment flow
4. Configure customer portal for subscription management

For more information, refer to the [Stripe Documentation](https://stripe.com/docs).