import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  Building, 
  ArrowRight,
  Crown,
  Shield,
  Infinity,
  GraduationCap,
  Brain
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscribe, tier: currentTier, loading } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      id: 'premium',
      name: 'Premium Research Platform',
      subtitle: 'Perfect for students and early researchers',
      icon: GraduationCap,
      price: 19,
      popular: false,
      description: 'Perfect for students and early researchers',
      annualDiscount: 0.2, // 20% discount
      color: 'blue',
      features: [
        '50 research queries/month',
        'Standard citation formats (APA, MLA, Chicago)',
        'PDF export functionality',
        'Email support',
        'Basic collaboration tools',
        '1 month free trial',
        'Enhanced Research: Crow Agent Only (FutureHouse Concise Search)'
      ],
      limits: {
        queries: 50,
        collaborators: 2,
        storage: '1GB'
      }
    },
    {
      id: 'professional',
      name: 'Professional Academic Platform',
      subtitle: 'Ideal for researchers and academic professionals',
      icon: Brain,
      price: 69,
      popular: true,
      description: 'Ideal for researchers and academic professionals',
      annualDiscount: 0.2,
      color: 'purple',
      features: [
        'Unlimited research queries',
        'All citation formats + BibTeX',
        'Advanced collaboration workspace',
        'University SSO integration',
        'Priority support',
        'Real-time research synthesis',
        '1 month free trial',
        'All 4 FutureHouse Agents (Crow, Falcon, Owl, Phoenix)',
        'Advanced Analytics & Deep Literature Reviews',
        'Precedent Search & Citation Analysis'
      ],
      limits: {
        queries: -1,
        collaborators: 10,
        storage: '10GB'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise Academic Intelligence',
      subtitle: 'Comprehensive solution for universities and institutions',
      icon: Crown,
      price: 199,
      popular: false,
      description: 'Comprehensive solution for universities and institutions',
      annualDiscount: 0.25, // 25% discount
      color: 'gold',
      features: [
        'Everything in Professional',
        'Multi-user management dashboard',
        'Advanced analytics and reporting',
        'White-label customization',
        'Dedicated account manager',
        'API access for custom integrations',
        'SSO integration',
        'GDPR compliance tools',
        'Custom training and onboarding',
        'Priority processing',
        '1 month free trial'
      ],
      limits: {
        queries: -1,
        collaborators: -1,
        storage: '100GB'
      }
    }
  ];

  const getPrice = (tier) => {
    const basePrice = tier.price;
    if (isAnnual) {
      const annualPrice = basePrice * 12 * (1 - tier.annualDiscount);
      return {
        monthly: Math.round(annualPrice / 12),
        annual: Math.round(annualPrice),
        savings: Math.round(basePrice * 12 - annualPrice)
      };
    }
    return {
      monthly: basePrice,
      annual: basePrice * 12,
      savings: 0
    };
  };

  const handleSubscribe = async (tierId) => {
    if (!isAuthenticated) {
      navigate('/auth?mode=signup');
      return;
    }

    try {
      await subscribe(tierId);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const getButtonText = (tierId) => {
    if (!isAuthenticated) return 'Start Free Trial';
    if (currentTier === tierId) return 'Current Plan';
    if (currentTier && currentTier !== 'free') return 'Upgrade';
    return 'Subscribe';
  };

  const isCurrentPlan = (tierId) => currentTier === tierId;

  const faqs = [
    {
      question: "What's the difference between the intelligence levels?",
      answer: "Our Advanced AI tier provides excellent research capabilities for students. Ultra-Intelligent adds unlimited queries and collaboration features for active researchers. PhD-Level Intelligence includes institutional management and advanced analytics for research teams."
    },
    {
      question: "Is my research data secure and GDPR compliant?",
      answer: "Yes. Scholar-AI is built with European privacy standards in mind. All data is processed within EU servers with enterprise-grade security and full GDPR compliance."
    },
    {
      question: "Can I upgrade between intelligence levels?",
      answer: "Absolutely! You can upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate billing accordingly."
    },
    {
      question: "Do you offer educational discounts?",
      answer: "Yes, we offer special pricing for educational institutions. Contact our sales team for volume pricing and institutional licenses."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-6 ice-gradient text-white border-primary/30">
            <Zap className="h-3 w-3 mr-1" />
            Flexible Pricing
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 ice-gradient-text">
            Choose Your Research Intelligence Level
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Scale your research capabilities from Advanced AI to PhD-Level Intelligence
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
              Save up to 25%
            </Badge>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => {
            const pricing = getPrice(tier);
            const IconComponent = tier.icon;
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="ice-gradient text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`glass hover:glass-strong transition-all duration-300 h-full relative ${
                  tier.popular ? 'ring-2 ring-primary/50 scale-105' : ''
                } ${isCurrentPlan(tier.id) ? 'ring-2 ring-green-500/50' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <div className={`p-3 rounded-xl w-fit mx-auto mb-4 ${
                      tier.color === 'blue' ? 'bg-blue-500/20' :
                      tier.color === 'purple' ? 'bg-purple-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        tier.color === 'blue' ? 'text-blue-400' :
                        tier.color === 'purple' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`} />
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-sm mb-6">
                      {tier.subtitle}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">€{pricing.monthly}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      
                      {isAnnual && pricing.savings > 0 && (
                        <div className="text-sm text-green-400">
                          Save €{pricing.savings}/year
                        </div>
                      )}
                      
                      {isAnnual && (
                        <div className="text-xs text-muted-foreground">
                          Billed annually (€{pricing.annual})
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Limits */}
                    <div className="border-t border-border/50 pt-6">
                      <h4 className="font-medium mb-3">Usage Limits</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Research Queries</span>
                          <span className="font-medium">
                            {tier.limits.queries === -1 ? (
                              <div className="flex items-center gap-1">
                                <Infinity className="h-4 w-4" />
                                Unlimited
                              </div>
                            ) : (
                              `${tier.limits.queries}/month`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collaborators</span>
                          <span className="font-medium">
                            {tier.limits.collaborators === -1 ? (
                              <div className="flex items-center gap-1">
                                <Infinity className="h-4 w-4" />
                                Unlimited
                              </div>
                            ) : (
                              tier.limits.collaborators
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage</span>
                          <span className="font-medium">{tier.limits.storage}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Button
                      className={`w-full ${
                        tier.popular 
                          ? 'ice-gradient hover:opacity-90' 
                          : 'border-primary/30'
                      }`}
                      variant={tier.popular ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={loading || isCurrentPlan(tier.id)}
                    >
                      {isCurrentPlan(tier.id) ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          {getButtonText(tier.id)}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Feature Comparison</CardTitle>
              <CardDescription className="text-lg">
                Compare all features across our intelligence levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-4 px-4">Features</th>
                      <th className="text-center py-4 px-4">Advanced AI</th>
                      <th className="text-center py-4 px-4">Ultra-Intelligent</th>
                      <th className="text-center py-4 px-4">PhD-Level</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">AI-Powered Research</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">Citation Management</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">Real-time Collaboration</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">Advanced Export Formats</td>
                      <td className="text-center py-3 px-4">PDF only</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">SSO Integration</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-4">Admin Dashboard</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Priority Support</td>
                      <td className="text-center py-3 px-4">Email</td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                      <td className="text-center py-3 px-4">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 ice-gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Scholar-AI intelligence levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass hover:glass-strong transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="glass-strong max-w-4xl mx-auto">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
                Ready to Elevate Your Research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Choose the intelligence level that matches your research ambitions and join thousands of European researchers accelerating their academic work.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="ice-gradient hover:opacity-90 transition-opacity text-lg px-8 py-6"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/30 text-lg px-8 py-6"
                >
                  Schedule Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;

