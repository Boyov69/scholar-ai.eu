import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import './App.css';

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
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'));
const PricingPage = lazy(() => import('./components/pages/PricingPage'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./components/pages/CookiePolicy'));

// 🚀 PERFORMANCE: Lazy load workspace components
const WorkspaceDashboard = lazy(() => import('./components/workspace/WorkspaceDashboard').then(module => ({ default: module.WorkspaceDashboard })));

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

// 🚀 PERFORMANCE: Fast loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  // Fix input interaction issues on mount
  useEffect(() => {
    // Initial fix
    fixInputInteraction();

    // Setup observer for dynamic content
    const observer = setupInputFixObserver();

    // Periodic fix for any missed elements
    const interval = setInterval(fixInputInteraction, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
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

