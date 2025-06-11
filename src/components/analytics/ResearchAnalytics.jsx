import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  Clock, 
  Target,
  Award,
  Zap,
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const ResearchAnalytics = ({ queries = [], timeRange = '30d' }) => {
  const [selectedMetric, setSelectedMetric] = useState('productivity');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    generateAnalyticsData();
  }, [queries, timeRange]);

  const generateAnalyticsData = () => {
    // Agent Performance Analysis
    const agentPerformance = queries.reduce((acc, query) => {
      if (query.selected_agents) {
        query.selected_agents.forEach(agentId => {
          if (!acc[agentId]) {
            acc[agentId] = {
              name: agentId,
              queries: 0,
              avgTime: 0,
              successRate: 0,
              citationsFound: 0
            };
          }
          acc[agentId].queries += 1;
          acc[agentId].citationsFound += query.results?.citations_found || 0;
        });
      }
      return acc;
    }, {});

    // Research Productivity Over Time
    const productivityData = generateTimeSeriesData(queries, timeRange);

    // Research Quality Metrics
    const qualityMetrics = {
      avgCitationsPerQuery: queries.length > 0 
        ? queries.reduce((acc, q) => acc + (q.results?.citations_found || 0), 0) / queries.length 
        : 0,
      avgProcessingTime: queries.length > 0
        ? queries.reduce((acc, q) => acc + parseFloat(q.results?.processing_time || '0'), 0) / queries.length
        : 0,
      successRate: queries.length > 0
        ? (queries.filter(q => q.status === 'completed').length / queries.length) * 100
        : 0
    };

    // Research Topics Analysis
    const topicsData = generateTopicsAnalysis(queries);

    // Citation Style Distribution
    const citationStyles = queries.reduce((acc, query) => {
      const style = query.citation_style || 'apa';
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {});

    setAnalyticsData({
      agentPerformance: Object.values(agentPerformance),
      productivityData,
      qualityMetrics,
      topicsData,
      citationStyles: Object.entries(citationStyles).map(([style, count]) => ({
        name: style.toUpperCase(),
        value: count,
        color: getStyleColor(style)
      }))
    });
  };

  const generateTimeSeriesData = (queries, range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const now = new Date();
    
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayQueries = queries.filter(q => {
        const queryDate = new Date(q.created_at);
        return queryDate.toDateString() === date.toDateString();
      });

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        queries: dayQueries.length,
        completed: dayQueries.filter(q => q.status === 'completed').length,
        citations: dayQueries.reduce((acc, q) => acc + (q.results?.citations_found || 0), 0),
        avgTime: dayQueries.length > 0 
          ? dayQueries.reduce((acc, q) => acc + parseFloat(q.results?.processing_time || '0'), 0) / dayQueries.length
          : 0
      });
    }
    
    return data;
  };

  const generateTopicsAnalysis = (queries) => {
    // Mock topic analysis - in real implementation, this would use NLP
    const topics = [
      'Machine Learning',
      'Climate Science',
      'Biotechnology',
      'Quantum Computing',
      'Neuroscience',
      'Materials Science'
    ];

    return topics.map(topic => ({
      topic,
      queries: Math.floor(Math.random() * queries.length * 0.3) + 1,
      growth: (Math.random() - 0.5) * 40 // -20% to +20%
    }));
  };

  const getStyleColor = (style) => {
    const colors = {
      apa: '#3b82f6',
      mla: '#8b5cf6',
      chicago: '#f59e0b',
      bibtex: '#10b981'
    };
    return colors[style] || '#6b7280';
  };

  const metrics = [
    {
      id: 'productivity',
      name: 'Research Productivity',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'quality',
      name: 'Research Quality',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'agents',
      name: 'Agent Performance',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'topics',
      name: 'Research Topics',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="glass hover:glass-strong transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`h-3 w-3 ${change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Research Analytics
          </h2>
          <p className="text-white/70">
            Advanced insights into your research performance and patterns
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {timeRange} Analysis
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Queries"
          value={queries.length}
          change={12.5}
          icon={BarChart3}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Avg Citations"
          value={analyticsData.qualityMetrics?.avgCitationsPerQuery?.toFixed(1) || '0'}
          change={8.3}
          icon={BookOpen}
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Success Rate"
          value={`${analyticsData.qualityMetrics?.successRate?.toFixed(0) || '0'}%`}
          change={5.2}
          icon={Target}
          color="from-purple-500 to-pink-500"
        />
        <MetricCard
          title="Avg Time"
          value={`${analyticsData.qualityMetrics?.avgProcessingTime?.toFixed(1) || '0'}s`}
          change={-15.7}
          icon={Clock}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Button
              key={metric.id}
              variant={selectedMetric === metric.id ? 'default' : 'outline'}
              onClick={() => setSelectedMetric(metric.id)}
              className={`${
                selectedMetric === metric.id 
                  ? `bg-gradient-to-r ${metric.color} text-white border-0` 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {metric.name}
            </Button>
          );
        })}
      </div>

      {/* Dynamic Chart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5" />
              {selectedMetric === 'productivity' && 'Research Productivity Over Time'}
              {selectedMetric === 'quality' && 'Research Quality Trends'}
              {selectedMetric === 'agents' && 'Agent Performance Comparison'}
              {selectedMetric === 'topics' && 'Research Topics Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'productivity' && (
                  <AreaChart data={analyticsData.productivityData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Queries"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Completed"
                    />
                  </AreaChart>
                )}
                
                {selectedMetric === 'agents' && (
                  <BarChart data={analyticsData.agentPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="queries" fill="#8b5cf6" name="Queries" />
                    <Bar dataKey="citationsFound" fill="#3b82f6" name="Citations" />
                  </BarChart>
                )}

                {selectedMetric === 'topics' && (
                  <BarChart data={analyticsData.topicsData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="topic" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="queries" fill="#f59e0b" name="Queries" />
                  </BarChart>
                )}

                {selectedMetric === 'quality' && (
                  <LineChart data={analyticsData.productivityData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="citations"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Citations"
                    />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Avg Time (s)"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResearchAnalytics;
