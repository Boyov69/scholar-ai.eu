import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Brain,
  Search,
  History,
  BarChart3,
  Sparkles,
  Zap
} from 'lucide-react';
import EnhancedResearchInterface from './EnhancedResearchInterface';
import ResearchQueryForm from './ResearchQueryForm';
import ResearchAnalytics from '../analytics/ResearchAnalytics';
import AgentPerformanceAnalytics from '../analytics/AgentPerformanceAnalytics';
import ResearchInsights from '../analytics/ResearchInsights';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const ResearchDashboard = () => {
  const [selectedAgents, setSelectedAgents] = useState(['crow']); // Default to Crow
  const [activeTab, setActiveTab] = useState('research');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('30d');

  const { user } = useAuth();
  const { subscription } = useSubscription();

  const handleAgentSelection = (agents) => {
    setSelectedAgents(agents);
  };

  const handleQuerySubmit = async (queryData) => {
    setIsProcessing(true);
    
    try {
      console.log('🧪 Mock Research Query Submission:', {
        user: user?.email,
        agents: selectedAgents,
        query: queryData
      });

      // Simulate processing time based on research depth and agent count
      const processingTime = queryData.research_depth === 'comprehensive' ? 3000 : 
                           queryData.research_depth === 'standard' ? 2000 : 1000;
      
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Mock successful response
      const mockResult = {
        id: Date.now(),
        ...queryData,
        status: 'completed',
        results: {
          summary: `Research completed using ${selectedAgents.length} AI agent(s)`,
          citations_found: Math.floor(Math.random() * 50) + 10,
          processing_time: `${processingTime / 1000}s`,
          agents_used: selectedAgents
        },
        created_at: new Date().toISOString()
      };

      // Add to recent queries
      setRecentQueries(prev => [mockResult, ...prev.slice(0, 9)]);

      console.log('✅ Mock Research Completed:', mockResult);
      
      // Switch to history tab to show results
      setActiveTab('history');
      
    } catch (error) {
      console.error('❌ Research Query Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const RecentQueriesComponent = () => (
    <div className="space-y-4">
      {recentQueries.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="pt-6 text-center">
            <Search className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/70 mb-2">No research queries yet</h3>
            <p className="text-white/50">
              Start your first research query to see results here.
            </p>
          </CardContent>
        </Card>
      ) : (
        recentQueries.map((query) => (
          <motion.div
            key={query.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="glass hover:glass-strong transition-all duration-300 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{query.title}</CardTitle>
                    <p className="text-white/60 text-sm mt-1">
                      {new Date(query.created_at).toLocaleDateString()} • 
                      {query.results?.processing_time}
                    </p>
                  </div>
                  <Badge 
                    className={`${
                      query.status === 'completed' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}
                  >
                    {query.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {query.query_text}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white/70">
                      {query.results?.agents_used?.length || 0} agents used
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-white/70">
                      {query.results?.citations_found || 0} citations
                    </span>
                  </div>
                </div>
                
                {query.results?.agents_used && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
                      {query.results.agents_used.map((agentId) => (
                        <Badge 
                          key={agentId}
                          variant="outline" 
                          className="text-xs border-white/20 text-white/60"
                        >
                          {agentId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Enhanced Research Dashboard
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Powered by FutureHouse AI agents and advanced research capabilities. 
          Select specialized agents for your research needs.
        </p>
      </motion.div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
          <TabsTrigger
            value="research"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            New Research
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
          >
            <History className="h-4 w-4 mr-2" />
            History ({recentQueries.length})
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Selection */}
            <EnhancedResearchInterface
              onQuerySubmit={handleAgentSelection}
              subscription={subscription}
            />
            
            {/* Query Form */}
            <ResearchQueryForm
              selectedAgents={selectedAgents}
              onSubmit={handleQuerySubmit}
              subscription={subscription}
              isLoading={isProcessing}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <RecentQueriesComponent />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Research Analytics</h3>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    variant={analyticsTimeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnalyticsTimeRange(range)}
                    className={analyticsTimeRange === range
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
                      : 'border-white/30 text-white hover:bg-white/10'
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <ResearchAnalytics queries={recentQueries} timeRange={analyticsTimeRange} />
          </div>
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          <AgentPerformanceAnalytics queries={recentQueries} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <ResearchInsights queries={recentQueries} timeRange={analyticsTimeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchDashboard;
