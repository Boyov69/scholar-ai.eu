import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Crown, Zap, ArrowRight, Lock } from 'lucide-react';
import ResearchDashboard from '../research/ResearchDashboard';

const EnhancedResearchPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { tier, loading: subscriptionLoading } = useSubscription();

  // Check if user has access to enhanced research (Ultra-Intelligent or PhD-Level)
  const hasAccess = tier === 'ultra_intelligent' || tier === 'phd_level';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth?redirect=/research/enhanced');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Show upgrade prompt for Advanced AI tier users
  if (!hasAccess) {
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ResearchDashboard />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedResearchPage;
