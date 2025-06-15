import React, { useState, lazy, Suspense } from 'react';
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
  Crown,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// 🚀 PERFORMANCE: Lazy load heavy sections for better LCP
const FeaturesSection = lazy(() => import('./LandingPageSections').then(module => ({ default: module.FeaturesSection })));
const PricingSection = lazy(() => import('./LandingPageSections').then(module => ({ default: module.PricingSection })));
const TestimonialsSection = lazy(() => import('./LandingPageSections').then(module => ({ default: module.TestimonialsSection })));
const FAQSection = lazy(() => import('./LandingPageSections').then(module => ({ default: module.FAQSection })));

// 🚀 PERFORMANCE: Lightweight loading component
const SectionLoader = () => (
  <div className="py-20 px-4 flex justify-center">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-700 h-4 w-4"></div>
      <div className="rounded-full bg-slate-700 h-4 w-4"></div>
      <div className="rounded-full bg-slate-700 h-4 w-4"></div>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingTiers = [
    {
      id: 'free',
      title: 'Free Research Access',
      subtitle: 'Get started with basic research tools',
      icon: User,
      price: 0,
      originalPrice: null,
      features: [
        '5 research queries/month',
        'Basic citation formats (APA, MLA)',
        'Standard search functionality',
        'Community support',
        'Basic export options',
        'No credit card required'
      ],
      popular: false,
      cta: 'Get Started Free'
    },
    {
      id: 'premium',
      title: 'Premium Research Platform',
      subtitle: 'Perfect for students and early researchers',
      icon: GraduationCap,
      price: billingCycle === 'monthly' ? 19 : 15,
      originalPrice: billingCycle === 'monthly' ? null : 19,
      features: [
        '50 research queries/month',
        'Standard citation formats (APA, MLA, Chicago)',
        'PDF export functionality',
        'Email support',
        '30-day free trial',
        'Enhanced Research: Crow Agent Only (FutureHouse Concise Search)'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      id: 'professional',
      title: 'Professional Academic Platform',
      subtitle: 'Ideal for researchers and academic professionals',
      icon: Brain,
      price: billingCycle === 'monthly' ? 69 : 55,
      originalPrice: billingCycle === 'monthly' ? null : 69,
      features: [
        'Unlimited research queries',
        'All citation formats + BibTeX',
        'Advanced collaboration workspace',
        'University SSO integration',
        'Priority support',
        '30-day free trial',
        'All 4 FutureHouse Agents (Crow, Falcon, Owl, Phoenix)',
        'Advanced Analytics & Deep Literature Reviews'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Academic Intelligence',
      subtitle: 'Comprehensive solution for universities and institutions',
      icon: Crown,
      price: billingCycle === 'monthly' ? 199 : 149,
      originalPrice: billingCycle === 'monthly' ? null : 199,
      features: [
        'Everything in Professional',
        'Multi-user management dashboard',
        'Advanced analytics and reporting',
        'White-label customization',
        'Dedicated account manager',
        'API access for custom integrations',
        'SSO integration',
        'GDPR compliance tools',
        '30-day free trial'
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
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 backdrop-blur-sm">
                <Brain className="h-3 w-3 mr-2" />
                Powered by Advanced AI Research Agents
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Academic Research
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Powered by <span className="text-blue-400 font-semibold">PaperQA2 AI agents</span>, Scholar-AI revolutionizes how researchers discover, analyze,
              and cite academic literature with <span className="text-purple-400 font-semibold">superhuman accuracy</span>.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Research Agents</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Smart Citations</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300 text-sm font-medium">Real-time Collaboration</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg px-8 py-6 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=signup')}
              >
                <Zap className="mr-2 h-5 w-5" />
                {isAuthenticated ? 'Go to Dashboard' : 'Start Research Now'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300"
                onClick={() => navigate('/pricing')}
              >
                View Intelligence Levels
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>500+ Universities</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
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
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 PERFORMANCE: Lazy-loaded Features Section */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection features={features} />
      </Suspense>

      {/* 🚀 PERFORMANCE: Lazy-loaded Pricing Section */}
      <Suspense fallback={<SectionLoader />}>
        <PricingSection
          pricingTiers={pricingTiers}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
        />
      </Suspense>

      {/* 🚀 PERFORMANCE: Lazy-loaded Testimonials Section */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection testimonials={testimonials} />
      </Suspense>

      {/* 🚀 PERFORMANCE: Lazy-loaded FAQ Section */}
      <Suspense fallback={<SectionLoader />}>
        <FAQSection faqs={faqs} />
      </Suspense>

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
                    <span>30-day free trial</span>
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

