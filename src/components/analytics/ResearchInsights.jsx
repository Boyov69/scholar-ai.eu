import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  Brain, 
  Clock, 
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  BookOpen,
  Calendar,
  BarChart3
} from 'lucide-react';

const ResearchInsights = ({ queries = [], timeRange = '30d' }) => {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateInsights();
    generateRecommendations();
  }, [queries, timeRange]);

  const generateInsights = () => {
    const newInsights = [];

    // Productivity Insights
    const recentQueries = queries.filter(q => {
      const queryDate = new Date(q.created_at);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));
      return queryDate >= cutoff;
    });

    const completedQueries = recentQueries.filter(q => q.status === 'completed');
    const successRate = recentQueries.length > 0 ? (completedQueries.length / recentQueries.length) * 100 : 0;

    if (successRate > 90) {
      newInsights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Research Success Rate',
        description: `Your research completion rate is ${successRate.toFixed(0)}%, which is outstanding!`,
        impact: 'high',
        trend: 'positive'
      });
    } else if (successRate < 70) {
      newInsights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Research Success Rate Needs Attention',
        description: `Your completion rate is ${successRate.toFixed(0)}%. Consider refining your research queries.`,
        impact: 'medium',
        trend: 'negative'
      });
    }

    // Agent Usage Insights
    const agentUsage = {};
    recentQueries.forEach(query => {
      if (query.selected_agents) {
        query.selected_agents.forEach(agentId => {
          agentUsage[agentId] = (agentUsage[agentId] || 0) + 1;
        });
      }
    });

    const mostUsedAgent = Object.entries(agentUsage).sort(([,a], [,b]) => b - a)[0];
    if (mostUsedAgent) {
      newInsights.push({
        type: 'info',
        icon: Brain,
        title: 'Most Productive Agent',
        description: `${mostUsedAgent[0]} has been your go-to agent with ${mostUsedAgent[1]} queries.`,
        impact: 'medium',
        trend: 'neutral'
      });
    }

    // Time-based Insights
    const avgProcessingTime = completedQueries.length > 0 
      ? completedQueries.reduce((acc, q) => acc + parseFloat(q.results?.processing_time || '0'), 0) / completedQueries.length
      : 0;

    if (avgProcessingTime < 2) {
      newInsights.push({
        type: 'success',
        icon: Zap,
        title: 'Lightning Fast Research',
        description: `Your average query processing time is ${avgProcessingTime.toFixed(1)}s - incredibly efficient!`,
        impact: 'medium',
        trend: 'positive'
      });
    }

    // Citation Quality Insights
    const totalCitations = completedQueries.reduce((acc, q) => acc + (q.results?.citations_found || 0), 0);
    const avgCitations = completedQueries.length > 0 ? totalCitations / completedQueries.length : 0;

    if (avgCitations > 15) {
      newInsights.push({
        type: 'success',
        icon: BookOpen,
        title: 'High-Quality Research Output',
        description: `You're averaging ${avgCitations.toFixed(1)} citations per query - excellent depth!`,
        impact: 'high',
        trend: 'positive'
      });
    }

    // Research Pattern Insights
    const queryTimes = recentQueries.map(q => new Date(q.created_at).getHours());
    const peakHour = queryTimes.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const mostActiveHour = Object.entries(peakHour).sort(([,a], [,b]) => b - a)[0];
    if (mostActiveHour && mostActiveHour[1] > 2) {
      newInsights.push({
        type: 'info',
        icon: Clock,
        title: 'Peak Research Hours',
        description: `You're most productive around ${mostActiveHour[0]}:00. Consider scheduling important research then.`,
        impact: 'low',
        trend: 'neutral'
      });
    }

    setInsights(newInsights);
  };

  const generateRecommendations = () => {
    const newRecommendations = [];

    // Agent Diversification
    const agentUsage = {};
    queries.forEach(query => {
      if (query.selected_agents) {
        query.selected_agents.forEach(agentId => {
          agentUsage[agentId] = (agentUsage[agentId] || 0) + 1;
        });
      }
    });

    const uniqueAgents = Object.keys(agentUsage).length;
    if (uniqueAgents < 3) {
      newRecommendations.push({
        type: 'agent',
        icon: Brain,
        title: 'Try Different AI Agents',
        description: 'Experiment with Falcon for deep analysis or Owl for precedent research to get diverse perspectives.',
        priority: 'medium',
        action: 'Explore Agents'
      });
    }

    // Research Depth
    const comprehensiveQueries = queries.filter(q => q.research_depth === 'comprehensive').length;
    const totalQueries = queries.length;
    
    if (totalQueries > 5 && comprehensiveQueries / totalQueries < 0.3) {
      newRecommendations.push({
        type: 'quality',
        icon: Target,
        title: 'Consider Deeper Research',
        description: 'Try comprehensive analysis mode for more thorough literature reviews and better insights.',
        priority: 'high',
        action: 'Use Deep Analysis'
      });
    }

    // Multi-agent Queries
    const multiAgentQueries = queries.filter(q => q.selected_agents && q.selected_agents.length > 1).length;
    if (totalQueries > 3 && multiAgentQueries / totalQueries < 0.4) {
      newRecommendations.push({
        type: 'efficiency',
        icon: Zap,
        title: 'Leverage Multi-Agent Research',
        description: 'Combine multiple agents for comprehensive analysis. Try Crow + Falcon for quick overview + deep dive.',
        priority: 'high',
        action: 'Use Multiple Agents'
      });
    }

    // Citation Styles
    const citationStyles = new Set(queries.map(q => q.citation_style).filter(Boolean));
    if (citationStyles.size === 1) {
      newRecommendations.push({
        type: 'format',
        icon: BookOpen,
        title: 'Explore Citation Formats',
        description: 'Try different citation styles like BibTeX for LaTeX or Chicago for humanities research.',
        priority: 'low',
        action: 'Try New Formats'
      });
    }

    // Research Frequency
    const recentQueries = queries.filter(q => {
      const queryDate = new Date(q.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return queryDate >= weekAgo;
    });

    if (recentQueries.length < 2 && totalQueries > 5) {
      newRecommendations.push({
        type: 'productivity',
        icon: Calendar,
        title: 'Maintain Research Momentum',
        description: 'Regular research sessions lead to better insights. Consider setting a research schedule.',
        priority: 'medium',
        action: 'Schedule Research'
      });
    }

    setRecommendations(newRecommendations);
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'info': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'agent': return 'from-purple-500 to-pink-500';
      case 'quality': return 'from-blue-500 to-indigo-500';
      case 'efficiency': return 'from-green-500 to-teal-500';
      case 'format': return 'from-orange-500 to-red-500';
      case 'productivity': return 'from-cyan-500 to-blue-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium': return <Star className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Lightbulb className="h-4 w-4 text-blue-400" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-400" />;
    }
  };

  const InsightCard = ({ insight }) => {
    const Icon = insight.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="glass hover:glass-strong transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type)} bg-opacity-20`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{insight.title}</h3>
                  {insight.trend === 'positive' && <TrendingUp className="h-4 w-4 text-green-400" />}
                  {insight.trend === 'negative' && <TrendingDown className="h-4 w-4 text-red-400" />}
                </div>
                <p className="text-white/80 text-sm mb-3">{insight.description}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    insight.impact === 'high' ? 'border-red-400/30 text-red-300' :
                    insight.impact === 'medium' ? 'border-yellow-400/30 text-yellow-300' :
                    'border-blue-400/30 text-blue-300'
                  }`}
                >
                  {insight.impact} impact
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const RecommendationCard = ({ recommendation }) => {
    const Icon = recommendation.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="glass hover:glass-strong transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getRecommendationColor(recommendation.type)} bg-opacity-20`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{recommendation.title}</h3>
                  {getPriorityIcon(recommendation.priority)}
                </div>
                <p className="text-white/80 text-sm mb-4">{recommendation.description}</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {recommendation.action}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Research Insights & Recommendations
        </h2>
        <p className="text-white/70">
          AI-powered insights to optimize your research workflow
        </p>
      </div>

      {/* Insights Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Key Insights
        </h3>
        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        ) : (
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <BarChart3 className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/70 mb-2">No Insights Yet</h3>
              <p className="text-white/50">
                Complete more research queries to unlock personalized insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommendations
        </h3>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard key={index} recommendation={recommendation} />
            ))}
          </div>
        ) : (
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <Lightbulb className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/70 mb-2">All Optimized!</h3>
              <p className="text-white/50">
                Your research workflow is well-optimized. Keep up the great work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResearchInsights;
