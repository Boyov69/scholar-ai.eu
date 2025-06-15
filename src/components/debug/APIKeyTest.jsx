import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Key, RefreshCw } from 'lucide-react';

/**
 * 🔑 API Key Verification Component
 * 
 * Helps debug and verify OpenAI API key configuration
 */
export default function APIKeyTest() {
  const [keyStatus, setKeyStatus] = useState({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = () => {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    const status = {
      hasKey: !!openaiKey,
      keyLength: openaiKey?.length || 0,
      keyPrefix: openaiKey?.substring(0, 10) || 'None',
      isValidFormat: openaiKey?.startsWith('sk-') || false,
      isPlaceholder: openaiKey?.includes('your-new') || openaiKey?.includes('your-actual') || false,
      environment: import.meta.env.MODE,
      useLocalOpenAI: import.meta.env.VITE_USE_LOCAL_OPENAI === 'true',
      useRealAPI: import.meta.env.VITE_USE_REAL_API === 'true'
    };

    setKeyStatus(status);
  };

  const testAPIKey = async () => {
    if (!keyStatus.hasKey || keyStatus.isPlaceholder) {
      alert('Please add a valid OpenAI API key first!');
      return;
    }

    setTesting(true);
    
    try {
      // Simple test call to OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Say "Hello from Scholar AI!" if you can read this.'
            }
          ],
          max_tokens: 20
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ API Key Works!\n\nResponse: ${result.choices[0].message.content}\nCost: ~$${((result.usage?.total_tokens || 0) * 0.000002).toFixed(4)}`);
      } else {
        const error = await response.json();
        alert(`❌ API Key Error:\n\n${error.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`❌ Network Error:\n\n${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (condition) => {
    if (condition === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (condition === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (condition, trueText = 'OK', falseText = 'Error') => {
    if (condition === true) return <Badge className="bg-green-500">{trueText}</Badge>;
    if (condition === false) return <Badge variant="destructive">{falseText}</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            🔑 OpenAI API Key Verification
          </CardTitle>
          <CardDescription>
            Debug and verify your OpenAI API key configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Key Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Has API Key:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(keyStatus.hasKey)}
                    {getStatusBadge(keyStatus.hasKey, 'Yes', 'No')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Valid Format:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(keyStatus.isValidFormat)}
                    {getStatusBadge(keyStatus.isValidFormat, 'sk-*', 'Invalid')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Is Placeholder:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!keyStatus.isPlaceholder)}
                    {getStatusBadge(!keyStatus.isPlaceholder, 'Real Key', 'Placeholder')}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Key Length:</span>
                  <Badge variant="outline">{keyStatus.keyLength} chars</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Key Prefix:</span>
                  <Badge variant="outline">{keyStatus.keyPrefix}...</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environment:</span>
                  <Badge variant="outline">{keyStatus.environment}</Badge>
                </div>
              </div>
            </div>

            {/* Configuration Status */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Configuration Status:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Use Local OpenAI:</span>
                  {getStatusBadge(keyStatus.useLocalOpenAI, 'Enabled', 'Disabled')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Use Real API:</span>
                  {getStatusBadge(keyStatus.useRealAPI, 'Enabled', 'Disabled')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex gap-2">
                <Button 
                  onClick={checkKeyStatus}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Status
                </Button>

                <Button 
                  onClick={testAPIKey}
                  disabled={testing || !keyStatus.hasKey || keyStatus.isPlaceholder}
                  className="flex items-center gap-2"
                >
                  {testing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                  {testing ? 'Testing...' : 'Test API Key'}
                </Button>
              </div>

              {/* Instructions */}
              {(keyStatus.isPlaceholder || !keyStatus.hasKey) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <strong>Action Required:</strong>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">OpenAI API Keys</a></li>
                        <li>Create a new API key</li>
                        <li>Copy the key (starts with sk-)</li>
                        <li>Add it to your .env.local file:</li>
                      </ol>
                      <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
                        VITE_OPENAI_API_KEY=sk-your-actual-key-here
                      </code>
                      <p className="mt-2">Then restart the development server: <code>npm run dev</code></p>
                    </div>
                  </div>
                </div>
              )}

              {keyStatus.hasKey && !keyStatus.isPlaceholder && keyStatus.isValidFormat && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">
                      ✅ API key looks good! Click "Test API Key" to verify it works.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
