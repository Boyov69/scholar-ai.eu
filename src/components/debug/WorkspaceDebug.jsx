import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../hooks/useAuth';
import { db, supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Database, 
  Wifi,
  Settings,
  RefreshCw
} from 'lucide-react';

/**
 * WorkspaceDebug Component
 * Helps diagnose workspace creation issues
 */
const WorkspaceDebug = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState({
    supabaseConnection: null,
    userAuth: null,
    workspaceCreation: null,
    envVars: null
  });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const runDiagnostics = async () => {
    setTesting(true);
    const results = {};

    // 1. Check Environment Variables
    results.envVars = {
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      devMode: import.meta.env.DEV,
      nodeEnv: import.meta.env.NODE_ENV,
      appEnv: import.meta.env.VITE_APP_ENV
    };

    // 2. Check Supabase Connection
    try {
      const { data, error } = await supabase.from('workspaces').select('count').limit(1);
      results.supabaseConnection = {
        connected: !error,
        error: error?.message || null,
        canQuery: !!data
      };
    } catch (err) {
      results.supabaseConnection = {
        connected: false,
        error: err.message,
        canQuery: false
      };
    }

    // 3. Check User Authentication
    results.userAuth = {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
      loading
    };

    // 4. Test Workspace Creation (if authenticated)
    if (user?.id) {
      try {
        const testWorkspaceData = {
          name: `Debug Test Workspace ${Date.now()}`,
          description: 'Test workspace for debugging',
          owner_id: user.id,
          is_public: false,
          visibility: 'private',
          color_theme: '#3B82F6',
          tags: ['debug', 'test'],
          template: 'blank',
          settings: {
            created_from: 'debug',
            template_used: 'blank'
          }
        };

        const { data, error } = await db.createWorkspace(testWorkspaceData);
        results.workspaceCreation = {
          canCreate: !error,
          error: error?.message || null,
          testData: data ? 'Success' : 'Failed',
          isDevelopmentMode: import.meta.env.DEV
        };
      } catch (err) {
        results.workspaceCreation = {
          canCreate: false,
          error: err.message,
          testData: null,
          isDevelopmentMode: import.meta.env.DEV
        };
      }
    } else {
      results.workspaceCreation = {
        canCreate: false,
        error: 'User not authenticated',
        testData: null,
        isDevelopmentMode: import.meta.env.DEV
      };
    }

    setDebugInfo(results);
    setTesting(false);
  };

  const createTestUser = async () => {
    try {
      setTesting(true);
      
      // Create a test user for development
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      console.log('🧪 Creating test user:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User',
            role: 'researcher'
          }
        }
      });
      
      if (error) {
        console.error('❌ Test user creation failed:', error);
        alert(`Test user creation failed: ${error.message}`);
      } else {
        console.log('✅ Test user created:', data);
        alert(`Test user created! Email: ${testEmail}, Password: ${testPassword}`);
      }
    } catch (err) {
      console.error('❌ Test user creation error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === true) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🔧 Workspace Creation Debug</h2>
        <Button onClick={runDiagnostics} disabled={testing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Testing...' : 'Run Diagnostics'}
        </Button>
      </div>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Supabase URL</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={debugInfo.envVars?.supabaseUrl} />
              <Badge variant={debugInfo.envVars?.supabaseUrl ? 'default' : 'destructive'}>
                {debugInfo.envVars?.supabaseUrl ? 'Set' : 'Missing'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Supabase Anon Key</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={debugInfo.envVars?.supabaseKey} />
              <Badge variant={debugInfo.envVars?.supabaseKey ? 'default' : 'destructive'}>
                {debugInfo.envVars?.supabaseKey ? 'Set' : 'Missing'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Development Mode</span>
            <Badge variant="outline">
              {debugInfo.envVars?.devMode ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Connection Status</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={debugInfo.supabaseConnection?.connected} />
              <Badge variant={debugInfo.supabaseConnection?.connected ? 'default' : 'destructive'}>
                {debugInfo.supabaseConnection?.connected ? 'Connected' : 'Failed'}
              </Badge>
            </div>
          </div>
          {debugInfo.supabaseConnection?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {debugInfo.supabaseConnection.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* User Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Authentication Status</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={debugInfo.userAuth?.isAuthenticated} />
              <Badge variant={debugInfo.userAuth?.isAuthenticated ? 'default' : 'destructive'}>
                {debugInfo.userAuth?.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
            </div>
          </div>
          {debugInfo.userAuth?.userEmail && (
            <div className="flex items-center justify-between">
              <span>User Email</span>
              <Badge variant="outline">{debugInfo.userAuth.userEmail}</Badge>
            </div>
          )}
          {debugInfo.userAuth?.userId && (
            <div className="flex items-center justify-between">
              <span>User ID</span>
              <Badge variant="outline" className="font-mono text-xs">
                {debugInfo.userAuth.userId.substring(0, 8)}...
              </Badge>
            </div>
          )}
          {!debugInfo.userAuth?.isAuthenticated && (
            <div className="space-y-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to be authenticated to create workspaces. 
                  <br />
                  Go to <strong>/auth</strong> to sign in or create an account.
                </AlertDescription>
              </Alert>
              <Button onClick={createTestUser} disabled={testing} className="w-full">
                Create Test User (Development)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workspace Creation Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Workspace Creation Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Can Create Workspaces</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={debugInfo.workspaceCreation?.canCreate} />
              <Badge variant={debugInfo.workspaceCreation?.canCreate ? 'default' : 'destructive'}>
                {debugInfo.workspaceCreation?.canCreate ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Development Mode</span>
            <Badge variant="outline">
              {debugInfo.workspaceCreation?.isDevelopmentMode ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {debugInfo.workspaceCreation?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {debugInfo.workspaceCreation.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="w-full"
            variant="outline"
          >
            Go to Authentication Page
          </Button>
          <Button 
            onClick={() => window.location.href = '/workspaces'} 
            className="w-full"
            variant="outline"
          >
            Go to Workspaces Page
          </Button>
          <Button 
            onClick={() => console.log('Debug Info:', debugInfo)} 
            className="w-full"
            variant="outline"
          >
            Log Debug Info to Console
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceDebug;
