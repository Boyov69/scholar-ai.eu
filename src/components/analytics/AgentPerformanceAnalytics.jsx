import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Brain, 
  Zap, 
  Clock, 
  Target,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getAgentById, getFutureHouseAgents } from '../../lib/futureHouseAgents';

const AgentPerformanceAnalytics = ({ queries = [] }) => {
  const [agentStats, setAgentStats] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    generateAgentStats();
  }, [queries]);

  const generateAgentStats = () => {
    const agentPerformance = {};
    
    // Initialize all agents
    const allAgents = getFutureHouseAgents();
    allAgents.forEach(agent => {
      agentPerformance[agent.id] = {
        ...agent,
        totalQueries: 0,
        completedQueries: 0,
        totalCitations: 0,
        avgProcessingTime: 0,
        successRate: 0,
        avgCitationsPerQuery: 0,
        totalProcessingTime: 0,
        lastUsed: null,
        specialtyScore: 0,
        userSatisfaction: Math.random() * 20 + 80 // Mock satisfaction score 80-100%
      };
    });

    // Calculate stats from queries
    queries.forEach(query => {
      if (query.selected_agents && query.results) {
        query.selected_agents.forEach(agentId => {
          if (agentPerformance[agentId]) {
            const agent = agentPerformance[agentId];
            agent.totalQueries += 1;
            
            if (query.status === 'completed') {
              agent.completedQueries += 1;
              agent.totalCitations += query.results.citations_found || 0;
              agent.totalProcessingTime += parseFloat(query.results.processing_time || '0');
            }
            
            agent.lastUsed = new Date(query.created_at);
          }
        });
      }
    });

    // Calculate derived metrics
    Object.values(agentPerformance).forEach(agent => {
      agent.successRate = agent.totalQueries > 0 
        ? (agent.completedQueries / agent.totalQueries) * 100 
        : 0;
      
      agent.avgCitationsPerQuery = agent.completedQueries > 0 
        ? agent.totalCitations / agent.completedQueries 
        : 0;
      
      agent.avgProcessingTime = agent.completedQueries > 0 
        ? agent.totalProcessingTime / agent.completedQueries 
        : 0;

      // Calculate specialty score based on usage in relevant contexts
      agent.specialtyScore = Math.min(
        (agent.totalQueries * 10) + (agent.avgCitationsPerQuery * 5) + agent.successRate,
        100
      );
    });

    setAgentStats(Object.values(agentPerformance));
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  };

  const AgentCard = ({ agent }) => {
    const overallScore = (agent.successRate + agent.userSatisfaction + agent.specialtyScore) / 3;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedAgent(agent)}
        className="cursor-pointer"
      >
        <Card className={`glass hover:glass-strong transition-all duration-300 ${
          selectedAgent?.id === agent.id ? 'border-blue-500/50' : 'border-white/10'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color} bg-opacity-20`}>
                  <span className="text-lg">{agent.icon}</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {agent.provider}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getPerformanceColor(overallScore)}`}>
                  {getPerformanceGrade(overallScore)}
                </div>
                <div className="text-xs text-white/60">
                  {overallScore.toFixed(0)}%
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80 line-clamp-2">
              {agent.description}
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-white/70 mb-1">
                  <Target className="h-3 w-3" />
                  <span>Queries</span>
                </div>
                <div className="font-semibold text-white">{agent.totalQueries}</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-white/70 mb-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Success Rate</span>
                </div>
                <div className={`font-semibold ${getPerformanceColor(agent.successRate)}`}>
                  {agent.successRate.toFixed(0)}%
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-white/70 mb-1">
                  <Star className="h-3 w-3" />
                  <span>Avg Citations</span>
                </div>
                <div className="font-semibold text-white">
                  {agent.avgCitationsPerQuery.toFixed(1)}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-white/70 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Avg Time</span>
                </div>
                <div className="font-semibold text-white">
                  {agent.avgProcessingTime.toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Performance Bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Specialty Score</span>
                  <span>{agent.specialtyScore.toFixed(0)}%</span>
                </div>
                <Progress value={agent.specialtyScore} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>User Satisfaction</span>
                  <span>{agent.userSatisfaction.toFixed(0)}%</span>
                </div>
                <Progress value={agent.userSatisfaction} className="h-1.5" />
              </div>
            </div>

            {/* Last Used */}
            {agent.lastUsed && (
              <div className="text-xs text-white/60">
                Last used: {agent.lastUsed.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const radarData = selectedAgent ? [
    {
      metric: 'Success Rate',
      value: selectedAgent.successRate,
      fullMark: 100
    },
    {
      metric: 'Citations Quality',
      value: Math.min(selectedAgent.avgCitationsPerQuery * 10, 100),
      fullMark: 100
    },
    {
      metric: 'Speed',
      value: Math.max(100 - selectedAgent.avgProcessingTime * 10, 0),
      fullMark: 100
    },
    {
      metric: 'Specialty Score',
      value: selectedAgent.specialtyScore,
      fullMark: 100
    },
    {
      metric: 'User Satisfaction',
      value: selectedAgent.userSatisfaction,
      fullMark: 100
    },
    {
      metric: 'Usage Frequency',
      value: Math.min(selectedAgent.totalQueries * 5, 100),
      fullMark: 100
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Agent Performance Analytics
        </h2>
        <p className="text-white/70">
          Detailed performance metrics for your AI research agents
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentStats.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Detailed Analysis */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Radar Chart */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5" />
                {selectedAgent.name} Performance Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    <Radar
                      name={selectedAgent.name}
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5" />
                Detailed Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white/70 mb-1">Total Queries</div>
                  <div className="text-xl font-bold text-white">{selectedAgent.totalQueries}</div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white/70 mb-1">Completed</div>
                  <div className="text-xl font-bold text-green-400">{selectedAgent.completedQueries}</div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white/70 mb-1">Total Citations</div>
                  <div className="text-xl font-bold text-blue-400">{selectedAgent.totalCitations}</div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white/70 mb-1">Avg Time</div>
                  <div className="text-xl font-bold text-purple-400">
                    {selectedAgent.avgProcessingTime.toFixed(1)}s
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-white mb-2">Strengths</h4>
                <div className="space-y-1">
                  {selectedAgent.strengths?.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="font-semibold text-white mb-2">Best For</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.best_for?.map((use, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs border-white/20 text-white/70"
                    >
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AgentPerformanceAnalytics;
