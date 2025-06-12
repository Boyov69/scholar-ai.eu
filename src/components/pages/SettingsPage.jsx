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
    defaultModel: 'gpt-4',
    visionModel: 'gpt-4-vision',

    // Notification settings
    emailNotifications: true,
    researchAlerts: true,
    weeklyDigest: true
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

  const userPaymentMethods = [
    { id: '1', type: 'card', last4: '4242', brand: 'visa', expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: '2', type: 'paypal', email: 'user@example.com', isDefault: false }
  ];

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

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
      <div className="mb-8">

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

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
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
                Manage your payment methods and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Payment Methods */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Your Payment Methods</h4>
                  <Button
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (import.meta.env.VITE_APP_ENV === 'development') {
                        toast.success('Add Payment Method', {
                          description: 'Development mode - would open Stripe payment method setup'
                        });
                      } else {
                        // Real Stripe integration would go here
                        console.log('Opening Stripe payment method setup...');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="grid gap-3">
                  {userPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {method.type === 'card' ? '💳' : '🅿️'}
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
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.type === 'card'
                              ? `${method.brand.toUpperCase()} • Expires ${method.expiryMonth}/${method.expiryYear}`
                              : 'PayPal Account'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (import.meta.env.VITE_APP_ENV === 'development') {
                                toast.success('Payment method set as default', {
                                  description: 'Development mode - would update default payment method'
                                });
                              } else {
                                // Real Stripe integration would go here
                                console.log('Setting payment method as default...');
                              }
                            }}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            if (import.meta.env.VITE_APP_ENV === 'development') {
                              toast.success('Payment method removed', {
                                description: 'Development mode - would remove payment method'
                              });
                            } else {
                              // Real Stripe integration would go here
                              console.log('Removing payment method...');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Plan Status */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {fallbackSubscription?.tier === 'premium' && <Crown className="h-6 w-6 text-blue-600" />}
                      {fallbackSubscription?.tier === 'professional' && <Zap className="h-6 w-6 text-purple-600" />}
                      {fallbackSubscription?.tier === 'enterprise' && <Crown className="h-6 w-6 text-yellow-600" />}
                      {fallbackSubscription?.tier === 'free' && <User className="h-6 w-6 text-gray-600" />}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold capitalize">{fallbackSubscription?.tier || 'Free'} Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        {fallbackSubscription?.status === 'active' ? '✅ Active subscription' : '⏸️ No active subscription'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {fallbackSubscription?.tier === 'premium' ? '€19' :
                       fallbackSubscription?.tier === 'professional' ? '€49' :
                       fallbackSubscription?.tier === 'enterprise' ? '€199' : '€0'}
                    </div>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>

                {fallbackSubscription?.currentPeriodEnd && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-muted-foreground">
                      Next billing: {new Date(fallbackSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {fallbackSubscription?.customerId ? (
                    <Button
                      variant="outline"
                      onClick={manageBilling}
                      disabled={subscriptionLoading}
                      className="bg-white dark:bg-gray-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.href = '/pricing'}>
                      Upgrade Plan
                    </Button>
                  )}
                  <Button variant="outline" className="bg-white dark:bg-gray-800">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Invoices
                  </Button>
                </div>
              </div>

              {subscription?.tier !== 'professional' && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Unlock Enhanced Research Features</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to access advanced AI models, unlimited research queries, and collaborative workspaces.
                  </p>
                  <Button size="sm" onClick={() => window.location.href = '/pricing'}>
                    View Plans
                  </Button>
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
                        <Button size="sm" variant="outline" onClick={() => window.location.href = '/pricing'}>
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
                        <Button size="sm" variant="outline" onClick={() => window.location.href = '/pricing'}>
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
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/pricing'}>
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
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/pricing'}>
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
    </div>
  );
};

export default SettingsPage;

