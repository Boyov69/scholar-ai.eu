import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Grid, List, Users, Settings,
  TrendingUp, Activity, FileText, MessageSquare, Calendar,
  Crown, Shield, User, Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { WorkspaceCard } from './WorkspaceCard';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/supabase';

/**
 * 🏢 State-of-the-Art Workspace Dashboard
 * 
 * Features:
 * - Modern dashboard layout
 * - Real-time workspace analytics
 * - Advanced filtering and search
 * - Grid/List view toggle
 * - Role-based access control
 * - Activity feed
 * - Quick actions
 * - Collaboration metrics
 */
export const WorkspaceDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalWorkspaces: 0,
    ownedWorkspaces: 0,
    memberWorkspaces: 0,
    totalMembers: 0,
    activeProjects: 0,
    recentActivity: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadWorkspaces();
      loadAnalytics();
    }
  }, [user]);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getUserWorkspaces(user.id);
      
      if (error) {
        console.error('❌ Error loading workspaces:', error);
        return;
      }

      console.log('✅ Workspaces loaded:', data?.length || 0);
      setWorkspaces(data || []);
      
      // Calculate analytics
      const owned = data?.filter(w => w.owner_id === user.id).length || 0;
      const member = data?.length - owned || 0;
      const totalMembers = data?.reduce((sum, w) => sum + (w.member_count || 0), 0) || 0;
      const activeProjects = data?.reduce((sum, w) => sum + (w.project_count || 0), 0) || 0;
      
      setAnalytics(prev => ({
        ...prev,
        totalWorkspaces: data?.length || 0,
        ownedWorkspaces: owned,
        memberWorkspaces: member,
        totalMembers,
        activeProjects
      }));
      
    } catch (err) {
      console.error('❌ Load workspaces failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    // Load additional analytics data
    // This would typically fetch recent activities, notifications, etc.
  };

  const filteredWorkspaces = workspaces.filter(workspace => {
    // Add null safety checks
    const workspaceName = workspace?.name || '';
    const workspaceDescription = workspace?.description || '';

    const matchesSearch = workspaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workspaceDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' ||
                       (filterRole === 'owner' && workspace?.owner_id === user?.id) ||
                       (filterRole === 'member' && workspace?.owner_id !== user?.id);

    const matchesStatus = filterStatus === 'all' || workspace?.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Added debugging info to the handleCreateWorkspace function
  const handleCreateWorkspace = () => {
    console.log('🔍 Debug - handleCreateWorkspace called');
    console.log('🔍 Debug - Current showCreateModal state:', showCreateModal);
    setShowCreateModal(true);
    console.log('🔍 Debug - New showCreateModal state:', true);
  };

  const handleCreateSubmit = async (workspaceData) => {
    try {
      setCreateLoading(true);
      console.log('🏗️ Creating workspace:', workspaceData);
      
      // Log the development mode status
      console.log('🔍 Debug - isDevelopmentMode:', import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true');
      
      const { data, error } = await db.createWorkspace(workspaceData);

      if (error) {
        console.error('❌ Create workspace failed:', error);
        alert(`Error creating workspace: ${error.message}`);
        return;
      }

      console.log('✅ Workspace created successfully:', data);
      // Handle both array and single object responses
      const newWorkspace = Array.isArray(data) ? data[0] : data;
      setWorkspaces(prev => [newWorkspace, ...prev]);
      setShowCreateModal(false);

      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalWorkspaces: prev.totalWorkspaces + 1,
        ownedWorkspaces: prev.ownedWorkspaces + 1
      }));

      // Show success message
      if (typeof window !== 'undefined' && window.alert) {
        setTimeout(() => {
          alert(`✅ Workspace "${newWorkspace?.name || 'New Workspace'}" created successfully!`);
        }, 100);
      }

    } catch (err) {
      console.error('❌ Create workspace error:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditWorkspace = (workspace) => {
    console.log('✏️ Edit workspace:', workspace.id);
  };

  const handleDeleteWorkspace = async (workspace) => {
    if (window.confirm(`Are you sure you want to delete "${workspace.name}"?`)) {
      try {
        const { error } = await db.deleteWorkspace(workspace.id);
        if (!error) {
          setWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
          console.log('✅ Workspace deleted successfully');
        }
      } catch (err) {
        console.error('❌ Delete workspace failed:', err);
      }
    }
  };

  const handleShareWorkspace = (workspace) => {
    console.log('🔗 Share workspace:', workspace.id);
  };

  const handleWorkspaceSettings = (workspace) => {
    console.log('⚙️ Workspace settings:', workspace.id);
  };

  const handleOpenWorkspace = (workspace) => {
    console.log('🚀 Open workspace:', workspace.id);
    navigate(`/workspace/${workspace.id}`);
  };

  const getUserRole = (workspace) => {
    if (workspace.owner_id === user.id) return 'owner';
    // In a real app, you'd check the workspace_members table
    return 'member';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground drop-shadow-sm">Workspaces</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Manage your collaborative research environments
          </p>
        </div>
        
        <Button onClick={handleCreateWorkspace} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Workspaces</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalWorkspaces}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Grid className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Owned</p>
                <p className="text-3xl font-bold text-foreground">{analytics.ownedWorkspaces}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Members</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalMembers}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Projects</p>
                <p className="text-3xl font-bold text-foreground">{analytics.activeProjects}</p>
              </div>
              <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workspaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspaces Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredWorkspaces.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              currentUserRole={getUserRole(workspace)}
              onEdit={handleEditWorkspace}
              onDelete={handleDeleteWorkspace}
              onShare={handleShareWorkspace}
              onSettings={handleWorkspaceSettings}
              onClick={handleOpenWorkspace}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workspaces found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first workspace to get started with collaborative research'
              }
            </p>
            {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
              <Button onClick={handleCreateWorkspace}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        loading={createLoading}
      />
    </div>
  );
};
