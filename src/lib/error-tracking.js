/**
 * Error tracking for production monitoring
 * This module sets up event listeners to catch and report errors in production
 */

// Initialize error tracking
export function initializeErrorTracking() {
  if (import.meta.env.PROD) {
    console.log('🔍 Initializing production error tracking');
    
    // Global error event listener
    window.addEventListener('error', (event) => {
      console.error('Production error:', event.error);
      
      // Here you would normally send to an error tracking service like Sentry
      // Example: sendToErrorTrackingService(event.error);
    });
    
    // Unhandled promise rejection tracking
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Send to error tracking service
      // Example: sendToErrorTrackingService(event.reason);
    });
  }
}

// Function to manually track errors
export function trackError(error, context = {}) {
  if (import.meta.env.PROD) {
    console.error('Tracked error:', error, context);
    
    // Send to error tracking service
    // Example: sendToErrorTrackingService(error, context);
  }
}