import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  Brain, 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Zap,
  Star,
  Award,
  Activity,
  Download,
  Share,
  Settings,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { db } from '../../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { tier, usage, getRemainingQuota } = useSubscription();
  
  const [stats, setStats] = useState({
    totalQueries: 0,
    completedQueries: 0,
    totalCitations: 0,
    workspaces: 0,
    collaborators: 0
  });
  
  const [recentQueries, setRecentQueries] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [citationData, setCitationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (user?.id) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, selectedPeriod, navigate]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load basic stats
      const [queriesRes, citationsRes, workspacesRes] = await Promise.all([
        db.getUserResearchQueries(user.id),
        db.getUserCitations(user.id),
        db.getUserWorkspaces(user.id)
      ]);

      const queries = queriesRes.data || [];
      const citations = citationsRes.data || [];
      const workspaces = workspacesRes.data || [];

      setStats({
        totalQueries: queries.length,
        completedQueries: queries.filter(q => q.status === 'completed').length,
        totalCitations: citations.length,
        workspaces: workspaces.length,
        collaborators: 0 // Would be calculated from workspace members
      });

      setRecentQueries(queries.slice(0, 5));
      
      // Generate usage data for charts
      generateUsageData(queries);
      generateCitationData(citations);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateUsageData = (queries) => {
    const now = new Date();
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayQueries = queries.filter(q => {
        if (!q.created_at) return false;
        const queryDate = new Date(q.created_at);
        return queryDate.toDateString() === date.toDateString();
      });

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        queries: dayQueries.length,
        completed: dayQueries.filter(q => q.status === 'completed').length,
        citations: dayQueries.reduce((acc, q) => acc + (q.metadata?.total_sources || 0), 0)
      });
    }
    
    setUsageData(data);
  };

  const generateCitationData = (citations) => {
    const styleCount = citations.reduce((acc, citation) => {
      const style = citation.citation_style || 'apa';
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(styleCount).map(([style, count]) => ({
      name: style.toUpperCase(),
      value: count,
      color: getStyleColor(style)
    }));

    setCitationData(data);
  };

  const getStyleColor = (style) => {
    const colors = {
      apa: '#3b82f6',
      mla: '#8b5cf6',
      chicago: '#f59e0b',
      harvard: '#10b981',
      ieee: '#ef4444',
      vancouver: '#6366f1'
    };
    return colors[style] || '#6b7280';
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Quick actions - Enhanced features can be disabled via feature flag
  const quickActions = [
    // TEMPORARILY DISABLED: Enhanced Research
    ...(import.meta.env.VITE_ENABLE_ENHANCED_WORKSPACE === 'true' ? [{
      title: 'Enhanced Research',
      description: 'Multi-agent AI research with FutureHouse',
      icon: Zap,
      action: () => navigate('/research/enhanced'),
      color: 'bg-gradient-to-r from-green-500 to-blue-500 text-white',
      badge: 'FREE TRIAL',
      highlight: true // No longer premium - free for all users
    }] : []),
    {
      title: 'Standard Research',
      description: 'Start a new AI-powered research',
      icon: Brain,
      action: () => navigate('/research'),
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      title: 'View Citations',
      description: 'Manage your bibliography',
      icon: BookOpen,
      action: () => navigate('/citations'),
      color: 'bg-green-500/20 text-green-400'
    },
    {
      title: 'Manage Workspaces',
      description: 'Collaborate with your team',
      icon: Users,
      action: () => navigate('/workspaces'),
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      title: 'Account Settings',
      description: 'Manage your profile',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-orange-500/20 text-orange-400'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="glass-strong max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your research dashboard and analytics.
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
                Welcome back, {user?.full_name?.split(' ')[0] || 'Researcher'}
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's your research activity and insights
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-primary/30"
                onClick={() => navigate('/research')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Query
              </Button>
              <Button
                variant="outline"
                className="border-primary/30"
                onClick={() => navigate('/workspaces')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Workspaces
              </Button>
            </div>
          </div>

          {/* Subscription Status */}
          <Card className="glass mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{tier} Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {getRemainingQuota('queries')} queries remaining this month
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/pricing')}
                  className="border-primary/30"
                >
                  {tier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass hover:glass-strong transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalQueries}</p>
                  <p className="text-sm text-muted-foreground">Total Queries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedQueries}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCitations}</p>
                  <p className="text-sm text-muted-foreground">Citations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover:glass-strong transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.workspaces}</p>
                  <p className="text-sm text-muted-foreground">Workspaces</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* If no workspaces, show redirect card */}
        {stats.workspaces === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="glass-strong">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Create Your First Workspace</h3>
                <p className="text-muted-foreground mb-4">
                  Start collaborating with your team on research projects
                </p>
                <Button
                  onClick={() => navigate('/workspaces')}
                  className="ice-gradient hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Go to Workspaces
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Usage Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5" />
                        Research Activity
                      </CardTitle>
                      <CardDescription>
                        Your research queries and citations over time
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {['7d', '30d', '90d'].map((period) => (
                        <Button
                          key={period}
                          variant={selectedPeriod === period ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPeriod(period)}
                          className={selectedPeriod === period ? 'ice-gradient' : 'border-primary/30'}
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9ca3af"
                          fontSize={12}
                        />
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
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Queries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Research
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/research')}
                      className="border-primary/30"
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentQueries.length > 0 ? (
                    <div className="space-y-4">
                      {recentQueries.map((query) => (
                        <div key={query.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{query.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {(query.question || query.query_text || query.title || 'No description available').substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {query.created_at ? new Date(query.created_at).toLocaleDateString() : 'Unknown date'}
                              </div>
                              {query.metadata?.total_sources && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {query.metadata.total_sources} sources
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              query.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              query.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }>
                              {query.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/citations?query=${query.id}`)}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No Research Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start your first research query to see it here.
                      </p>
                      <Button 
                        onClick={() => navigate('/research')}
                        className="ice-gradient hover:opacity-90"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Start Research
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Limits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Usage This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Research Queries</span>
                      <span className={getUsageColor(getUsagePercentage(usage?.queries_used || 0, usage?.queries_limit || 50))}>
                        {usage?.queries_used || 0} / {usage?.queries_limit === -1 ? '∞' : usage?.queries_limit || 50}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage?.queries_used || 0, usage?.queries_limit || 50)} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Collaborators</span>
                      <span className={getUsageColor(getUsagePercentage(usage?.collaborators_count || 0, usage?.collaborators_limit || 2))}>
                        {usage?.collaborators_count || 0} / {usage?.collaborators_limit === -1 ? '∞' : usage?.collaborators_limit || 2}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage?.collaborators_count || 0, usage?.collaborators_limit || 2)} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage</span>
                      <span className={getUsageColor(getUsagePercentage(usage?.storage_used || 0, usage?.storage_limit || 1073741824))}>
                        {Math.round((usage?.storage_used || 0) / 1024 / 1024)}MB / {Math.round((usage?.storage_limit || 1073741824) / 1024 / 1024)}MB
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage?.storage_used || 0, usage?.storage_limit || 1073741824)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Citation Styles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Citation Styles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {citationData.length > 0 ? (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={citationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {citationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No citations yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start border-primary/30 hover:bg-muted/50 relative ${
                          action.badge ? 'border-blue-500/50' : ''
                        } ${action.premium ? 'opacity-90' : ''}`}
                        onClick={action.action}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{action.title}</p>
                            {action.badge && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5">
                                {action.badge}
                              </Badge>
                            )}
                            {action.premium && (
                              <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 text-xs px-2 py-0.5">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                            {action.premium && ' (Ultra-Intelligent & PhD-Level)'}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

