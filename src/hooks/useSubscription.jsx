import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { stripe, subscriptions } from '../lib/stripe.js';

const SubscriptionContext = createContext({});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSubscriptionData = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      // For development, use mock subscription data
      const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

      if (isDevelopment) {
        console.log('🚧 Development mode: Using mock subscription data');
        setSubscription({
          tier: 'basic',
          status: 'active',
          customerId: 'mock-customer-id'
        });
      } else {
        // Load real subscription data from Supabase
        // Get subscription status from Stripe
        const subscriptionData = await stripe.getSubscriptionStatus(userId);
        setSubscription(subscriptionData);
      }

      // Load usage data (this would come from your backend)
      const usageData = await loadUsageData(userId);
      setUsage(usageData);
    } catch (err) {
      console.error('Error loading subscription data:', err);
      setError(err.message);

      // Fallback to basic subscription in case of error
      setSubscription({
        tier: 'basic',
        status: 'active',
        customerId: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSubscriptionData(user.id);
    } else {
      setSubscription(null);
      setUsage({});
    }
  }, [isAuthenticated, user?.id]);

  const loadUsageData = async (userId) => {
    // This would typically fetch from your backend API
    // For now, return mock data
    return {
      queries: 15,
      collaborators: 2,
      storage: '0.5GB',
      workspaces: 1 // Current workspace count
    };
  };

  const subscribe = async (tierId, billingCycle = 'monthly') => {
    try {
      setLoading(true);
      setError(null);

      const tier = subscriptions.getTier(tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      // Get the correct price ID based on billing cycle
      const priceId = tier.stripePriceId[billingCycle];
      if (!priceId) {
        throw new Error(`Invalid billing cycle: ${billingCycle}`);
      }

      // Create Stripe checkout session
      const successUrl = `${window.location.origin}/dashboard?subscription=success&tier=${tierId}`;
      const cancelUrl = `${window.location.origin}/pricing?subscription=cancelled`;

      await stripe.createCheckoutSession(
        priceId,
        user.id,
        successUrl,
        cancelUrl
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const manageBilling = async () => {
    try {
      setLoading(true);
      setError(null);

      // Open real Stripe billing portal

      if (!subscription?.customerId) {
        throw new Error('No active subscription found');
      }

      const returnUrl = `${window.location.origin}/settings`;
      await stripe.createPortalSession(subscription.customerId, returnUrl);
    } catch (err) {
      console.error('Billing management error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = (feature) => {
    if (!subscription) return false;
    return subscriptions.hasAccess(subscription.tier, feature);
  };

  const getLimits = () => {
    if (!subscription) return {};
    return subscriptions.checkLimits(subscription.tier, usage);
  };

  const getUpgradeBenefits = (targetTier) => {
    if (!subscription) return [];
    return subscriptions.getUpgradeBenefits(subscription.tier, targetTier);
  };

  const canPerformAction = (action) => {
    const limits = getLimits();

    switch (action) {
      case 'create_query':
        return !limits.queries?.exceeded;
      case 'add_collaborator':
        return !limits.collaborators?.exceeded;
      case 'upload_file':
        return !limits.storage?.exceeded;
      case 'create_workspace':
        // Allow workspace creation for all users (basic limit checking)
        const tier = subscription?.tier || 'free';
        const maxWorkspaces = tier === 'free' ? 3 : tier === 'basic' ? 10 : -1; // -1 = unlimited
        const currentWorkspaces = usage.workspaces || 0;
        return maxWorkspaces === -1 || currentWorkspaces < maxWorkspaces;
      default:
        return true;
    }
  };

  const getRemainingQuota = (type) => {
    const limits = getLimits();
    return limits[type]?.remaining || 0;
  };

  // Agent access control based on subscription tier
  const getAvailableAgents = () => {
    const tier = subscription?.tier || 'free';

    switch (tier) {
      case 'free':
      case 'basic':
        return ['crow']; // Only Crow agent for basic users
      case 'premium':
      case 'ultra-intelligent':
        return ['crow', 'falcon', 'owl', 'phoenix']; // All agents for premium+
      case 'professional':
      case 'phd-level':
        return ['crow', 'falcon', 'owl', 'phoenix']; // All agents for professional+
      default:
        return ['crow']; // Default to basic access
    }
  };

  const canUseAgent = (agentType) => {
    const availableAgents = getAvailableAgents();
    return availableAgents.includes(agentType);
  };

  const getAgentLimits = () => {
    const tier = subscription?.tier || 'free';

    switch (tier) {
      case 'free':
      case 'basic':
        return {
          maxQueries: 5, // 5 queries per month for basic
          maxAgentsPerQuery: 1, // Only 1 agent per query
          availableAgents: ['crow']
        };
      case 'premium':
      case 'ultra-intelligent':
        return {
          maxQueries: 100, // 100 queries per month for premium
          maxAgentsPerQuery: 4, // All agents per query
          availableAgents: ['crow', 'falcon', 'owl', 'phoenix']
        };
      case 'professional':
      case 'phd-level':
        return {
          maxQueries: -1, // Unlimited for professional
          maxAgentsPerQuery: 4, // All agents per query
          availableAgents: ['crow', 'falcon', 'owl', 'phoenix']
        };
      default:
        return {
          maxQueries: 5,
          maxAgentsPerQuery: 1,
          availableAgents: ['crow']
        };
    }
  };

  const value = {
    subscription,
    usage,
    loading,
    error,
    subscribe,
    manageBilling,
    checkAccess,
    getLimits,
    getUpgradeBenefits,
    canPerformAction,
    getRemainingQuota,
    getAvailableAgents,
    canUseAgent,
    getAgentLimits,
    isActive: subscription?.status === 'active',
    tier: subscription?.tier || 'free',
    refreshData: () => user?.id && loadSubscriptionData(user.id)
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

