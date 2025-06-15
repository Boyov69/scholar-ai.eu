import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  TrendingUp,
  CheckCircle,
  Star,
  GraduationCap,
  Crown,
  User
} from 'lucide-react';

// 🚀 PERFORMANCE: Lazy-loaded sections for better LCP
export const FeaturesSection = ({ features }) => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
);

export const PricingSection = ({ pricingTiers, billingCycle, setBillingCycle }) => {
  const navigate = useNavigate();
  
  return (
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
            Available Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
            Choose the Perfect Plan for Your Research Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            All plans include a 30-day free trial. Start your research journey today with no commitment.
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
  );
};

export const TestimonialsSection = ({ testimonials }) => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 ice-gradient-text">
          Trusted by Leading Researchers
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See what academic professionals say about Scholar-AI
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
            <Card className="glass h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
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
);

export const FAQSection = ({ faqs }) => (
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
          Everything you need to know about Scholar-AI
        </p>
      </motion.div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="glass">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
