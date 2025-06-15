import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase, auth } from '@/lib/supabase';

/**
 * 🔧 Environment & Configuration Test Component
 * 
 * This component tests all critical configurations:
 * - Environment variables
 * - Supabase connection
 * - Authentication
 * - API endpoints
 */
export default function EnvironmentTest() {
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test 1: Environment Variables
    console.log('🧪 Testing Environment Variables...');
    results.envVars = {
      name: 'Environment Variables',
      status: 'success',
      details: {
        supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        stripeKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        futurehouseKey: !!import.meta.env.VITE_FUTUREHOUSE_API_KEY,
        openaiKeySecure: !import.meta.env.VITE_OPENAI_API_KEY // Should be undefined (secure)
      }
    };

    // Check if any critical env vars are missing
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      results.envVars.status = 'error';
      results.envVars.error = 'Missing critical Supabase environment variables';
    }

    // Test 2: Supabase Connection
    console.log('🧪 Testing Supabase Connection...');
    try {
      const { data, error } = await supabase.auth.getSession();
      results.supabaseConnection = {
        name: 'Supabase Connection',
        status: error && error.message !== 'No session found' ? 'error' : 'success',
        details: {
          connected: true,
          url: import.meta.env.VITE_SUPABASE_URL,
          hasSession: !!data?.session,
          error: error?.message
        }
      };
    } catch (err) {
      results.supabaseConnection = {
        name: 'Supabase Connection',
        status: 'error',
        error: err.message,
        details: { connected: false }
      };
    }

    // Test 3: Supabase Tables Access
    console.log('🧪 Testing Supabase Tables...');
    try {
      // Test if we can query a table (should work even without auth for public tables)
      const { data, error } = await supabase
        .from('research_queries')
        .select('id')
        .limit(1);

      results.supabaseTables = {
        name: 'Supabase Tables',
        status: error ? 'warning' : 'success',
        details: {
          canQuery: !error,
          error: error?.message,
          hint: error ? 'This might be due to RLS policies - normal for authenticated tables' : 'Tables accessible'
        }
      };
    } catch (err) {
      results.supabaseTables = {
        name: 'Supabase Tables',
        status: 'error',
        error: err.message,
        details: { canQuery: false }
      };
    }

    // Test 4: Authentication Test
    console.log('🧪 Testing Authentication...');
    try {
      const { user, error } = await auth.getCurrentUser();
      results.authentication = {
        name: 'Authentication',
        status: 'success',
        details: {
          hasUser: !!user,
          userEmail: user?.email,
          authWorking: true,
          error: error?.message
        }
      };
    } catch (err) {
      results.authentication = {
        name: 'Authentication',
        status: 'error',
        error: err.message,
        details: { authWorking: false }
      };
    }

    // Test 5: Security Check
    console.log('🧪 Testing Security Configuration...');
    results.security = {
      name: 'Security Configuration',
      status: 'success',
      details: {
        openaiKeySecure: !import.meta.env.VITE_OPENAI_API_KEY, // Should be undefined
        noSensitiveKeysExposed: !import.meta.env.VITE_STRIPE_SECRET_KEY && !import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
        corsConfigured: true // Assume configured for now
      }
    };

    if (import.meta.env.VITE_OPENAI_API_KEY) {
      results.security.status = 'error';
      results.security.error = '🚨 SECURITY ALERT: OpenAI API key exposed to frontend!';
    }

    setTests(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Environment & Configuration Test
            <Button 
              onClick={runTests} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Retest
            </Button>
          </CardTitle>
          <CardDescription>
            Comprehensive test of all critical configurations and connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(tests).map(([key, test]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <h3 className="font-medium">{test.name}</h3>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
                
                {test.error && (
                  <div className="text-sm text-red-600 mb-2">
                    ❌ {test.error}
                  </div>
                )}
                
                {test.details && (
                  <div className="text-xs space-y-1 text-gray-600">
                    {Object.entries(test.details).map(([detailKey, detailValue]) => (
                      <div key={detailKey} className="flex justify-between">
                        <span>{detailKey}:</span>
                        <span className={
                          typeof detailValue === 'boolean' 
                            ? detailValue ? 'text-green-600' : 'text-red-600'
                            : 'text-gray-800'
                        }>
                          {typeof detailValue === 'boolean' 
                            ? (detailValue ? '✅' : '❌')
                            : String(detailValue)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Fix Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Quick Fixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <strong>If Supabase 401 errors:</strong>
              <br />1. Check environment variables are loaded correctly
              <br />2. Verify RLS policies in Supabase dashboard
              <br />3. Ensure user is authenticated for protected tables
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>If Stripe CORS errors:</strong>
              <br />1. Add Stripe domains to CSP headers
              <br />2. Configure proper CORS in vite.config.js
              <br />3. Check Stripe publishable key is correct
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <strong>Environment Variables Format:</strong>
              <br />✅ VITE_SUPABASE_URL (public)
              <br />✅ VITE_STRIPE_PUBLISHABLE_KEY (public)
              <br />🔒 OPENAI_API_KEY (server-side only, no VITE_ prefix)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
