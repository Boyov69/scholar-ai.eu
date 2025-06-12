import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Search, 
  Brain, 
  BookOpen, 
  FileText, 
  Download, 
  Share, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Zap,
  Eye,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { futureHouseClient, researchUtils } from '../../lib/futurehouse';
import { db } from '../../lib/supabase';
import { citationFormats } from '../../lib/config';

const ResearchPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { canPerformAction, getRemainingQuota } = useSubscription();
  
  const [activeTab, setActiveTab] = useState('new-query');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New query form state
  const [queryForm, setQueryForm] = useState({
    question: '',
    researchArea: '',
    maxResults: 50,
    dateRange: '',
    citationStyle: 'apa',
    synthesisType: 'comprehensive'
  });

  // Query processing state
  const [processingQuery, setProcessingQuery] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (user?.id) {
      loadQueries();
    }
  }, [isAuthenticated, user, navigate]);

  const loadQueries = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await db.getUserResearchQueries(user.id);
      if (error) throw error;
      setQueries(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQueryForm(prev => ({ ...prev, [field]: value }));
  };

  const validateQuery = () => {
    if (!queryForm.question.trim()) {
      setError('Please enter a research question');
      return false;
    }
    
    if (!canPerformAction('create_query')) {
      setError('You have reached your query limit for this month. Please upgrade your plan.');
      return false;
    }
    
    return true;
  };

  const submitQuery = async () => {
    if (!validateQuery()) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Create query record in database
      const queryData = {
        user_id: user.id,
        title: queryForm.question.substring(0, 100),
        question: queryForm.question,
        research_area: queryForm.researchArea,
        status: 'pending',
        max_results: queryForm.maxResults,
        date_range: queryForm.dateRange,
        citation_style: queryForm.citationStyle,
        synthesis_type: queryForm.synthesisType,
        agents_used: ['crow', 'falcon', 'owl', 'phoenix'],
        metadata: {
          submitted_at: new Date().toISOString(),
          user_id: user.id
        }
      };

      const { data: newQuery, error: dbError } = await db.createResearchQuery(queryData);
      if (dbError) throw dbError;

      setProcessingQuery(newQuery);
      setActiveTab('processing');

      // Process query with AI agents
      const query = researchUtils.createQuery(queryForm.question, {
        researchArea: queryForm.researchArea,
        maxResults: queryForm.maxResults,
        dateRange: queryForm.dateRange,
        citationStyle: queryForm.citationStyle,
        synthesisType: queryForm.synthesisType,
        userId: user.id
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 1000);

      const results = await futureHouseClient.processResearchQuery(query, {
        queryId: newQuery.id
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Update query with results
      const updateData = {
        status: results.status,
        results: results.results,
        metadata: {
          ...queryData.metadata,
          completed_at: new Date().toISOString(),
          agents_used: results.metadata?.agents_used || ['crow', 'falcon', 'owl', 'phoenix'],
          total_sources: results.metadata?.total_sources || 0
        }
      };

      await db.updateResearchQuery(newQuery.id, updateData);

      // Refresh queries list
      await loadQueries();
      
      // Reset form
      setQueryForm({
        question: '',
        researchArea: '',
        maxResults: 50,
        dateRange: '',
        citationStyle: 'apa',
        synthesisType: 'comprehensive'
      });

      setActiveTab('results');
      
    } catch (err) {
      setError(err.message);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="glass-strong max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the research tools and start your AI-powered academic research.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="ice-gradient hover:opacity-90"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold ice-gradient-text mb-2">
                AI Research Assistant
              </h1>
              <p className="text-muted-foreground text-lg">
                Harness the power of multiple AI agents for comprehensive academic research
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Research Button */}
              <Button
                onClick={() => navigate('/research/enhanced')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-lg"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Enhanced Research
                <Badge className="ml-2 bg-white/20 text-white border-0 text-xs">
                  FREE TRIAL
                </Badge>
              </Button>

              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Queries Remaining
                </div>
                <div className="text-2xl font-bold text-primary">
                  {getRemainingQuota('queries')}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'new-query', label: 'New Query', icon: Search },
              { id: 'processing', label: 'Processing', icon: Loader2 },
              { id: 'results', label: 'Results', icon: FileText }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? 'ice-gradient' : 'border-primary/30'}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* New Query Tab */}
        {activeTab === 'new-query' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Submit Research Query
                </CardTitle>
                <CardDescription>
                  Our AI agents will analyze literature, synthesize findings, and provide comprehensive research insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question">Research Question *</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your research question or topic. Be specific for better results..."
                    value={queryForm.question}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                    className="min-h-[100px]"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="researchArea">Research Area (Optional)</Label>
                    <Input
                      id="researchArea"
                      placeholder="e.g., Computer Science, Biology, Psychology"
                      value={queryForm.researchArea}
                      onChange={(e) => handleInputChange('researchArea', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxResults">Max Results</Label>
                    <Select 
                      value={queryForm.maxResults.toString()} 
                      onValueChange={(value) => handleInputChange('maxResults', parseInt(value))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 sources</SelectItem>
                        <SelectItem value="50">50 sources</SelectItem>
                        <SelectItem value="100">100 sources</SelectItem>
                        <SelectItem value="200">200 sources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select 
                      value={queryForm.dateRange} 
                      onValueChange={(value) => handleInputChange('dateRange', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_time">All time</SelectItem>
                        <SelectItem value="last_year">Last year</SelectItem>
                        <SelectItem value="last_5_years">Last 5 years</SelectItem>
                        <SelectItem value="last_10_years">Last 10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citationStyle">Citation Style</Label>
                    <Select 
                      value={queryForm.citationStyle} 
                      onValueChange={(value) => handleInputChange('citationStyle', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apa">APA</SelectItem>
                        <SelectItem value="mla">MLA</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="harvard">Harvard</SelectItem>
                        <SelectItem value="ieee">IEEE</SelectItem>
                        <SelectItem value="vancouver">Vancouver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="synthesisType">Synthesis Type</Label>
                  <Select 
                    value={queryForm.synthesisType} 
                    onValueChange={(value) => handleInputChange('synthesisType', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                      <SelectItem value="summary">Quick Summary</SelectItem>
                      <SelectItem value="comparative">Comparative Analysis</SelectItem>
                      <SelectItem value="methodological">Methodological Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    This query will use: Crow, Falcon, Owl, and Phoenix AI agents
                  </div>
                  <Button 
                    onClick={submitQuery}
                    disabled={loading || !queryForm.question.trim()}
                    className="ice-gradient hover:opacity-90"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4" />
                    )}
                    Start Research
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Processing Tab */}
        {activeTab === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {processingQuery ? (
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    Processing Research Query
                  </CardTitle>
                  <CardDescription>
                    AI agents are analyzing literature and synthesizing findings...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">{processingQuery.title}</h3>
                    <p className="text-muted-foreground">{processingQuery.question}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Crow', task: 'Literature Search', status: progress > 25 ? 'completed' : 'processing' },
                      { name: 'Falcon', task: 'Research Synthesis', status: progress > 50 ? 'completed' : progress > 25 ? 'processing' : 'pending' },
                      { name: 'Owl', task: 'Citation Formatting', status: progress > 75 ? 'completed' : progress > 50 ? 'processing' : 'pending' },
                      { name: 'Phoenix', task: 'Gap Analysis', status: progress > 90 ? 'completed' : progress > 75 ? 'processing' : 'pending' }
                    ].map((agent) => (
                      <Card key={agent.name} className="glass">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(agent.status)}
                            <span className="font-medium">{agent.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{agent.task}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-strong text-center">
                <CardContent className="pt-12 pb-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Active Queries</h3>
                  <p className="text-muted-foreground mb-6">
                    Submit a research query to see the processing status here.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('new-query')}
                    variant="outline"
                    className="border-primary/30"
                  >
                    Create New Query
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {queries.length > 0 ? (
              queries.map((query) => (
                <Card key={query.id} className="glass hover:glass-strong transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{query.title}</CardTitle>
                        <CardDescription className="mb-3">
                          {query.question}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(query.created_at).toLocaleDateString()}
                          </div>
                          {query.metadata?.total_sources && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {query.metadata.total_sources} sources
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            {query.citation_style?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(query.status)}>
                        {getStatusIcon(query.status)}
                        <span className="ml-1 capitalize">{query.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30"
                        onClick={() => navigate(`/citations?query=${query.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-strong text-center">
                <CardContent className="pt-12 pb-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Research Results</h3>
                  <p className="text-muted-foreground mb-6">
                    Your completed research queries will appear here. Start by submitting your first query.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('new-query')}
                    className="ice-gradient hover:opacity-90"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Start Research
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResearchPage;

