import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { db } from '@/lib/supabase';

/**
 * Workspace Creation Test Component
 * Tests workspace creation functionality independently
 */
export default function WorkspaceCreationTest() {
  const { user, isAuthenticated } = useAuth();
  const { canPerformAction } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [workspaceName, setWorkspaceName] = useState('Test Workspace');

  const testWorkspaceCreation = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing workspace creation...');
      console.log('🧪 User:', user);
      console.log('🧪 Can create workspace:', canPerformAction('create_workspace'));

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const workspaceData = {
        owner_id: user.id,
        name: workspaceName,
        description: 'Test workspace created by debug component',
        is_public: false,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🧪 Workspace data:', workspaceData);

      const createResult = await db.createWorkspace(workspaceData);
      console.log('🧪 Create result:', createResult);

      if (createResult.error) {
        throw createResult.error;
      }

      setResult({
        success: true,
        data: createResult.data,
        message: 'Workspace created successfully!'
      });

    } catch (error) {
      console.error('🧪 Test failed:', error);
      setResult({
        success: false,
        error: error.message,
        message: 'Workspace creation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Workspace Creation Test
        </CardTitle>
        <CardDescription>
          Test workspace creation functionality independently
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Authentication:</span>
          <Badge variant={isAuthenticated ? "success" : "destructive"}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
          {user && (
            <span className="text-sm text-muted-foreground">
              ({user.email})
            </span>
          )}
        </div>

        {/* Permission Status */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Can Create Workspace:</span>
          <Badge variant={canPerformAction('create_workspace') ? "success" : "destructive"}>
            {canPerformAction('create_workspace') ? 'Yes' : 'No'}
          </Badge>
        </div>

        {/* Test Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Workspace Name:</label>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Enter test workspace name"
          />
        </div>

        {/* Test Button */}
        <Button
          onClick={testWorkspaceCreation}
          disabled={loading || !workspaceName.trim() || !isAuthenticated}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Test Workspace Creation
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>

            {result.success && result.data && (
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">Created Workspace:</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>ID: {result.data.id}</li>
                  <li>Name: {result.data.name}</li>
                  <li>Owner: {result.data.owner_id}</li>
                  <li>Created: {new Date(result.data.created_at).toLocaleString()}</li>
                </ul>
              </div>
            )}

            {!result.success && (
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-red-800">Error Details:</h4>
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">Debug Information:</h4>
          <div className="text-xs space-y-1 text-gray-600">
            <div>User ID: {user?.id || 'Not available'}</div>
            <div>Environment: {import.meta.env.MODE}</div>
            <div>Development Mode: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
            <div>Database Available: {db ? 'Yes' : 'No'}</div>
            <div>Create Function Available: {db?.createWorkspace ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
