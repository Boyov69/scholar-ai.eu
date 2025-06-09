import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import ResearchPage from './components/pages/ResearchPage';
import CitationsPage from './components/pages/CitationsPage';
import WorkspacePage from './components/pages/WorkspacePage';
import SettingsPage from './components/pages/SettingsPage';
import PricingPage from './components/pages/PricingPage';
import AuthPage from './components/pages/AuthPage';

// Context providers
import { AuthProvider } from './hooks/useAuth';
import { SubscriptionProvider } from './hooks/useSubscription';

function App() {
  return (
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
                  <Route path="/citations" element={<CitationsPage />} />
                  <Route path="/workspace/:id?" element={<WorkspacePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

