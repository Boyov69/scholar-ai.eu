// Production environment configuration and security fixes
export const productionConfig = {
  // Security headers for production
  securityHeaders: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://m.stripe.network wss://*.supabase.co",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      "frame-ancestors 'self' https://vercel.live",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; '),
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  },

  // Environment detection
  isProduction: () => {
    return import.meta.env.PROD || 
           import.meta.env.VITE_APP_ENV === 'production' ||
           window.location.hostname.includes('scholarai.eu') ||
           window.location.hostname.includes('vercel.app');
  },

  // Safe iframe handling
  handleIframeErrors: () => {
    // Suppress cross-origin frame errors in production
    if (productionConfig.isProduction()) {
      const originalError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        // Suppress known iframe security errors
        if (typeof message === 'string' && (
          message.includes('cross-origin frame') ||
          message.includes('vercel.live') ||
          message.includes('stripe.com') ||
          message.includes('m.stripe.network')
        )) {
          console.debug('Suppressed cross-origin frame error:', message);
          return true; // Prevent default error handling
        }
        
        // Call original error handler for other errors
        if (originalError) {
          return originalError(message, source, lineno, colno, error);
        }
        return false;
      };
    }
  },

  // Initialize production optimizations
  init: () => {
    if (productionConfig.isProduction()) {
      // Handle iframe errors
      productionConfig.handleIframeErrors();
      
      // Disable console logs in production (except errors)
      if (!import.meta.env.DEV) {
        console.log = () => {};
        console.debug = () => {};
        console.info = () => {};
        console.warn = () => {};
      }
      
      // Add security headers if possible
      try {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = productionConfig.securityHeaders['Content-Security-Policy'];
        document.head.appendChild(meta);
      } catch (error) {
        console.error('Could not set CSP meta tag:', error);
      }
    }
  },

  // Get correct domain for redirects
  getDomain: () => {
    if (typeof window === 'undefined') return 'https://www.scholarai.eu';
    
    const hostname = window.location.hostname;
    
    // Production domains
    if (hostname.includes('scholarai.eu')) {
      return `https://${hostname}`;
    }
    
    // Vercel preview domains
    if (hostname.includes('vercel.app')) {
      return `https://${hostname}`;
    }
    
    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${window.location.protocol}//${hostname}:${window.location.port}`;
    }
    
    // Fallback
    return window.location.origin;
  },

  // Environment variables validation
  validateEnvironment: () => {
    const required = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_STRIPE_PUBLISHABLE_KEY'
    ];
    
    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing);
      return false;
    }
    
    return true;
  },

  // Safe error reporting
  reportError: (error, context = {}) => {
    if (productionConfig.isProduction()) {
      // In production, only log critical errors
      if (error.name === 'ChunkLoadError' || 
          error.message?.includes('Loading chunk') ||
          error.message?.includes('cross-origin')) {
        console.debug('Non-critical error suppressed:', error.message);
        return;
      }
    }
    
    console.error('Application error:', error, context);
    
    // Here you could integrate with error reporting services like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context });
    // }
  }
};

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', productionConfig.init);
  } else {
    productionConfig.init();
  }
}

export default productionConfig;
