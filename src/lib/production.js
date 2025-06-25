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

  // Development environment detection
  isDevelopment: () => {
    return import.meta.env.DEV ||
           import.meta.env.VITE_APP_ENV === 'development' ||
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  },

  // Safe iframe handling
  handleIframeErrors: () => {
    // Suppress cross-origin frame errors in both production and development
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Suppress known iframe security errors
      if (typeof message === 'string' && (
        message.includes('cross-origin frame') ||
        message.includes('vercel.live') ||
        message.includes('stripe.com') ||
        message.includes('m.stripe.network') ||
        message.includes('js.stripe.com') ||
        message.includes('Failed to read a named property')
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
  },

  // Initialize production optimizations
  init: () => {
    // Always handle iframe errors (both dev and prod)
    productionConfig.handleIframeErrors();

    if (productionConfig.isProduction()) {
      // Initialize error tracking first (before we disable console logs)
      productionConfig.initErrorTracking();
      
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

  // Enhanced error reporting and tracking
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
    
    // Enhanced error tracking for production
    if (productionConfig.isProduction()) {
      try {
        // Capture stack trace
        const stackTrace = error.stack || new Error().stack;
        
        // Prepare error data
        const errorData = {
          message: error.message,
          name: error.name,
          stack: stackTrace,
          context: context,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        };
        
        // Log structured error info
        console.error('Tracked error data:', JSON.stringify(errorData));
        
        // Here you would send to an error tracking service like Sentry
        // if (window.Sentry) {
        //   window.Sentry.captureException(error, {
        //     extra: { ...context, ...errorData }
        //   });
        // }
        
        // Or send to your own backend error tracking endpoint
        // fetch('/api/error-tracking', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorData)
        // }).catch(e => console.error('Failed to send error report:', e));
      } catch (trackingError) {
        console.error('Error in error tracking:', trackingError);
      }
    }
  },
  
  // Initialize error tracking
  initErrorTracking: () => {
    if (productionConfig.isProduction()) {
      console.log('🔍 Initializing production error tracking');
      
      // Global error event listener
      window.addEventListener('error', (event) => {
        productionConfig.reportError(event.error || new Error(event.message), {
          errorEventType: 'global',
          lineNumber: event.lineno,
          columnNumber: event.colno,
          filename: event.filename
        });
        
        // Don't prevent default error handling
        return false;
      });
      
      // Unhandled promise rejection tracking
      window.addEventListener('unhandledrejection', (event) => {
        productionConfig.reportError(event.reason || new Error('Unhandled Promise rejection'), {
          errorEventType: 'unhandledRejection',
          promise: event.promise
        });
      });
    }
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
