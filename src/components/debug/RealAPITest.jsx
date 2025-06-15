import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { futureHouseClient } from '@/lib/futurehouse';

/**
 * 🚀 Real API Testing Component
 * 
 * Professional local testing workflow:
 * 1. Test real OpenAI API calls locally
 * 2. Monitor costs and performance
 * 3. Verify functionality before deployment
 */
export default function RealAPITest() {
  const [query, setQuery] = useState('What are the latest developments in quantum computing?');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [costs, setCosts] = useState({ total: 0, queries: 0 });

  const testRealAPI = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      console.log('🚀 Starting real API test...');
      
      const startTime = Date.now();
      const result = await futureHouseClient.processResearchQuery({
        question: query,
        maxResults: 10,
        citationStyle: 'apa',
        synthesisType: 'comprehensive'
      });

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Calculate estimated costs (rough estimate)
      const estimatedCost = calculateEstimatedCost(result);
      setCosts(prev => ({
        total: prev.total + estimatedCost,
        queries: prev.queries + 1
      }));

      setResults({
        ...result,
        performance: {
          duration: `${duration.toFixed(1)}s`,
          estimatedCost: `$${estimatedCost.toFixed(4)}`,
          timestamp: new Date().toISOString()
        }
      });

      console.log('✅ Real API test completed:', {
        duration: `${duration.toFixed(1)}s`,
        estimatedCost: `$${estimatedCost.toFixed(4)}`,
        status: result.status
      });

    } catch (err) {
      console.error('❌ Real API test failed:', err);
      setError(err.message || 'API test failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedCost = (result) => {
    // Rough cost estimation based on token usage
    let totalTokens = 0;
    
    if (result.results?.literature?.search_metadata?.tokens_used) {
      totalTokens += result.results.literature.search_metadata.tokens_used;
    }
    if (result.results?.synthesis?.tokens_used) {
      totalTokens += result.results.synthesis.tokens_used;
    }
    if (result.results?.citations?.tokens_used) {
      totalTokens += result.results.citations.tokens_used;
    }
    if (result.results?.gaps?.tokens_used) {
      totalTokens += result.results.gaps.tokens_used;
    }

    // GPT-3.5-turbo pricing: ~$0.002 per 1K tokens
    return (totalTokens / 1000) * 0.002;
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    }
    if (status === 'error') {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            🚀 Real API Testing - Professional Workflow
          </CardTitle>
          <CardDescription>
            Test real OpenAI API integration locally before deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {import.meta.env.VITE_USE_LOCAL_OPENAI === 'true' ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Local OpenAI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {!!import.meta.env.VITE_OPENAI_API_KEY ? '🔑' : '❌'}
              </div>
              <div className="text-sm text-gray-600">API Key</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">${costs.total.toFixed(4)}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{costs.queries}</div>
              <div className="text-sm text-gray-600">Queries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Interface */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 API Test Interface</CardTitle>
          <CardDescription>
            Test real OpenAI API calls and monitor performance/costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium mb-2">
              Research Query
            </label>
            <Textarea
              id="query"
              placeholder="Enter your research question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>

          <Button 
            onClick={testRealAPI}
            disabled={loading || !query.trim() || !import.meta.env.VITE_OPENAI_API_KEY}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {loading ? 'Testing Real API...' : 'Test Real OpenAI API'}
          </Button>

          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-700">
                  Add your OpenAI API key to VITE_OPENAI_API_KEY in .env.local to test real API
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🎯 API Test Results</span>
              {getStatusBadge(results.status)}
            </CardTitle>
            <CardDescription>
              Performance: {results.performance?.duration} | 
              Cost: {results.performance?.estimatedCost} | 
              Time: {new Date(results.performance?.timestamp).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Literature Results */}
              {results.results?.literature && (
                <div>
                  <h4 className="font-medium mb-2">📚 Literature Search (Crow Agent)</h4>
                  <div className="text-sm text-gray-600">
                    Found {results.results.literature.sources?.length || 0} sources
                    {results.results.literature.search_metadata?.ai_generated && (
                      <Badge variant="outline" className="ml-2">AI Generated</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Synthesis Results */}
              {results.results?.synthesis && (
                <div>
                  <h4 className="font-medium mb-2">🦅 Research Synthesis (Falcon Agent)</h4>
                  <div className="text-sm text-gray-600">
                    {results.results.synthesis.synthesis?.executive_summary?.substring(0, 200)}...
                    {results.results.synthesis.ai_generated && (
                      <Badge variant="outline" className="ml-2">AI Generated</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-500">{results.performance?.duration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">{results.performance?.estimatedCost}</div>
                  <div className="text-xs text-gray-500">Est. Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-500">{results.metadata?.total_sources || 0}</div>
                  <div className="text-xs text-gray-500">Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">{results.metadata?.agents_used?.length || 0}</div>
                  <div className="text-xs text-gray-500">Agents</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Workflow Guide */}
      <Card>
        <CardHeader>
          <CardTitle>👑 Professional Development Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Test real API locally first (cost control)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Monitor performance and costs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Verify functionality before deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span>💡 Expected cost: ~$0.01-0.05 per research query</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
