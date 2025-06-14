// Production configuration with your actual Supabase credentials
export const config = {
  // Application settings
  app: {
    name: 'Scholar-AI',
    description: "Europe's Premier Academic Research Platform",
    url: 'https://www.scholarai.eu',
    domain: 'scholarai.eu',
    supportEmail: 'support@scholarai.eu',
    version: '1.0.0'
  },

  // Supabase configuration (your actual project)
  supabase: {
    url: 'https://xicjnnzzykdhbmrpafhs.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'
  },

  // Stripe configuration (to be configured)
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
    priceIds: {
      premium_monthly: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
      premium_yearly: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
      professional_monthly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY || 'price_professional_monthly',
      professional_yearly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_YEARLY || 'price_professional_yearly',
      enterprise_monthly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
      enterprise_yearly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
      phd_level_monthly: import.meta.env.VITE_STRIPE_PRICE_PHD_MONTHLY || 'price_phd_level_monthly',
      phd_level_yearly: import.meta.env.VITE_STRIPE_PRICE_PHD_YEARLY || 'price_phd_level_yearly'
    }
  },

  // FutureHouse API configuration
  futurehouse: {
    apiKey: import.meta.env.VITE_FUTUREHOUSE_API_KEY || 'your-futurehouse-api-key',
    baseUrl: 'https://api.futurehouse.org',
    agents: {
      crow: 'crow-agent-id',
      falcon: 'falcon-agent-id',
      owl: 'owl-agent-id',
      phoenix: 'phoenix-agent-id'
    }
  },

  // Subscription tiers and limits
  subscriptionTiers: {
    premium: {
      name: 'Premium Research Platform',
      monthlyPrice: 19,
      yearlyPrice: 15, // €15/month when billed yearly
      stripePriceId: {
        monthly: 'price_premium_monthly',
        yearly: 'price_premium_yearly'
      },
      limits: {
        researchQueries: 50,
        collaborators: 2,
        storage: 1, // GB
        workspaces: 2,
        citationsPerQuery: 100
      },
      features: [
        'AI-powered research queries',
        'Standard citation formats (APA, MLA, Chicago)',
        'PDF export functionality',
        'Email support',
        'Enhanced Research Features (Tier 2)',
        'Multi-Agent Research (Phoenix, Crow, Falcon, Owl)'
      ]
    },
    professional: {
      name: 'Professional Academic Platform',
      monthlyPrice: 69,
      yearlyPrice: 55, // €55/month when billed yearly
      stripePriceId: {
        monthly: 'price_professional_monthly',
        yearly: 'price_professional_yearly'
      },
      limits: {
        researchQueries: -1, // Unlimited
        collaborators: 10,
        storage: 10, // GB
        workspaces: 10,
        citationsPerQuery: -1 // Unlimited
      },
      features: [
        'Unlimited research queries',
        'All citation formats + BibTeX',
        'Advanced collaboration workspace',
        'University SSO integration',
        'Priority support',
        'All Enhanced Research Features (Tier 3)',
        'Advanced Analytics & Deep Literature Reviews',
        'Precedent Search & Citation Analysis'
      ]
    },
    enterprise: {
      name: 'Enterprise Academic Intelligence',
      monthlyPrice: 199,
      yearlyPrice: 149, // €149/month when billed yearly
      stripePriceId: {
        monthly: 'price_enterprise_monthly',
        yearly: 'price_enterprise_yearly'
      },
      limits: {
        researchQueries: -1, // Unlimited
        collaborators: -1, // Unlimited
        storage: 100, // GB
        workspaces: -1, // Unlimited
        citationsPerQuery: -1 // Unlimited
      },
      features: [
        'Everything in Professional',
        'Multi-user management dashboard',
        'Advanced analytics and reporting',
        'White-label customization',
        'Dedicated account manager',
        'API access for custom integrations',
        'SSO integration',
        'GDPR compliance tools',
        'Priority processing',
        'Custom training and onboarding'
      ]
    }
  },

  // Security settings
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireEmailVerification: true,
    enableTwoFactor: false, // Future feature
    corsOrigins: ['https://www.scholarai.eu', 'https://scholarai.eu']
  },

  // Rate limiting
  rateLimits: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // login attempts per window
    },
    research: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10 // research queries per hour for free tier
    }
  },

  // Email configuration
  email: {
    from: 'Scholar-AI <noreply@scholarai.eu>',
    replyTo: 'support@scholarai.eu',
    templates: {
      welcome: 'welcome-template-id',
      verification: 'verification-template-id',
      passwordReset: 'password-reset-template-id',
      subscription: 'subscription-template-id'
    }
  },

  // Analytics and monitoring
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    hotjarId: import.meta.env.VITE_HOTJAR_ID
  },

  // Feature flags
  features: {
    enableCollaboration: true,
    enableRealTimeSync: true,
    enableAdvancedAnalytics: true,
    enableAPIAccess: true,
    enableWhiteLabel: true,
    enableSSOIntegration: true,
    enableGDPRTools: true
  },

  // GDPR compliance
  gdpr: {
    enabled: true,
    cookieConsentRequired: true,
    dataRetentionDays: 365,
    allowDataExport: true,
    allowDataDeletion: true,
    privacyPolicyUrl: 'https://www.scholarai.eu/privacy',
    termsOfServiceUrl: 'https://www.scholarai.eu/terms'
  },

  // Citation formats
  citationFormats: [
    { id: 'apa', name: 'APA 7th Edition', description: 'American Psychological Association' },
    { id: 'mla', name: 'MLA 9th Edition', description: 'Modern Language Association' },
    { id: 'chicago', name: 'Chicago 17th Edition', description: 'Chicago Manual of Style' },
    { id: 'harvard', name: 'Harvard', description: 'Harvard Referencing Style' },
    { id: 'ieee', name: 'IEEE', description: 'Institute of Electrical and Electronics Engineers' },
    { id: 'vancouver', name: 'Vancouver', description: 'Vancouver Referencing Style' },
    { id: 'bibtex', name: 'BibTeX', description: 'LaTeX Bibliography Format' }
  ],

  // Export formats
  exportFormats: [
    { id: 'pdf', name: 'PDF', description: 'Portable Document Format' },
    { id: 'word', name: 'Word', description: 'Microsoft Word Document' },
    { id: 'latex', name: 'LaTeX', description: 'LaTeX Document' },
    { id: 'bibtex', name: 'BibTeX', description: 'BibTeX Bibliography' },
    { id: 'ris', name: 'RIS', description: 'Research Information Systems' },
    { id: 'endnote', name: 'EndNote', description: 'EndNote XML Format' }
  ]
}

// User roles configuration
export const userRoles = {
  FREE: 'free',
  ADVANCED_AI: 'advanced_ai',
  ULTRA_INTELLIGENT: 'ultra_intelligent',
  PHD_LEVEL: 'phd_level',
  ADMIN: 'admin'
}

// Export individual properties for named imports
export const citationFormats = config.citationFormats
export const exportFormats = config.exportFormats

export default config

