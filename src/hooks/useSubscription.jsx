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

      // Get subscription status from Stripe
      const subscriptionData = await stripe.getSubscriptionStatus(userId);
      setSubscription(subscriptionData);

      // Load usage data (this would come from your backend)
      const usageData = await loadUsageData(userId);
      setUsage(usageData);
    } catch (err) {
      console.error('Error loading subscription data:', err);
      setError(err.message);
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
      storage: '0.5GB'
    };
  };

  const subscribe = async (tierId) => {
    try {
      setLoading(true);
      setError(null);

      const tier = subscriptions.getTier(tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      // Create Stripe checkout session
      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/pricing?subscription=cancelled`;

      await stripe.createCheckoutSession(
        tier.stripePriceId, // You'll need to add this to your config
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

      if (!subscription?.customerId) {
        throw new Error('No active subscription found');
      }

      const returnUrl = `${window.location.origin}/settings`;
      await stripe.createPortalSession(subscription.customerId, returnUrl);
    } catch (err) {
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
      default:
        return true;
    }
  };

  const getRemainingQuota = (type) => {
    const limits = getLimits();
    return limits[type]?.remaining || 0;
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

