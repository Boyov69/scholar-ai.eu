import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  Search, 
  BookOpen, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  GraduationCap,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingTiers = [
    {
      id: 'advanced',
      title: 'Advanced AI-Powered Research Platform',
      subtitle: 'Perfect for students and early researchers',
      icon: GraduationCap,
      price: billingCycle === 'monthly' ? 29 : 22,
      originalPrice: billingCycle === 'monthly' ? null : 29,
      features: [
        '50 research queries/month',
        'Standard citation formats (APA, MLA, Chicago)',
        'PDF export functionality',
        'Email support',
        'Basic collaboration tools'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      id: 'ultra',
      title: 'Ultra-Intelligent Academic Platform',
      subtitle: 'Ideal for researchers and academic professionals',
      icon: Brain,
      price: billingCycle === 'monthly' ? 99 : 74,
      originalPrice: billingCycle === 'monthly' ? null : 99,
      features: [
        'Unlimited research queries',
        'All citation formats + BibTeX',
        'Advanced collaboration workspace',
        'University SSO integration',
        'Priority support',
        'Real-time research synthesis'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      id: 'phd',
      title: 'PhD-Level Academic Intelligence',
      subtitle: 'Comprehensive solution for universities and institutions',
      icon: Crown,
      price: billingCycle === 'monthly' ? 299 : 224,
      originalPrice: billingCycle === 'monthly' ? null : 299,
      features: [
        'Unlimited research queries',
        'Multi-user management dashboard',
        'Advanced analytics and reporting',
        'White-label customization',
        'Dedicated account manager',
        'API access for custom integrations',
        'SSO integration',
        'GDPR compliance tools'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'Elite AI-Powered Research',
      description: 'Advanced AI agents analyze literature, synthesize findings, and identify research gaps automatically using cutting-edge FutureHouse technology.'
    },
    {
      icon: Search,
      title: 'Multi-Agent Query Processing',
      description: 'Crow, Falcon, Owl, and Phoenix agents work together to deliver comprehensive research results that exceed PhD-level accuracy.'
    },
    {
      icon: BookOpen,
      title: 'Intelligent Citation Management',
      description: 'Automatic citation formatting in APA, MLA, Chicago, and BibTeX with real-time accuracy verification and academic style compliance.'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work seamlessly with research teams across European institutions with live editing, shared workspaces, and instant synchronization.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Track research progress, analyze productivity patterns, and gain insights into your academic workflow with comprehensive reporting.'
    },
    {
      icon: Shield,
      title: 'GDPR Compliant Security',
      description: 'Enterprise-grade security with European data residency, ensuring your research data remains private and compliant.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Dubois',
      role: 'Research Professor, Sorbonne University',
      content: 'Scholar-AI has revolutionized our research methodology. The AI synthesis is incredibly accurate and saves weeks of literature review time.',
      rating: 5
    },
    {
      name: 'Prof. Henrik Larsson',
      role: 'Department Head, KTH Royal Institute of Technology',
      content: 'The citation management and collaboration features saved our team 40% of research time. Essential for any serious academic work.',
      rating: 5
    },
    {
      name: 'Dr. Anna Kowalski',
      role: 'Research Director, University of Warsaw',
      content: 'Our institution has seen a 60% improvement in research efficiency since adopting Scholar-AI. The PhD-level intelligence tier is remarkable.',
      rating: 5
    }
  ];

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
    },
    {
      question: "How does the AI research technology work?",
      answer: "Scholar-AI uses advanced AI agents (Crow, Falcon, Owl, Phoenix) that analyze vast literature databases, synthesize findings, and provide accurate citations - all powered by cutting-edge FutureHouse technology."
    }
  ];

  const stats = [
    { value: '1M+', label: 'Papers Analyzed' },
    { value: '500+', label: 'Universities' },
    { value: '50K+', label: 'Researchers' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 ice-gradient opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 ice-gradient text-white border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 ice-gradient-text">
              Europe's Premier Academic Research Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Accelerate your research with AI-powered literature analysis, automatic citation management, 
              and real-time collaboration tools designed for European universities.
            </p>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              From Advanced AI capabilities to PhD-Level Intelligence - choose the research power that matches your academic journey. 
              Trusted by 50K+ researchers across 500+ European institutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="ice-gradient hover:opacity-90 transition-opacity text-lg px-8 py-6"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=signup')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary/30 text-lg px-8 py-6"
                onClick={() => navigate('/pricing')}
              >
                View Intelligence Levels
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold ice-gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
              Advanced Research Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to transform your research workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass hover:glass-strong transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="p-3 rounded-lg ice-gradient w-fit mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-6 ice-gradient text-white border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
              Flexible Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
              Choose Your Research Intelligence Level
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Scale your research capabilities from Advanced AI to PhD-Level Intelligence
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : ''}`}></div>
              </button>
              <span className={`text-sm ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
              {billingCycle === 'annual' && (
                <Badge variant="secondary" className="text-xs">Save up to 25%</Badge>
              )}
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative h-full transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  tier.popular 
                    ? 'glass-strong border-primary shadow-xl shadow-primary/20' 
                    : 'glass hover:glass-strong'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="ice-gradient text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="p-3 rounded-lg ice-gradient w-fit mx-auto mb-4">
                      <tier.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{tier.title}</CardTitle>
                    <CardDescription className="text-sm mb-6">{tier.subtitle}</CardDescription>
                    
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">€{tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {tier.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">€{tier.originalPrice}/month</div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${tier.popular ? 'ice-gradient hover:opacity-90' : 'variant-outline'}`}
                      onClick={() => navigate('/auth?mode=signup')}
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
              Trusted by Researchers Across Europe
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what leading academics and institutions say about Scholar-AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass hover:glass-strong transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Scholar-AI intelligence levels
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass hover:glass-strong transition-all duration-300">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="glass-strong max-w-4xl mx-auto">
              <CardContent className="pt-12 pb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
                  Ready to Transform Your Research?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of European researchers who have accelerated their academic work with Scholar-AI's advanced intelligence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="ice-gradient hover:opacity-90 transition-opacity text-lg px-8 py-6"
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=signup')}
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
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
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

