import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { checkBackendAvailability, futureHouseBackend } from '@/lib/futurehouse-backend';

/**
 * Backend Connection Test Component
 * Tests the connection to the Python FutureHouse backend service
 */
export default function BackendConnectionTest() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    setLoading(true);
    try {
      const status = await checkBackendAvailability();
      setBackendStatus(status);
      console.log('🔌 Backend Status Check:', status);
    } catch (error) {
      setBackendStatus({
        available: false,
        error: error.message,
        reason: 'Connection failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const testBackendQuery = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing backend with sample query...');
      
      const testQuery = {
        question: 'artificial intelligence in healthcare',
        maxResults: 5,
        citationStyle: 'apa',
        queryId: 'test-' + Date.now()
      };

      const startTime = Date.now();
      const result = await futureHouseBackend.processResearchQuery(testQuery);
      const endTime = Date.now();

      setTestResult({
        success: true,
        result,
        duration: endTime - startTime,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Backend test successful:', result);

    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Backend test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status?.available) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    if (loading) return <Badge variant="secondary">Checking...</Badge>;
    if (status?.available) return <Badge variant="success">Online</Badge>;
    return <Badge variant="destructive">Offline</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Backend Connection Status
          </CardTitle>
          <CardDescription>
            Test connection to the Python FutureHouse backend service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(backendStatus)}
              <span className="font-medium">Backend Service</span>
            </div>
            {getStatusBadge(backendStatus)}
          </div>

          {backendStatus && (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{backendStatus.status || 'Unknown'}</span>
                </div>
                <div>
                  <span className="font-medium">Version:</span>
                  <span className="ml-2">{backendStatus.version || 'Unknown'}</span>
                </div>
              </div>
              
              {backendStatus.futurehouse_available !== undefined && (
                <div>
                  <span className="font-medium">FutureHouse Client:</span>
                  <Badge 
                    variant={backendStatus.futurehouse_available ? "success" : "secondary"}
                    className="ml-2"
                  >
                    {backendStatus.futurehouse_available ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              )}

              {backendStatus.error && (
                <div className="text-red-600">
                  <span className="font-medium">Error:</span>
                  <span className="ml-2">{backendStatus.error}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={checkBackendStatus} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh Status
            </Button>
            
            <Button 
              onClick={testBackendQuery}
              disabled={testing || !backendStatus?.available}
              size="sm"
            >
              {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test Query
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="success">Success</Badge>
                  <span>Duration: {testResult.duration}ms</span>
                  <span>Time: {new Date(testResult.timestamp).toLocaleTimeString()}</span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Response Summary:</h4>
                  <ul className="text-sm space-y-1">
                    <li>Status: {testResult.result.status}</li>
                    <li>Query ID: {testResult.result.queryId}</li>
                    <li>Agents Used: {testResult.result.metadata?.agents_used?.join(', ') || 'Unknown'}</li>
                    <li>Backend Processed: {testResult.result.metadata?.backend_processed ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="destructive">Failed</Badge>
                  <span>Time: {new Date(testResult.timestamp).toLocaleTimeString()}</span>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-800">Error Details:</h4>
                  <p className="text-sm text-red-700">{testResult.error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Backend URL:</span>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                {import.meta.env.VITE_FUTUREHOUSE_BACKEND_URL || 'Not configured'}
              </code>
            </div>
            <div>
              <span className="font-medium">Use Backend:</span>
              <Badge variant={import.meta.env.VITE_USE_FUTUREHOUSE_BACKEND === 'true' ? 'success' : 'secondary'} className="ml-2">
                {import.meta.env.VITE_USE_FUTUREHOUSE_BACKEND || 'false'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
