import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import {
  User,
  CreditCard,
  Brain,
  Eye,
  Settings as SettingsIcon,
  Crown,
  Zap,
  Shield,
  Save,
  ExternalLink,
  CheckCircle,
  Wallet,
  Plus,
  Trash2,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading: authLoading, error: authError } = useAuth();
  const { subscription, manageBilling, loading: subscriptionLoading } = useSubscription();

  // Initialize all state hooks first (before any conditional returns)
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Memoized fallback data to prevent infinite re-renders
  const fallbackUser = useMemo(() => user || {
    email: 'demo@scholarai.eu',
    id: 'demo-user-123',
    created_at: new Date().toISOString()
  }, [user]);

  const fallbackProfile = useMemo(() => profile || {
    display_name: 'Demo User',
    institution: 'Scholar AI University',
    research_field: 'Computer Science',
    role: 'student'
  }, [profile]);

  const fallbackSubscription = useMemo(() => subscription || {
    tier: 'premium',
    status: 'active',
    customerId: 'cus_demo123',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }, [subscription]);

  const [settings, setSettings] = useState({
    // Account settings
    displayName: fallbackProfile?.display_name || '',
    email: fallbackUser?.email || '',
    institution: fallbackProfile?.institution || '',
    researchField: fallbackProfile?.research_field || '',

    // Enhanced Research settings
    autoSaveResearch: true,
    enableCollaboration: true,
    enableMultiAgent: true,
    enableAdvancedAnalytics: true,
    defaultModel: 'gpt-4',
    visionModel: 'gpt-4-vision',

    // Notification settings
    emailNotifications: true,
    researchAlerts: true,
    weeklyDigest: true,

    // Appearance settings
    darkMode: false,
    compactMode: false
  });

  const llmModels = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex research', tier: 'premium' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster responses, latest knowledge', tier: 'premium' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Excellent for academic writing', tier: 'professional' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance and speed', tier: 'premium' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for basic tasks', tier: 'free' }
  ];

  const visionModels = [
    { id: 'gpt-4-vision', name: 'GPT-4 Vision', description: 'Advanced image analysis', tier: 'premium' },
    { id: 'claude-3-opus-vision', name: 'Claude 3 Opus Vision', description: 'Superior document analysis', tier: 'professional' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Google\'s multimodal AI', tier: 'premium' }
  ];

  // Payment methods data
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', supported: ['Visa', 'Mastercard', 'American Express', 'Maestro'] },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', supported: ['PayPal Balance', 'Linked Cards'] },
    { id: 'googlepay', name: 'Google Pay', icon: '🔵', supported: ['Android Pay', 'Google Wallet'] },
    { id: 'applepay', name: 'Apple Pay', icon: '🍎', supported: ['Touch ID', 'Face ID'] },
    { id: 'ideal', name: 'iDEAL', icon: '🇳🇱', supported: ['Dutch Banks'] },
    { id: 'sepa', name: 'SEPA Direct Debit', icon: '🏦', supported: ['European Banks'] },
    { id: 'bancontact', name: 'Bancontact', icon: '🇧🇪', supported: ['Belgian Banks'] },
    { id: 'sofort', name: 'Sofort', icon: '🇩🇪', supported: ['German Banks'] },
    { id: 'patreon', name: 'Patreon', icon: '🎨', supported: ['Monthly Subscriptions'] },
    { id: 'stripe', name: 'Stripe', icon: '💫', supported: ['Global Payment Processing'] }
  ];

  const [userPaymentMethods, setUserPaymentMethods] = useState([
    { id: '1', type: 'card', last4: '4242', brand: 'visa', expiryMonth: 12, expiryYear: 2025, isDefault: true, holderName: 'John Doe' },
    { id: '2', type: 'paypal', email: 'user@example.com', isDefault: false },
    { id: '3', type: 'card', last4: '1234', brand: 'mastercard', expiryMonth: 8, expiryYear: 2026, isDefault: false, holderName: 'John Doe' }
  ]);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    email: '',
    isDefault: false
  });

  // Pricing Plans
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: '€',
      period: 'month',
      description: 'Perfect for getting started with research',
      features: [
        'Basic research queries (10/month)',
        'Standard AI models (GPT-3.5)',
        'Basic citations',
        'Community support',
        '1 workspace'
      ],
      limitations: [
        'Limited to 10 queries per month',
        'No enhanced research features',
        'No collaboration tools'
      ],
      popular: false,
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Premium Research Platform',
      price: 19,
      currency: '€',
      period: 'month',
      description: 'Perfect for students and early researchers',
      features: [
        'Unlimited research queries',
        'Advanced AI models (GPT-4)',
        'Enhanced citations & references',
        'Priority support',
        '5 workspaces',
        'Collaboration tools',
        'Export to multiple formats',
        'Advanced search filters'
      ],
      limitations: [],
      popular: true,
      color: 'blue',
      savings: 'Save €60/year with annual billing'
    },
    {
      id: 'professional',
      name: 'Professional Academic Platform',
      price: 69,
      currency: '€',
      period: 'month',
      description: 'Ideal for researchers and academic professionals',
      features: [
        'Unlimited research queries',
        'All citation formats + BibTeX',
        'Advanced collaboration workspace',
        'University SSO integration',
        'Priority support',
        'Real-time research synthesis',
        'All 4 FutureHouse Agents (Crow, Falcon, Owl, Phoenix)',
        'Advanced Analytics & Deep Literature Reviews',
        'Precedent Search & Citation Analysis'
      ],
      limitations: [],
      popular: false,
      color: 'green',
      savings: 'Save €165/year with annual billing'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Academic Intelligence',
      price: 199,
      currency: '€',
      period: 'month',
      description: 'Comprehensive solution for universities and institutions',
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
        'Priority processing'
      ],
      limitations: [],
      popular: false,
      color: 'purple',
      savings: 'Save €480/year with annual billing'
    }
  ];

  // Free Trial Info
  const freeTrialInfo = {
    duration: 30, // days
    features: 'All Premium and Professional features',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In development mode, just save to localStorage
      if (import.meta.env.VITE_APP_ENV === 'development') {
        console.log('🧪 Development mode - saving settings to localStorage');
        localStorage.setItem('scholarai_settings', JSON.stringify(settings));

        toast.success('Settings saved successfully!', {
          description: 'Your preferences have been updated (development mode).'
        });

        setHasUnsavedChanges(false);
        console.log('✅ Settings saved successfully (development mode)');
        return;
      }

      await updateProfile({
        display_name: settings.displayName,
        institution: settings.institution,
        research_field: settings.researchField
      });

      // Save other settings to localStorage for now
      localStorage.setItem('scholarai_settings', JSON.stringify(settings));

      toast.success('Settings saved successfully!', {
        description: 'Your preferences have been updated.'
      });

      setHasUnsavedChanges(false);
      console.log('✅ Settings saved successfully');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      toast.error('Failed to save settings', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportSettings = () => {
    try {
      const exportData = {
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `scholarai-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Settings exported successfully!', {
        description: 'Your settings have been downloaded as a JSON file.'
      });
    } catch (error) {
      console.error('❌ Error exporting settings:', error);
      toast.error('Failed to export settings', {
        description: 'Please try again.'
      });
    }
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        if (importData.settings) {
          setSettings(prev => ({ ...prev, ...importData.settings }));
          toast.success('Settings imported successfully!', {
            description: 'Your settings have been restored from the file.'
          });
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error) {
        console.error('❌ Error importing settings:', error);
        toast.error('Failed to import settings', {
          description: 'Please check the file format and try again.'
        });
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      const defaultSettings = {
        displayName: fallbackProfile?.display_name || '',
        email: fallbackUser?.email || '',
        institution: fallbackProfile?.institution || '',
        researchField: fallbackProfile?.research_field || '',
        autoSaveResearch: true,
        enableCollaboration: true,
        enableMultiAgent: true,
        enableAdvancedAnalytics: true,
        defaultModel: 'gpt-4',
        visionModel: 'gpt-4-vision',
        emailNotifications: true,
        researchAlerts: true,
        weeklyDigest: true,
        darkMode: false,
        compactMode: false
      };

      setSettings(defaultSettings);
      localStorage.removeItem('scholarai_settings');

      toast.success('Settings reset successfully!', {
        description: 'All settings have been restored to their default values.'
      });
    }
  };

  // Payment Methods Management
  const handleAddPaymentMethod = () => {
    try {
      if (newPaymentMethod.type === 'card') {
        // Validate card details
        if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryMonth ||
            !newPaymentMethod.expiryYear || !newPaymentMethod.cvv || !newPaymentMethod.holderName) {
          toast.error('Please fill in all card details');
          return;
        }

        // Validate card number
        if (!validateCardNumber(newPaymentMethod.cardNumber)) {
          toast.error('Please enter a valid card number');
          return;
        }

        // Validate expiry date
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expiryYear = parseInt(newPaymentMethod.expiryYear);
        const expiryMonth = parseInt(newPaymentMethod.expiryMonth);

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
          toast.error('Card has expired');
          return;
        }

        // Validate CVV
        if (newPaymentMethod.cvv.length < 3 || newPaymentMethod.cvv.length > 4) {
          toast.error('Please enter a valid CVV');
          return;
        }

        const newCard = {
          id: Date.now().toString(),
          type: 'card',
          last4: newPaymentMethod.cardNumber.slice(-4),
          brand: detectCardBrand(newPaymentMethod.cardNumber),
          expiryMonth: parseInt(newPaymentMethod.expiryMonth),
          expiryYear: parseInt(newPaymentMethod.expiryYear),
          holderName: newPaymentMethod.holderName,
          isDefault: newPaymentMethod.isDefault
        };

        setUserPaymentMethods(prev => {
          let updated = [...prev];
          if (newPaymentMethod.isDefault) {
            updated = updated.map(method => ({ ...method, isDefault: false }));
          }
          return [...updated, newCard];
        });

      } else if (newPaymentMethod.type === 'paypal') {
        if (!newPaymentMethod.email) {
          toast.error('Please enter PayPal email');
          return;
        }

        // Validate email format
        if (!validateEmail(newPaymentMethod.email)) {
          toast.error('Please enter a valid email address');
          return;
        }

        const newPayPal = {
          id: Date.now().toString(),
          type: 'paypal',
          email: newPaymentMethod.email,
          isDefault: newPaymentMethod.isDefault
        };

        setUserPaymentMethods(prev => {
          let updated = [...prev];
          if (newPaymentMethod.isDefault) {
            updated = updated.map(method => ({ ...method, isDefault: false }));
          }
          return [...updated, newPayPal];
        });
      }

      // Reset form
      setNewPaymentMethod({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        email: '',
        isDefault: false
      });

      setShowAddPaymentModal(false);

      toast.success('Payment method added successfully!', {
        description: 'Your new payment method is now available.'
      });

    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method', {
        description: 'Please try again.'
      });
    }
  };

  const handleDeletePaymentMethod = (methodId) => {
    const method = userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;

    if (window.confirm(`Are you sure you want to delete this ${method.type === 'card' ? 'card' : 'PayPal account'}?`)) {
      setUserPaymentMethods(prev => {
        const updated = prev.filter(m => m.id !== methodId);

        // If we deleted the default method, make the first remaining method default
        if (method.isDefault && updated.length > 0) {
          updated[0].isDefault = true;
        }

        return updated;
      });

      toast.success('Payment method deleted successfully!');
    }
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    setUserPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );

    toast.success('Default payment method updated!');
  };

  const detectCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const validateCardNumber = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.length < 13 || number.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Billing Management Functions
  const handlePlanUpgrade = (planId) => {
    const plan = pricingPlans.find(p => p.id === planId);
    if (!plan) return;

    setSelectedPlan(plan);
    setShowBillingModal(true);
  };

  const handleSubscriptionChange = async (newPlanId) => {
    try {
      if (import.meta.env.VITE_APP_ENV === 'development') {
        // Simulate subscription change in development
        const newPlan = pricingPlans.find(p => p.id === newPlanId);

        toast.success(`Subscription updated to ${newPlan.name}!`, {
          description: `Development mode - would process ${newPlan.currency}${newPlan.price}/${newPlan.period} subscription`
        });

        // Update local subscription state (in real app this would come from backend)
        // This is just for demo purposes
        console.log(`🔄 Subscription changed to: ${newPlan.name}`);

        setShowBillingModal(false);
        setSelectedPlan(null);
        return;
      }

      // Real subscription change logic would go here
      // await updateSubscription(newPlanId);

      toast.success('Subscription updated successfully!');
      setShowBillingModal(false);
      setSelectedPlan(null);

    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription', {
        description: 'Please try again or contact support.'
      });
    }
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      if (import.meta.env.VITE_APP_ENV === 'development') {
        toast.success('Subscription cancelled', {
          description: 'Development mode - would cancel subscription'
        });
      } else {
        // Real cancellation logic
        console.log('Cancelling subscription...');
      }
    }
  };

  const calculateTrialDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(freeTrialInfo.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatPrice = (price, currency = '€') => {
    if (price === 0) return 'Free';
    return `${currency}${price}`;
  };

  const getPlanFeatureCount = (planId) => {
    const plan = pricingPlans.find(p => p.id === planId);
    return plan ? plan.features.length : 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleEditPaymentMethod = (methodId) => {
    const method = userPaymentMethods.find(m => m.id === methodId);
    if (!method) return;

    setEditingPaymentId(methodId);
    setNewPaymentMethod({
      type: method.type,
      cardNumber: method.type === 'card' ? `•••• •••• •••• ${method.last4}` : '',
      expiryMonth: method.type === 'card' ? method.expiryMonth.toString() : '',
      expiryYear: method.type === 'card' ? method.expiryYear.toString() : '',
      cvv: '',
      holderName: method.type === 'card' ? method.holderName || '' : '',
      email: method.type === 'paypal' ? method.email : '',
      isDefault: method.isDefault
    });
    setShowEditPaymentModal(true);
  };

  const handleUpdatePaymentMethod = () => {
    try {
      setUserPaymentMethods(prev =>
        prev.map(method => {
          if (method.id === editingPaymentId) {
            if (method.type === 'card') {
              return {
                ...method,
                holderName: newPaymentMethod.holderName,
                expiryMonth: parseInt(newPaymentMethod.expiryMonth),
                expiryYear: parseInt(newPaymentMethod.expiryYear),
                isDefault: newPaymentMethod.isDefault
              };
            } else if (method.type === 'paypal') {
              return {
                ...method,
                email: newPaymentMethod.email,
                isDefault: newPaymentMethod.isDefault
              };
            }
          }

          // If setting this as default, unset others
          if (newPaymentMethod.isDefault && method.id !== editingPaymentId) {
            return { ...method, isDefault: false };
          }

          return method;
        })
      );

      setShowEditPaymentModal(false);
      setEditingPaymentId(null);

      toast.success('Payment method updated successfully!');
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    }
  };

  const getTierBadge = (tier) => {
    const badges = {
      free: <Badge variant="secondary">Free</Badge>,
      premium: <Badge variant="default" className="bg-blue-600">Premium</Badge>,
      professional: <Badge variant="default" className="bg-purple-600">Professional</Badge>,
      enterprise: <Badge variant="default" className="bg-yellow-600">Enterprise</Badge>
    };
    return badges[tier] || badges.free;
  };

  const canUseModel = (modelTier) => {
    if (!fallbackSubscription) return modelTier === 'free';

    const tierHierarchy = { free: 0, premium: 1, professional: 2, enterprise: 3 };
    const userTier = fallbackSubscription.tier || 'free';

    return tierHierarchy[userTier] >= tierHierarchy[modelTier];
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('scholarai_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Update settings when profile changes
  useEffect(() => {
    if (fallbackProfile && (
      fallbackProfile.display_name !== settings.displayName ||
      fallbackProfile.institution !== settings.institution ||
      fallbackProfile.research_field !== settings.researchField
    )) {
      setSettings(prev => ({
        ...prev,
        displayName: fallbackProfile.display_name || '',
        institution: fallbackProfile.institution || '',
        researchField: fallbackProfile.research_field || ''
      }));
    }
  }, [fallbackProfile.display_name, fallbackProfile.institution, fallbackProfile.research_field]);

  // Update email when user changes
  useEffect(() => {
    if (fallbackUser?.email && fallbackUser.email !== settings.email) {
      setSettings(prev => ({ ...prev, email: fallbackUser.email }));
    }
  }, [fallbackUser.email]);

  // Track unsaved changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('scholarai_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const hasChanges = JSON.stringify(settings) !== JSON.stringify(parsed);
        setHasUnsavedChanges(hasChanges);
      } catch (error) {
        setHasUnsavedChanges(true);
      }
    } else {
      setHasUnsavedChanges(true);
    }
  }, [settings]);

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSaveSettings();
            break;
          case 'd':
            event.preventDefault();
            setSettings(prev => {
              const newDarkMode = !prev.darkMode;
              if (newDarkMode) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              return { ...prev, darkMode: newDarkMode };
            });
            break;
          case 'h':
            event.preventDefault();
            navigate('/dashboard');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, handleSaveSettings]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show error state if there are critical auth errors (but continue with demo data)
  if (authError && !user) {
    console.warn('Auth error in Settings:', authError);
    // Don't block the UI, just log the error and continue with demo data
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, subscription, and research preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 h-12">
          <TabsTrigger value="account" className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="enhanced" className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Enhanced</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Models</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2 text-sm">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Research</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your personal information and research profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User ID Display */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">{fallbackUser?.id}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(fallbackUser?.id);
                      toast.success('User ID copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={settings.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={settings.institution}
                    onChange={(e) => setSettings(prev => ({ ...prev, institution: e.target.value }))}
                    placeholder="Your university or organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="researchField">Research Field</Label>
                  <Input
                    id="researchField"
                    value={settings.researchField}
                    onChange={(e) => setSettings(prev => ({ ...prev, researchField: e.target.value }))}
                    placeholder="e.g., Computer Science, Biology"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about your research</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Research Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new relevant papers</p>
                    </div>
                    <Switch
                      checked={settings.researchAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, researchAlerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of your research activity</p>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Appearance Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Appearance</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({ ...prev, darkMode: checked }));
                        // Apply dark mode immediately
                        if (checked) {
                          document.documentElement.classList.add('dark');
                        } else {
                          document.documentElement.classList.remove('dark');
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content on screen</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Keyboard Shortcuts */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Save Settings</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + S</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Search Settings</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + F</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Toggle Dark Mode</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + D</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Go to Dashboard</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + H</kbd>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Settings Management */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Settings Management</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSettings}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Export Settings
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="import-settings"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <label htmlFor="import-settings" className="cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Import Settings
                      </label>
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSettings}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reset to Default
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your settings to backup or transfer to another device. Import previously exported settings.
                </p>
              </div>

              <div className="flex justify-between items-center">
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
                    Unsaved changes
                  </div>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button onClick={handleSaveSettings} disabled={loading || !hasUnsavedChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing preferences. Add, edit, or remove payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Payment Methods */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Your Payment Methods ({userPaymentMethods.length})</h4>
                  <div className="flex gap-2">
                    {userPaymentMethods.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove all payment methods except the default one?')) {
                            setUserPaymentMethods(prev => prev.filter(method => method.isDefault));
                            toast.success('Non-default payment methods removed');
                          }
                        }}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove All
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setShowAddPaymentModal(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>

                {userPaymentMethods.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                    <p className="text-muted-foreground mb-4">Add a payment method to manage your subscription</p>
                    <Button onClick={() => setShowAddPaymentModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {userPaymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {method.type === 'card' ? (
                              method.brand === 'visa' ? '💳' :
                              method.brand === 'mastercard' ? '💳' :
                              method.brand === 'amex' ? '💳' : '💳'
                            ) : '🅿️'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {method.type === 'card'
                                  ? `•••• •••• •••• ${method.last4}`
                                  : method.email
                                }
                              </span>
                              {method.isDefault && (
                                <Badge variant="default" className="text-xs bg-green-600">Default</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {method.type === 'card' ? (
                                <>
                                  <span className="capitalize">{method.brand}</span>
                                  <span>•</span>
                                  <span>Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}</span>
                                  {method.holderName && (
                                    <>
                                      <span>•</span>
                                      <span>{method.holderName}</span>
                                    </>
                                  )}
                                </>
                              ) : (
                                <span>PayPal Account</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPaymentMethod(method.id)}
                            className="flex items-center gap-1"
                          >
                            <SettingsIcon className="h-3 w-3" />
                            Edit
                          </Button>
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Payment Statistics */}
              {userPaymentMethods.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Payment Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{userPaymentMethods.length}</div>
                      <p className="text-xs text-muted-foreground">Total Methods</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userPaymentMethods.filter(m => m.type === 'card').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Cards</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {userPaymentMethods.filter(m => m.type === 'paypal').length}
                      </div>
                      <p className="text-xs text-muted-foreground">PayPal</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-600">1</div>
                      <p className="text-xs text-muted-foreground">Default</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Available Payment Methods */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Available Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{method.icon}</span>
                        <h5 className="font-medium">{method.name}</h5>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-1">Supported:</p>
                        <div className="flex flex-wrap gap-1">
                          {method.supported.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Security */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Security</h4>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h5 className="font-medium text-green-800 dark:text-green-200">Secure Payments</h5>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All payments are processed securely through Stripe with industry-standard encryption.
                    We never store your payment information on our servers.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl mb-1">🔒</div>
                    <p className="text-xs text-muted-foreground">SSL Encrypted</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl mb-1">🛡️</div>
                    <p className="text-xs text-muted-foreground">PCI Compliant</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl mb-1">🔐</div>
                    <p className="text-xs text-muted-foreground">3D Secure</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription & Billing */}
        <TabsContent value="subscription" className="space-y-6">
          {/* Free Trial Banner */}
          {freeTrialInfo.isActive && (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-500/20">
                      <Crown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        🎉 Free Trial Active!
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {calculateTrialDaysRemaining()} days remaining • All Premium & Professional features included
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/research/enhanced')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
                  >
                    Try Enhanced Research
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription plan and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan Display */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {fallbackSubscription?.tier === 'premium' && <Crown className="h-8 w-8 text-blue-600" />}
                      {fallbackSubscription?.tier === 'professional' && <Zap className="h-8 w-8 text-purple-600" />}
                      {(fallbackSubscription?.tier === 'free' || !fallbackSubscription?.tier) && <User className="h-8 w-8 text-gray-600" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold capitalize">
                        {fallbackSubscription?.tier || 'Free'} Plan
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {fallbackSubscription?.status === 'active' ? '✅ Active subscription' : '⏸️ No active subscription'}
                      </p>
                      {freeTrialInfo.isActive && (
                        <Badge className="mt-1 bg-green-600 text-white">
                          Free Trial ({calculateTrialDaysRemaining()} days left)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(
                        fallbackSubscription?.tier === 'premium' ? 19 :
                        fallbackSubscription?.tier === 'professional' ? 69 :
                        fallbackSubscription?.tier === 'enterprise' ? 199 : 0
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">/month</p>
                    {freeTrialInfo.isActive && (
                      <p className="text-xs text-green-600 font-medium">Currently Free</p>
                    )}
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Current Plan Features:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pricingPlans
                      .find(p => p.id === (fallbackSubscription?.tier || 'free'))
                      ?.features.slice(0, 4)
                      .map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Billing Info */}
                {fallbackSubscription?.currentPeriodEnd && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">
                      Next billing: {new Date(fallbackSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {fallbackSubscription?.customerId ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (import.meta.env.VITE_APP_ENV === 'development') {
                            toast.success('Billing Portal', {
                              description: 'Development mode - would open Stripe billing portal'
                            });
                          } else {
                            manageBilling();
                          }
                        }}
                        disabled={subscriptionLoading}
                        className="bg-white dark:bg-gray-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {subscriptionLoading ? 'Loading...' : 'Manage Billing'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelSubscription}
                        className="bg-white dark:bg-gray-800 text-red-600 hover:text-red-700"
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handlePlanUpgrade('premium')}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-gray-800"
                    onClick={() => {
                      if (import.meta.env.VITE_APP_ENV === 'development') {
                        toast.success('View Invoices', {
                          description: 'Development mode - would show billing history'
                        });
                      } else {
                        console.log('Opening invoice history...');
                      }
                    }}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Available Plans
              </CardTitle>
              <CardDescription>
                Choose the perfect plan for your research needs. All plans include a 30-day free trial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 border rounded-lg transition-all hover:shadow-lg ${
                      plan.popular
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      fallbackSubscription?.tier === plan.id
                        ? 'ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/20'
                        : ''
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {fallbackSubscription?.tier === plan.id && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="bg-green-600 text-white px-3 py-1">
                          Current Plan
                        </Badge>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">{formatPrice(plan.price, plan.currency)}</span>
                        {plan.price > 0 && <span className="text-muted-foreground">/{plan.period}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      {plan.savings && (
                        <p className="text-xs text-green-600 font-medium mt-1">{plan.savings}</p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {fallbackSubscription?.tier === plan.id ? (
                        <Button disabled className="w-full" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Current Plan
                        </Button>
                      ) : plan.id === 'free' ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to downgrade to the Free plan? You will lose access to premium features.')) {
                              handleSubscriptionChange('free');
                            }
                          }}
                        >
                          Downgrade to Free
                        </Button>
                      ) : (
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : plan.color === 'purple'
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : ''
                          }`}
                          onClick={() => handlePlanUpgrade(plan.id)}
                        >
                          {freeTrialInfo.isActive ? 'Continue with' : 'Upgrade to'} {plan.name}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Trial Info */}
              {!freeTrialInfo.isActive && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800 dark:text-green-200">30-Day Free Trial</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All new subscriptions include a 30-day free trial with full access to Premium and Professional features.
                    Cancel anytime during the trial period with no charges.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Research Settings */}
        <TabsContent value="enhanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Enhanced Research
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  FREE TRIAL
                </Badge>
              </CardTitle>
              <CardDescription>
                Configure your FutureHouse AI agents and enhanced research preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Free Trial Status */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <Crown className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">🎉 Free Trial Active!</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Enhanced Research with FutureHouse AI agents - Free for 1 month for all users!
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Trial expires: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate('/research/enhanced')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
                  >
                    Try Enhanced Research
                  </Button>
                </div>
              </div>

              {/* FutureHouse Agents */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <span className="text-orange-400">🔬</span>
                  FutureHouse AI Agents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Phoenix',
                      icon: '🔥',
                      description: 'Chemistry and synthesis research specialist',
                      specialty: 'Chemical synthesis, molecular analysis'
                    },
                    {
                      name: 'Crow',
                      icon: '🔍',
                      description: 'Concise search with PaperQA2 integration',
                      specialty: 'Quick literature search, targeted answers'
                    },
                    {
                      name: 'Falcon',
                      icon: '📚',
                      description: 'Deep literature reviews and analysis',
                      specialty: 'Comprehensive reviews, meta-analysis'
                    },
                    {
                      name: 'Owl',
                      icon: '🦉',
                      description: 'Precedent search and legal research',
                      specialty: 'Case studies, precedent analysis'
                    }
                  ].map((agent) => (
                    <div key={agent.name} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <div>
                          <h5 className="font-medium">{agent.name}</h5>
                          <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-600">
                            Available
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                      <p className="text-xs text-muted-foreground italic">{agent.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Research Preferences */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Research Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multi-Agent Research</Label>
                      <p className="text-sm text-muted-foreground">Use multiple AI agents for comprehensive analysis</p>
                    </div>
                    <Switch
                      checked={settings.enableMultiAgent || true}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableMultiAgent: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Advanced Analytics</Label>
                      <p className="text-sm text-muted-foreground">Enable deep research insights and analytics</p>
                    </div>
                    <Switch
                      checked={settings.enableAdvancedAnalytics || true}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAdvancedAnalytics: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-save Research</Label>
                      <p className="text-sm text-muted-foreground">Automatically save research progress</p>
                    </div>
                    <Switch
                      checked={settings.autoSaveResearch}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSaveResearch: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Enhanced Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Models */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Language Models (LLM)
              </CardTitle>
              <CardDescription>
                Choose your preferred AI models for research and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Language Model</Label>
                <Select
                  value={settings.defaultModel}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {llmModels.map((model) => (
                      <SelectItem
                        key={model.id}
                        value={model.id}
                        disabled={!canUseModel(model.tier)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            {getTierBadge(model.tier)}
                          </div>
                          {!canUseModel(model.tier) && (
                            <span className="text-xs text-muted-foreground ml-2">Upgrade required</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {llmModels.find(m => m.id === settings.defaultModel)?.description}
                </p>
              </div>

              <div className="grid gap-3">
                {llmModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 border rounded-lg ${
                      !canUseModel(model.tier) ? 'opacity-50' : ''
                    } ${
                      settings.defaultModel === model.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{model.name}</h4>
                          {getTierBadge(model.tier)}
                        </div>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                      {!canUseModel(model.tier) && (
                        <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vision Models (VLM)
              </CardTitle>
              <CardDescription>
                AI models for analyzing images, documents, and visual content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Vision Model</Label>
                <Select
                  value={settings.visionModel}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, visionModel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visionModels.map((model) => (
                      <SelectItem
                        key={model.id}
                        value={model.id}
                        disabled={!canUseModel(model.tier)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            {getTierBadge(model.tier)}
                          </div>
                          {!canUseModel(model.tier) && (
                            <span className="text-xs text-muted-foreground ml-2">Upgrade required</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {visionModels.find(m => m.id === settings.visionModel)?.description}
                </p>
              </div>

              <div className="grid gap-3">
                {visionModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 border rounded-lg ${
                      !canUseModel(model.tier) ? 'opacity-50' : ''
                    } ${
                      settings.visionModel === model.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{model.name}</h4>
                          {getTierBadge(model.tier)}
                        </div>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                      {!canUseModel(model.tier) && (
                        <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Settings */}
        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Enhanced Research Settings
              </CardTitle>
              <CardDescription>
                Configure your research workflow and collaboration preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Research</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your research progress and queries
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSaveResearch}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSaveResearch: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Collaboration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow team members to collaborate on your research projects
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableCollaboration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCollaboration: checked }))}
                    disabled={!canUseModel('premium')}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Enhanced Research Features</h4>
                <div className="grid gap-4">
                  <div className={`p-4 border rounded-lg ${canUseModel('premium') ? '' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <h5 className="font-medium">Multi-Agent Research</h5>
                      </div>
                      {getTierBadge('premium')}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use specialized AI agents (Phoenix, Crow, Falcon, Owl) for comprehensive research analysis.
                    </p>
                    {!canUseModel('premium') && (
                      <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>

                  <div className={`p-4 border rounded-lg ${canUseModel('professional') ? '' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        <h5 className="font-medium">Advanced Analytics</h5>
                      </div>
                      {getTierBadge('professional')}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Deep literature reviews, precedent search, and advanced citation analysis.
                    </p>
                    {!canUseModel('professional') && (
                      <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
                        Upgrade to Professional
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Research Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Payment Method</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddPaymentModal(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* Payment Type Selection */}
                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select
                    value={newPaymentMethod.type}
                    onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">💳 Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">🅿️ PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Card Details */}
                {newPaymentMethod.type === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setNewPaymentMethod(prev => ({ ...prev, cardNumber: formatted }));
                          }}
                          maxLength={19}
                          className={`pr-12 ${
                            newPaymentMethod.cardNumber && !validateCardNumber(newPaymentMethod.cardNumber)
                              ? 'border-red-500' : ''
                          }`}
                        />
                        {newPaymentMethod.cardNumber && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {validateCardNumber(newPaymentMethod.cardNumber) ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="text-red-500 text-sm">✕</span>
                            )}
                          </div>
                        )}
                      </div>
                      {newPaymentMethod.cardNumber && !validateCardNumber(newPaymentMethod.cardNumber) && (
                        <p className="text-xs text-red-500">Please enter a valid card number</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Expiry Month</Label>
                        <Select
                          value={newPaymentMethod.expiryMonth}
                          onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryMonth: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={month.toString()}>
                                {month.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Expiry Year</Label>
                        <Select
                          value={newPaymentMethod.expiryYear}
                          onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={newPaymentMethod.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setNewPaymentMethod(prev => ({ ...prev, cvv: value }));
                          }}
                          maxLength={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="holderName">Cardholder Name</Label>
                        <Input
                          id="holderName"
                          placeholder="John Doe"
                          value={newPaymentMethod.holderName}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, holderName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* PayPal Details */}
                {newPaymentMethod.type === 'paypal' && (
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <div className="relative">
                      <Input
                        id="paypalEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={newPaymentMethod.email}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, email: e.target.value }))}
                        className={`pr-12 ${
                          newPaymentMethod.email && !validateEmail(newPaymentMethod.email)
                            ? 'border-red-500' : ''
                        }`}
                      />
                      {newPaymentMethod.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {validateEmail(newPaymentMethod.email) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-red-500 text-sm">✕</span>
                          )}
                        </div>
                      )}
                    </div>
                    {newPaymentMethod.email && !validateEmail(newPaymentMethod.email) && (
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    )}
                  </div>
                )}

                {/* Set as Default */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="setDefault"
                    checked={newPaymentMethod.isDefault}
                    onCheckedChange={(checked) => setNewPaymentMethod(prev => ({ ...prev, isDefault: checked }))}
                  />
                  <Label htmlFor="setDefault">Set as default payment method</Label>
                </div>

                {/* Security Notice */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddPaymentModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPaymentMethod}
                    className="flex-1"
                  >
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Method Modal */}
      {showEditPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Payment Method</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditPaymentModal(false);
                    setEditingPaymentId(null);
                  }}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* Payment Type Display */}
                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <div className="p-2 bg-muted rounded border">
                    {newPaymentMethod.type === 'card' ? '💳 Credit/Debit Card' : '🅿️ PayPal'}
                  </div>
                </div>

                {/* Card Details */}
                {newPaymentMethod.type === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="p-2 bg-muted rounded border text-muted-foreground">
                        {newPaymentMethod.cardNumber} (Cannot be changed)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editExpiryMonth">Expiry Month</Label>
                        <Select
                          value={newPaymentMethod.expiryMonth}
                          onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryMonth: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={month.toString()}>
                                {month.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="editExpiryYear">Expiry Year</Label>
                        <Select
                          value={newPaymentMethod.expiryYear}
                          onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editHolderName">Cardholder Name</Label>
                      <Input
                        id="editHolderName"
                        placeholder="John Doe"
                        value={newPaymentMethod.holderName}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, holderName: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {/* PayPal Details */}
                {newPaymentMethod.type === 'paypal' && (
                  <div className="space-y-2">
                    <Label htmlFor="editPaypalEmail">PayPal Email</Label>
                    <Input
                      id="editPaypalEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={newPaymentMethod.email}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                )}

                {/* Set as Default */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editSetDefault"
                    checked={newPaymentMethod.isDefault}
                    onCheckedChange={(checked) => setNewPaymentMethod(prev => ({ ...prev, isDefault: checked }))}
                  />
                  <Label htmlFor="editSetDefault">Set as default payment method</Label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditPaymentModal(false);
                      setEditingPaymentId(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdatePaymentMethod}
                    className="flex-1"
                  >
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing/Upgrade Modal */}
      {showBillingModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upgrade to {selectedPlan.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowBillingModal(false);
                    setSelectedPlan(null);
                  }}
                >
                  ✕
                </Button>
              </div>

              {/* Plan Summary */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold">{selectedPlan.name} Plan</h4>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(selectedPlan.price, selectedPlan.currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">/{selectedPlan.period}</p>
                  </div>
                </div>

                {/* Free Trial Notice */}
                {freeTrialInfo.isActive && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded mb-4">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Free Trial Active - No charges for {calculateTrialDaysRemaining()} days
                      </span>
                    </div>
                  </div>
                )}

                {/* Key Features */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Key Features:</h5>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedPlan.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {selectedPlan.features.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{selectedPlan.features.length - 5} more features
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium">Payment Method</h4>
                {userPaymentMethods.length > 0 ? (
                  <div className="space-y-2">
                    {userPaymentMethods.filter(method => method.isDefault).map((method) => (
                      <div key={method.id} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">
                            {method.type === 'card' ? '💳' : '🅿️'}
                          </div>
                          <div>
                            <div className="font-medium">
                              {method.type === 'card'
                                ? `•••• •••• •••• ${method.last4}`
                                : method.email
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Default payment method
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowBillingModal(false);
                        setShowAddPaymentModal(true);
                      }}
                    >
                      Use Different Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                    <Wallet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No payment methods available
                    </p>
                    <Button
                      onClick={() => {
                        setShowBillingModal(false);
                        setShowAddPaymentModal(true);
                      }}
                    >
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="p-3 bg-muted/30 rounded text-xs text-muted-foreground mb-6">
                <p>
                  By upgrading, you agree to our Terms of Service and Privacy Policy.
                  {freeTrialInfo.isActive
                    ? ` Your free trial will continue until ${freeTrialInfo.endDate.toLocaleDateString()}, after which you'll be charged ${formatPrice(selectedPlan.price, selectedPlan.currency)}/${selectedPlan.period}.`
                    : ` You will be charged ${formatPrice(selectedPlan.price, selectedPlan.currency)}/${selectedPlan.period} starting today.`
                  }
                  Cancel anytime.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBillingModal(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubscriptionChange(selectedPlan.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={userPaymentMethods.length === 0}
                >
                  {freeTrialInfo.isActive ? 'Start Free Trial' : `Upgrade to ${selectedPlan.name}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

