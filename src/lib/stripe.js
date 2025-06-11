import { loadStripe } from '@stripe/stripe-js';
import { config } from './config.js';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    // Only load Stripe if we have a valid publishable key
    const publishableKey = config.stripe.publishableKey;
    if (publishableKey && publishableKey.startsWith('pk_')) {
      stripePromise = loadStripe(publishableKey);
    } else {
      console.warn('Stripe publishable key not configured. Payment features will be disabled.');
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

// Stripe payment utilities
export const stripe = {
  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      // Import API client dynamically to avoid circular imports
      const { api } = await import('./api.js');

      const { sessionUrl } = await api.createCheckoutSession(priceId, successUrl, cancelUrl);

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  },

  // Create customer portal session
  async createPortalSession(customerId, returnUrl) {
    try {
      // Import API client dynamically to avoid circular imports
      const { api } = await import('./api.js');

      const { portalUrl } = await api.createPortalSession(returnUrl);

      // Redirect to Stripe Customer Portal
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Stripe portal error:', error);
      throw error;
    }
  },

  // Get subscription status
  async getSubscriptionStatus(userId) {
    try {
      // Import API client dynamically to avoid circular imports
      const { api } = await import('./api.js');

      return await api.getSubscriptionStatus();
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return {
        status: 'inactive',
        tier: 'free',
        customerId: null,
        subscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      };
    }
  }
};

// Subscription management utilities
export const subscriptions = {
  // Get tier details by ID
  getTier(tierId) {
    return config.subscriptionTiers[tierId] || null;
  },

  // Get all available tiers
  getAllTiers() {
    return Object.values(config.subscriptionTiers);
  },

  // Check if user has access to feature
  hasAccess(userTier, feature) {
    const tier = this.getTier(userTier);
    if (!tier) return false;

    const accessMap = {
      basic_queries: ['student', 'research', 'institution'],
      advanced_queries: ['research', 'institution'],
      unlimited_queries: ['institution'],
      collaboration: ['research', 'institution'],
      sso_integration: ['institution'],
      admin_dashboard: ['institution'],
      priority_support: ['research', 'institution'],
      all_export_formats: ['research', 'institution']
    };

    return accessMap[feature]?.includes(userTier) || false;
  },

  // Check usage limits
  checkLimits(userTier, currentUsage) {
    const tier = this.getTier(userTier);
    if (!tier) return { exceeded: true, remaining: 0 };

    const limits = tier.limits;
    const results = {};

    Object.keys(limits).forEach(key => {
      const limit = limits[key];
      const usage = currentUsage[key] || 0;
      
      if (limit === -1) {
        // Unlimited
        results[key] = { exceeded: false, remaining: -1, usage };
      } else {
        results[key] = {
          exceeded: usage >= limit,
          remaining: Math.max(0, limit - usage),
          usage,
          limit
        };
      }
    });

    return results;
  },

  // Calculate upgrade benefits
  getUpgradeBenefits(currentTier, targetTier) {
    const current = this.getTier(currentTier);
    const target = this.getTier(targetTier);
    
    if (!current || !target) return [];

    const benefits = [];
    
    // Compare query limits
    if (target.limits.queries > current.limits.queries || target.limits.queries === -1) {
      const queryIncrease = target.limits.queries === -1 
        ? 'Unlimited' 
        : `${target.limits.queries - current.limits.queries} more`;
      benefits.push(`${queryIncrease} research queries per month`);
    }

    // Compare collaborator limits
    if (target.limits.collaborators > current.limits.collaborators || target.limits.collaborators === -1) {
      const collabIncrease = target.limits.collaborators === -1 
        ? 'Unlimited' 
        : `${target.limits.collaborators - current.limits.collaborators} more`;
      benefits.push(`${collabIncrease} collaborators`);
    }

    // Compare features
    const newFeatures = target.features.filter(feature => 
      !current.features.includes(feature)
    );
    benefits.push(...newFeatures);

    return benefits;
  }
};

// Billing utilities
export const billing = {
  // Format price for display
  formatPrice(amount, currency = 'EUR') {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Calculate prorated amount
  calculateProration(currentTier, newTier, daysRemaining, totalDays) {
    const currentPrice = config.subscriptionTiers[currentTier]?.monthlyPrice || 0;
    const newPrice = config.subscriptionTiers[newTier]?.monthlyPrice || 0;
    
    const dailyCurrentRate = currentPrice / totalDays;
    const dailyNewRate = newPrice / totalDays;
    
    const refund = dailyCurrentRate * daysRemaining;
    const charge = dailyNewRate * daysRemaining;
    
    return {
      refund: Math.round(refund * 100) / 100,
      charge: Math.round(charge * 100) / 100,
      net: Math.round((charge - refund) * 100) / 100
    };
  },

  // Generate invoice data
  generateInvoiceData(subscription, usage) {
    const tier = subscriptions.getTier(subscription.tier);
    const baseAmount = tier?.monthlyPrice || 0;
    
    // Calculate overage charges (if any)
    let overageCharges = 0;
    const limits = subscriptions.checkLimits(subscription.tier, usage);
    
    // Add overage logic here if needed
    
    return {
      baseAmount,
      overageCharges,
      totalAmount: baseAmount + overageCharges,
      currency: 'EUR',
      period: {
        start: subscription.current_period_start,
        end: subscription.current_period_end
      },
      usage,
      limits
    };
  }
};

// Export getStripe for components that need direct Stripe access
export { getStripe };
