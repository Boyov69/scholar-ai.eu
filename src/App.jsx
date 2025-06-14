import React, { useEffect } from 'react';
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

// Page components
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import ResearchPage from './components/pages/ResearchPage';
import EnhancedResearchPage from './components/pages/EnhancedResearchPage';
import CitationsPage from './components/pages/CitationsPage';
import WorkspacePage from './components/pages/WorkspacePage';
import SettingsPage from './components/pages/SettingsPage';
import PricingPage from './components/pages/PricingPage';
import AuthPage from './components/pages/AuthPage';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import CookiePolicy from './components/pages/CookiePolicy';

// Import new state-of-the-art workspace components
import { WorkspaceDashboard } from './components/workspace/WorkspaceDashboard';

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

