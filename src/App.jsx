import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './App.css';
import './performance.css'; // Optimize Core Web Vitals metrics

// Input interaction fixes
import { fixInputInteraction, setupInputFixObserver } from './utils/inputFix';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components - Critical pages loaded immediately
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';

// 🚀 PERFORMANCE: Lazy load heavy pages for better LCP
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const ResearchPage = lazy(() => import('./components/pages/ResearchPage'));
const EnhancedResearchPage = lazy(() => import('./components/pages/EnhancedResearchPage'));
const CitationsPage = lazy(() => import('./components/pages/CitationsPage'));
const WorkspacePage = lazy(() => import('./components/pages/WorkspacePage'));
const WorkspaceDebug = lazy(() => import('./components/debug/WorkspaceDebug'));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'));
const PricingPage = lazy(() => import('./components/pages/PricingPage'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./components/pages/CookiePolicy'));

// 🚀 PERFORMANCE: Lazy load workspace components
const WorkspaceDashboard = lazy(() => import('./components/workspace/WorkspaceDashboard').then(module => ({ default: module.WorkspaceDashboard })));
const EnhancedWorkspace = lazy(() => import('./components/workspace/EnhancedWorkspace'));

// Context providers
import { AuthProvider } from './hooks/useAuth';
import { SubscriptionProvider } from './hooks/useSubscription';

// GDPR Compliance
import ScholarAICookieConsent from './components/CookieConsent';

// Development tools
import DevModeNotice from './components/DevModeNotice';
import DevLoginButton from './components/DevLoginButton';

// Production configuration
import './lib/production.js';

// 🚀 PERFORMANCE: Optimized fast loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    <noscript>Loading...</noscript>
  </div>
);

function App() {
  // Input interaction handling - refactored to reduce aggressive fixes
  useEffect(() => {
    console.log('🔄 App component mounted - initializing UI');
    
    // Only apply input fixes in development mode when specifically enabled
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_INPUT_FIXES === 'true') {
      console.log('🔧 Input fixes enabled in development mode');
      // One-time fix on initial load
      fixInputInteraction();
      // Setup observer for dynamic content only when explicitly enabled
      const observer = setupInputFixObserver();
      
      return () => {
        if (observer) observer.disconnect();
        console.log('🔧 Input fix observer disconnected');
      };
    }
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/research" element={<ResearchPage />} />
                      <Route path="/research/enhanced" element={<EnhancedResearchPage />} />
                      <Route path="/citations" element={<CitationsPage />} />
                      <Route path="/workspaces" element={<WorkspaceDashboard />} />
                      <Route path="/workspace/:id?" element={<WorkspacePage />} />
                      <Route path="/debug/workspace" element={<WorkspaceDebug />} />
                      {/* TEMPORARILY DISABLED: Enhanced Workspace */}
                      {import.meta.env.VITE_ENABLE_ENHANCED_WORKSPACE === 'true' && (
                        <Route path="/workspace/:workspaceId/enhanced" element={<EnhancedWorkspace />} />
                      )}
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <ScholarAICookieConsent />
                <DevModeNotice />
                <DevLoginButton />
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  theme="dark"
                  className="metrics-green"
                />
              </div>
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

