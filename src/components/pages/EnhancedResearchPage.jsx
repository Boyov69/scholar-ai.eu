import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Crown, Zap, ArrowRight, Lock, Folders, ExternalLink } from 'lucide-react';
import ResearchDashboard from '../research/ResearchDashboard';
import { researchWorkspaceIntegration } from '../../services/researchWorkspaceIntegration';
import { toast } from 'sonner';

/**
 * Enhanced Research Page with automatic workspace integration
 * All research queries are routed to the Enhanced Workspace
 */
const EnhancedResearchPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const { tier, loading: subscriptionLoading } = useSubscription();
  const [isPageReady, setIsPageReady] = useState(false);

  // Enhanced Research is now available for all users as 1-month free trial
  const hasAccess = true; // Free trial for all users
  
  // Preload critical resources and optimize LCP
  useEffect(() => {
    // Pre-render high-priority elements
    document.documentElement.classList.add('optimize-lcp');
    const timer = setTimeout(() => {
      setIsPageReady(true);
      document.documentElement.classList.remove('optimize-lcp');
    }, 50); // Faster preload
    return () => clearTimeout(timer);
  }, []);

  // Check if user is in free trial period (1 month from account creation)
  const isFreeTrial = () => {
    if (!isAuthenticated) return false;

    // For production, check if user is within 1 month of account creation
    // This would normally check against user creation date from database
    return true; // For now, allow all users
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth?redirect=/research/enhanced');
    }
  }, [isAuthenticated, loading, navigate]);

  // Add timeout for loading states to prevent infinite loading
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Shorter timeout for better perceived performance
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 800); // Further reduced timeout for better UX

    return () => clearTimeout(timer);
  }, []);

  if ((loading || subscriptionLoading) && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Enhanced Research...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Force render after timeout even if loading states are stuck
  if (loadingTimeout) {
    console.log('⚠️ Loading timeout reached, forcing Enhanced Research render');
  }

  // This section is now unused since all users have access
  if (false) { // Disabled - all users now have access
    return (
      <>
        <Helmet>
          <title>Enhanced Research - Upgrade Required - Scholar AI</title>
          <meta
            name="description"
            content="Upgrade to Ultra-Intelligent or PhD-Level to access advanced AI research with FutureHouse agents."
          />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full"
          >
            <Card className="glass-strong border-yellow-500/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                  <Lock className="h-12 w-12 text-yellow-400" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                  Enhanced Research Requires Upgrade
                </CardTitle>
                <p className="text-white/80 text-lg">
                  Access to FutureHouse AI agents and multi-agent research is available for
                  <span className="text-blue-400 font-semibold"> Ultra-Intelligent</span> and
                  <span className="text-purple-400 font-semibold"> PhD-Level</span> subscribers.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white capitalize">Current Plan: {tier}</h3>
                      <p className="text-white/60 text-sm">Advanced AI-Powered Research Platform</p>
                    </div>
                    <Badge variant="outline" className="border-white/30 text-white/70">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Upgrade Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-white">Ultra-Intelligent</h4>
                    </div>
                    <ul className="text-sm text-white/80 space-y-1 mb-4">
                      <li>• FutureHouse AI agents</li>
                      <li>• Multi-agent research</li>
                      <li>• Advanced analytics</li>
                      <li>• Unlimited queries</li>
                    </ul>
                    <p className="text-blue-400 font-bold">€99/month</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-purple-400" />
                      <h4 className="font-semibold text-white">PhD-Level</h4>
                    </div>
                    <ul className="text-sm text-white/80 space-y-1 mb-4">
                      <li>• Everything in Ultra-Intelligent</li>
                      <li>• Team management</li>
                      <li>• White-label options</li>
                      <li>• Dedicated support</li>
                    </ul>
                    <p className="text-purple-400 font-bold">€299/month</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Upgrade Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                  >
                    Back to Dashboard
                  </Button>
                </div>

                <p className="text-center text-white/60 text-sm">
                  Questions? <button className="text-blue-400 hover:underline">Contact our sales team</button> for custom enterprise solutions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enhanced Research - Scholar AI</title>
        <meta
          name="description"
          content="Advanced AI research with FutureHouse agents - Phoenix, Crow, Falcon, and Owl for specialized academic research tasks."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Free Trial Banner - Optimized for performance */}
            <div className="mb-6">
              <Card className="glass-strong border-green-500/30 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/20">
                        <Crown className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">🎉 Free Trial Active!</h3>
                        <p className="text-sm text-white/70">
                          Enhanced Research with FutureHouse AI agents - Free for 1 month for all users!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 hover:text-green-200"
                        onClick={() => navigate('/workspaces')}
                      >
                        <Folders className="w-4 h-4 mr-1" />
                        Workspaces
                      </Button>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                        FREE TRIAL
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs - Optimized for faster rendering */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-white font-medium border-b-2 border-blue-500 pb-1 px-1">
                  Research
                </button>
                <button
                  className="text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-600 pb-1 px-1 transition-colors"
                  onClick={() => {
                    const latestWorkspaceId = localStorage.getItem('lastResearchWorkspaceId');
                    if (latestWorkspaceId) {
                      navigate(`/workspace/${latestWorkspaceId}/enhanced`);
                    } else {
                      navigate('/workspaces');
                      toast.info('Select a workspace to continue research');
                    }
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <Folders className="w-4 h-4" />
                    Academic Workspace
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 hover:text-green-200"
                onClick={(e) => {
                  // Prevent multiple clicks
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Disable button to prevent multiple workspace creations
                  const btn = e.currentTarget;
                  btn.disabled = true;
                  
                  if (!user) {
                    toast.error('You need to be logged in to create a workspace');
                    setTimeout(() => { btn.disabled = false; }, 1000);
                    return;
                  }
                  
                  // Show loading toast with ID to be able to dismiss it later
                  const toastId = toast.loading('Creating new workspace...');
                  
                  // Create a new empty workspace
                  researchWorkspaceIntegration.createWorkspaceFromResults({}, user.id, {
                    query: "New Research Project",
                    researchArea: "Research"
                  }).then(result => {
                    toast.dismiss(toastId);
                    
                    if (result.status === 'success') {
                      localStorage.setItem('lastResearchWorkspaceId', result.workspaceId);
                      navigate(`/workspace/${result.workspaceId}/enhanced`);
                    } else {
                      toast.error('Failed to create workspace');
                      setTimeout(() => { btn.disabled = false; }, 1000);
                    }
                  }).catch(err => {
                    console.error('Workspace creation error:', err);
                    toast.dismiss(toastId);
                    toast.error('Error creating workspace');
                    setTimeout(() => { btn.disabled = false; }, 1000);
                  });
                }}
              >
                <Folders className="w-4 h-4 mr-1" />
                New Workspace
              </Button>
            </div>

            <div>
              <ResearchDashboard
                workspaceIntegration={researchWorkspaceIntegration}
                enableWorkspaceRouting={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedResearchPage;
