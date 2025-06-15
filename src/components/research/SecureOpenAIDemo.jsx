import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { openaiResearch, generateSummary, checkOpenAIAccess } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🔒 Secure OpenAI Demo Component
 * 
 * Demonstrates secure OpenAI integration:
 * - No API keys exposed to frontend
 * - All requests go through secure Edge Function
 * - Proper authentication and tier checking
 */
export default function SecureOpenAIDemo() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessInfo, setAccessInfo] = useState(null);

  // Check user access on component mount
  React.useEffect(() => {
    if (user) {
      checkAccess();
    }
  }, [user]);

  const checkAccess = async () => {
    try {
      const access = await checkOpenAIAccess();
      setAccessInfo(access);
    } catch (err) {
      console.error('Access check failed:', err);
    }
  };

  const handleResearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // 🔒 SECURE: This call goes through our Edge Function
      const result = await openaiResearch(query, {
        tier: accessInfo?.tier || 'basic',
        model: accessInfo?.tier === 'ultra' ? 'gpt-4o' : 'gpt-4o-mini'
      });

      setResponse(result.response);
    } catch (err) {
      setError(err.message || 'Research request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // 🔒 SECURE: Generate summary through Edge Function
      const result = await generateSummary(query);
      setResponse(result.response);
    } catch (err) {
      setError(err.message || 'Summary generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Secure OpenAI Integration
          </CardTitle>
          <CardDescription>
            Please log in to test the secure OpenAI features.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Security Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            🔒 Secure OpenAI Integration
          </CardTitle>
          <CardDescription>
            Your API key is safely stored server-side and never exposed to the browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">API Key Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Edge Function Active</span>
            </div>
            {accessInfo && (
              <Badge variant={accessInfo.hasAccess ? "default" : "secondary"}>
                {accessInfo.tier.toUpperCase()} Tier
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Test Secure OpenAI Features</CardTitle>
          <CardDescription>
            Try the research and summary features powered by our secure OpenAI integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium mb-2">
              Research Query or Text to Summarize
            </label>
            <Textarea
              id="query"
              placeholder="Enter your research question or text to summarize..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleResearch}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Research Query
            </Button>
            <Button 
              onClick={handleSummary}
              disabled={loading || !query.trim()}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate Summary
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Response:</label>
              <div className="p-4 bg-gray-50 border rounded-md">
                <p className="text-sm whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">🔒 Security Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Frontend → Supabase Edge Function → OpenAI API</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>API key stored server-side only (never exposed to browser)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>User authentication and tier-based access control</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Usage tracking and rate limiting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
