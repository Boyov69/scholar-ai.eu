import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Users, 
  Plus, 
  Settings, 
  Share, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  User,
  Clock,
  FileText,
  BookOpen,
  MessageSquare,
  Activity,
  Globe,
  Lock,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { db, supabase, workspaceMembers, users } from '../../lib/supabase';

// Development mode detection
const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

const WorkspacePage = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { canPerformAction, getRemainingQuota } = useSubscription();
  
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Create workspace modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  
  // Invite member state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Activity feed state
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated) {
      loadWorkspaces();
      if (workspaceId) {
        loadWorkspace(workspaceId);
      }
    }
  }, [isAuthenticated, workspaceId]);

  // Debug modal state changes
  useEffect(() => {
    console.log('🔘 Modal state changed - showCreateModal:', showCreateModal);
  }, [showCreateModal]);

  // Debug subscription and permissions
  useEffect(() => {
    console.log('🔘 Subscription debug:', {
      canCreateWorkspace: canPerformAction('create_workspace'),
      remainingQuota: getRemainingQuota('workspaces'),
      user: user?.id,
      isAuthenticated
    });
  }, [canPerformAction, getRemainingQuota, user, isAuthenticated]);

  useEffect(() => {
    if (currentWorkspace) {
      loadMembers(currentWorkspace.id);
      loadQueries(currentWorkspace.id);
      loadActivities(currentWorkspace.id);
      
      // Set up real-time subscriptions
      const workspaceSubscription = supabase
        .channel(`workspace:${currentWorkspace.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'workspace_members',
          filter: `workspace_id=eq.${currentWorkspace.id}`
        }, (payload) => {
          loadMembers(currentWorkspace.id);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'research_queries',
          filter: `workspace_id=eq.${currentWorkspace.id}`
        }, (payload) => {
          loadQueries(currentWorkspace.id);
          loadActivities(currentWorkspace.id);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(workspaceSubscription);
      };
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await db.getUserWorkspaces(user.id);
      if (error) throw error;
      setWorkspaces(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkspace = async (id) => {
    try {
      const { data, error } = await db.getWorkspaceById(id);
      if (error) throw error;
      setCurrentWorkspace(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadMembers = async (workspaceId) => {
    try {
      const { data, error } = await workspaceMembers.getByWorkspaceId(workspaceId);
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const loadQueries = async (workspaceId) => {
    try {
      const { data, error } = await db.queries.getByWorkspaceId(workspaceId);
      if (error) throw error;
      setQueries(data || []);
    } catch (err) {
      console.error('Error loading queries:', err);
    }
  };

  const loadActivities = async (workspaceId) => {
    try {
      // Mock activity data for now
      const mockActivities = [
        {
          id: 1,
          type: 'query_created',
          user: { name: 'John Doe', avatar: null },
          description: 'created a new research query',
          target: 'Machine Learning in Healthcare',
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          id: 2,
          type: 'member_joined',
          user: { name: 'Jane Smith', avatar: null },
          description: 'joined the workspace',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: 3,
          type: 'query_completed',
          user: { name: 'Mike Johnson', avatar: null },
          description: 'completed research query',
          target: 'Climate Change Impact Studies',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
        }
      ];
      setActivities(mockActivities);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const createWorkspace = async () => {
    console.log('=============== CREATE WORKSPACE DEBUG ===============');
    console.log('1. Function called');
    setError(null); // Clear any previous errors

    // Check permissions (but don't block for debugging)
    const canCreate = canPerformAction('create_workspace');
    console.log('2. Permission check result:', canCreate);

    if (!canCreate) {
      console.warn('⚠️ Permission check failed, but continuing for debugging');
      // setError('You have reached your workspace limit. Please upgrade your plan.');
      // return;
    }

    try {
      console.log('3. Setting loading state');
      setLoading(true);
      
      console.log('4. Preparing workspace data');
      console.log('4a. User:', user);
      
      if (!user || !user.id) {
        console.error('❌ ERROR: Missing user data:', user);
        setError('User data not available. Please sign in again.');
        setLoading(false);
        return;
      }
      
      // Validate form data
      if (!createForm.name.trim()) {
        setError('Workspace name is required');
        setLoading(false);
        return;
      }
      
      const workspaceData = {
        owner_id: user.id,
        name: createForm.name.trim(),
        description: createForm.description.trim(),
        is_public: createForm.isPublic,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('5. Workspace data prepared:', JSON.stringify(workspaceData));
      console.log('6. Calling db.createWorkspace');
      
      // Check if db object is available
      if (!db || !db.createWorkspace) {
        console.error('❌ ERROR: db or db.createWorkspace is not available:', db);
        setError('Database connection error');
        setLoading(false);
        return;
      }
      
      const result = await db.createWorkspace(workspaceData);
      console.log('7. createWorkspace result:', result);
      
      if (!result) {
        throw new Error('No result returned from createWorkspace');
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('8a. ❌ Error creating workspace:', error);
        throw error;
      }
      
      if (!data) {
        console.error('8b. ❌ No data returned from createWorkspace');
        throw new Error('Failed to create workspace - no data returned');
      }
      
      // Handle both array and object returns for better compatibility
      const newWorkspace = Array.isArray(data) ? data[0] : data;
      console.log('9. Processed workspace data:', newWorkspace);
      
      if (!newWorkspace || !newWorkspace.id) {
        console.error('10a. ❌ Invalid workspace data:', newWorkspace);
        throw new Error('Failed to create workspace - invalid data structure');
      }
      
      console.log('10b. ✅ Workspace created successfully:', newWorkspace.id);

      // Add creator as owner
      console.log('11. Adding creator as owner');
      
      // Check if workspaceMembers is available
      if (!workspaceMembers || !workspaceMembers.create) {
        console.error('❌ ERROR: workspaceMembers or workspaceMembers.create is not available:', workspaceMembers);
        throw new Error('Could not add member to workspace - API not available');
      }
      
      const memberData = {
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: 'owner',
        joined_at: new Date().toISOString()
      };
      console.log('12. Member data:', JSON.stringify(memberData));
      
      // Try to add user as member, but don't fail if it's a mock workspace
      const memberResult = await workspaceMembers.create(memberData);
      console.log('13. Member creation result:', memberResult);
      
      if (memberResult.error) {
        console.error('❌ Error adding member to workspace:', memberResult.error);
        
        // Only fail if we're NOT in development mode with a mock workspace
        if (!isDevelopmentMode || !newWorkspace.id.startsWith('mock-workspace-')) {
          throw memberResult.error;
        } else {
          console.log('⚠️ Ignoring member error in development mode for mock workspace');
        }
      }

      console.log('14. Loading workspaces');
      await loadWorkspaces();
      
      console.log('15. Resetting UI state');
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', isPublic: false });
      
      console.log('16. Navigating to new workspace');
      navigate(`/workspace/${newWorkspace.id}`);
      console.log('17. ✅ Complete workspace creation process');
      
    } catch (err) {
      console.error('❌ Workspace creation failed:', err);
      setError(err.message || 'Failed to create workspace');
    } finally {
      console.log('18. Setting loading to false');
      setLoading(false);
      console.log('=============== END CREATE WORKSPACE DEBUG ===============');
    }
  };

  const inviteMember = async () => {
    try {
      setInviteLoading(true);
      
      // Check if user exists
      const { data: existingUser, error: userError } = await users.getByEmail(inviteEmail);
      if (userError && userError.code !== 'PGRST116') throw userError;
      
      if (!existingUser) {
        setError('User not found. They need to create an account first.');
        return;
      }

      // Check if already a member
      const { data: existingMember, error: memberError } = await workspaceMembers.getByWorkspaceAndUser(
        currentWorkspace.id,
        existingUser.id
      );
      if (memberError && memberError.code !== 'PGRST116') throw memberError;
      
      if (existingMember) {
        setError('User is already a member of this workspace.');
        return;
      }

      // Add member
      await workspaceMembers.create({
        workspace_id: currentWorkspace.id,
        user_id: existingUser.id,
        role: inviteRole,
        invited_by: user.id
      });

      await loadMembers(currentWorkspace.id);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-400" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'query_created': return <FileText className="h-4 w-4 text-blue-400" />;
      case 'query_completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'member_joined': return <UserPlus className="h-4 w-4 text-purple-400" />;
      case 'citation_added': return <BookOpen className="h-4 w-4 text-orange-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="glass-strong max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access collaborative workspaces and team research features.
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

  // Workspace list view
  if (!workspaceId) {
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
                  Research Workspaces
                </h1>
                <p className="text-muted-foreground text-lg">
                  Collaborate with your team on research projects
                </p>
              </div>
              
              <Button
                onClick={() => {
                  console.log('🔘 New Workspace button clicked');
                  console.log('🔘 Current user:', user);
                  console.log('🔘 Can perform action:', canPerformAction('create_workspace'));
                  console.log('🔘 Setting showCreateModal to true');
                  setError(null); // Clear any previous errors
                  setShowCreateModal(true);
                }}
                className="ice-gradient hover:opacity-90"
                // Temporarily remove disabled state to test modal opening
                // disabled={!canPerformAction('create_workspace')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </motion.div>

          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Workspaces Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading workspaces...</p>
            </div>
          ) : workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass hover:glass-strong transition-all duration-300 cursor-pointer h-full"
                        onClick={() => navigate(`/workspace/${workspace.id}`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{workspace.name}</CardTitle>
                          <CardDescription className="mb-3">
                            {workspace.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {workspace.is_public ? (
                            <Globe className="h-4 w-4 text-green-400" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {workspace.member_count || 1} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(workspace.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass-strong text-center">
              <CardContent className="pt-12 pb-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Workspaces Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first workspace to start collaborating with your team on research projects.
                </p>
                <Button
                  onClick={() => {
                    console.log('🔘 Create Workspace button (empty state) clicked');
                    setError(null);
                    setShowCreateModal(true);
                  }}
                  className="ice-gradient hover:opacity-90"
                  // Temporarily remove disabled state to test modal opening
                  // disabled={!canPerformAction('create_workspace')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Create Workspace Modal - Direct implementation */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                 onClick={() => {
                   console.log('🔘 Modal backdrop clicked');
                   setShowCreateModal(false);
                 }}>
              <div
                className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden"
                onClick={(e) => {
                  console.log('🔘 Modal content clicked');
                  e.stopPropagation();
                }}
              >
                {/* Header */}
                <div className="p-6 pb-2">
                  <h2 className="text-2xl font-bold">Create New Workspace</h2>
                  <p className="text-muted-foreground mt-1">
                    Set up a collaborative space for your research team
                  </p>
                  {/* Debug info */}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Debug: Modal is rendering. User: {user?.email || 'No user'}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 pt-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Workspace Name</Label>
                      <Input
                        placeholder="Enter workspace name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description (Optional)</Label>
                      <Textarea
                        placeholder="Describe the purpose of this workspace"
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={createForm.isPublic}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <Label htmlFor="isPublic" className="text-sm">
                        Make this workspace public
                      </Label>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        console.log('Canceling workspace creation');
                        setShowCreateModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔘 Create button clicked in modal');
                        console.log('🔘 Form data:', createForm);
                        console.log('🔘 Loading state:', loading);
                        console.log('🔘 User data:', user);

                        if (!createForm.name.trim()) {
                          console.log('🔘 Validation failed: name is required');
                          setError('Workspace name is required');
                          return;
                        }

                        console.log('🔘 Calling createWorkspace function');
                        createWorkspace();
                      }}
                      disabled={!createForm.name.trim() || loading}
                      className="ice-gradient hover:opacity-90"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Individual workspace view
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Workspace Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold ice-gradient-text mb-2">
                {currentWorkspace?.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {currentWorkspace?.description || 'Collaborative research workspace'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(true)}
                className="border-primary/30"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button
                variant="outline"
                className="border-primary/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'queries', label: 'Research', icon: FileText },
              { id: 'members', label: 'Members', icon: Users },
              { id: 'activity', label: 'Activity', icon: Activity }
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{queries.length}</p>
                        <p className="text-sm text-muted-foreground">Research Queries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Users className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{members.length}</p>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <BookOpen className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {queries.filter(q => q.status === 'completed').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Queries */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Research</CardTitle>
                </CardHeader>
                <CardContent>
                  {queries.length > 0 ? (
                    <div className="space-y-3">
                      {queries.slice(0, 5).map((query) => (
                        <div key={query.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium">{query.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(query.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className={
                            query.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            query.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {query.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No research queries yet. Start by creating your first query.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-muted/30">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>{' '}
                          {activity.description}
                          {activity.target && (
                            <span className="font-medium"> "{activity.target}"</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'members' && (
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({members.length})</CardTitle>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="ice-gradient hover:opacity-90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user?.avatar_url} />
                        <AvatarFallback>
                          {member.user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user?.full_name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-strong w-full max-w-md">
                <CardHeader>
                  <CardTitle>Invite Team Member</CardTitle>
                  <CardDescription>
                    Add a new member to this workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 border-primary/30"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={inviteMember}
                      disabled={!inviteEmail.trim() || inviteLoading}
                      className="flex-1 ice-gradient hover:opacity-90"
                    >
                      {inviteLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;

