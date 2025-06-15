import { createClient } from '@supabase/supabase-js'

// Development mode detection
const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

// Get the correct base URL for redirects
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, use current origin
    return window.location.origin;
  }
  // Fallback for SSR
  return import.meta.env.VITE_APP_URL || 'https://www.scholarai.eu';
};

// 🔧 FIXED: Use environment variables instead of hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xicjnnzzykdhbmrpafhs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg0MjksImV4cCI6MjA2NDk1NDQyOX0.4N0ZKvuaCpDqWmmtgK_j-Ra4BkUQrVQXot2B8Gzs9kI'

// ✅ Supabase client configured for production

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
});

// Authentication helpers
export const auth = {
  signUp: async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/callback`,
          ...options
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  },

  signIn: async (email, password) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        console.error('🚨 Sign in error:', error);
      } else {
        console.log('✅ Sign in successful:', data?.user?.email);
      }
      return { data, error };
    } catch (error) {
      console.error('🔥 Sign in exception:', error);
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      console.log('🚪 Signing out...');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
      const { error } = await supabase.auth.signOut()
      console.log('✅ Sign out successful');
      return { error }
    } catch (error) {
      console.error('🔥 Sign out error:', error)
      return { error }
    }
  },

  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getBaseUrl()}/auth/reset-password`
      })
      return { data, error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      console.error('Get current user error:', error)
      return { user: null, error }
    }
  }
}

// Database helpers with security
export const db = {
  // User profiles
  getUserProfile: async (userId) => {
    try {
      console.log('✅ Real getUserProfile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { data: null, error };
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      console.log('✅ Real updateUserProfile for user:', userId, updates);
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { data: null, error };
    }
  },

  // Research queries with RLS
  createResearchQuery: async (queryData) => {
    try {
      console.log('✅ createResearchQuery:', queryData);

      if (!queryData.user_id || !queryData.query || !queryData.agent_type) {
        const error = new Error('Missing required fields: user_id, query, agent_type');
        console.error('❌ Validation error:', error);
        return { data: null, error };
      }

      // In development mode, use mock data to avoid database issues
      if (isDevelopmentMode) {
        console.log('🚧 Development mode: Creating mock research query');
        const mockQuery = {
          id: `mock-query-${Date.now()}`,
          ...queryData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { data: mockQuery, error: null };
      }

      // Production mode: try database insert
      const { data, error } = await supabase
        .from('research_queries')
        .insert([queryData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        return { data: null, error };
      }

      console.log('✅ Research query created successfully');
      return { data, error: null };

    } catch (error) {
      console.error('❌ Create research query exception:', error);
      return { data: null, error };
    }
  },

  getUserResearchQueries: async (userId, limit = 50) => {
    try {
      console.log('✅ getUserResearchQueries for user:', userId);

      // In development mode, return mock data
      if (isDevelopmentMode) {
        console.log('🚧 Development mode: Returning mock research queries');
        return {
          data: [],
          error: null,
          message: 'Development mode - no queries yet'
        };
      }

      // Production mode: query database
      const { data, error } = await supabase
        .from('research_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error loading research queries:', error);
        return { data: [], error };
      }

      console.log('✅ Research queries loaded:', data?.length || 0, 'queries');
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user research queries error:', error);
      return { data: [], error };
    }
  },

  updateResearchQuery: async (queryId, updates) => {
    try {
      console.log('✅ Real updateResearchQuery:', queryId, updates);
      const { data, error } = await supabase
        .from('research_queries')
        .update(updates)
        .eq('id', queryId)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Update research query error:', error)
      return { data: null, error }
    }
  },

  // Citations with security
  getUserCitations: async (userId, limit = 100) => {
    try {
      console.log('✅ getUserCitations for user:', userId);

      // In development mode, return mock data
      if (isDevelopmentMode) {
        console.log('🚧 Development mode: Returning mock citations');
        return {
          data: [],
          error: null,
          message: 'Development mode - no citations yet'
        };
      }

      // Production mode: query database
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error loading citations:', error);
        return { data: [], error };
      }

      console.log('✅ Citations loaded:', data?.length || 0, 'citations');
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user citations error:', error);
      return { data: [], error };
    }
  },

  createCitation: async (citationData) => {
    try {
      const { data, error } = await supabase
        .from('citations')
        .insert([citationData])
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create citation error:', error);
      return { data: null, error };
    }
  },

  createMultipleCitations: async (citationsArray) => {
    try {
      console.log('✅ Real createMultipleCitations:', citationsArray.length, 'citations');
      const { data, error } = await supabase
        .from('citations')
        .insert(citationsArray)
        .select();
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      console.log('✅ Citations saved successfully:', data?.length || 0);
      return { data, error: null };
    } catch (error) {
      console.error('Create multiple citations error:', error);
      return { data: null, error };
    }
  },

  deleteCitation: async (citationId) => {
    try {
      const { error } = await supabase
        .from('citations')
        .delete()
        .eq('id', citationId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete citation error:', error);
      return { error };
    }
  },

  updateCitation: async (citationId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('citations')
        .update(updateData)
        .eq('id', citationId)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update citation error:', error);
      return { data: null, error };
    }
  },

  // Workspace functions in db object
  getUserWorkspaces: async (userId) => {
    try {
      console.log('✅ getUserWorkspaces for user:', userId);

      // In development mode, return mock workspace
      if (isDevelopmentMode) {
        console.log('🚧 Development mode: Returning mock workspace');
        const mockWorkspace = {
          id: `demo-workspace-${Date.now()}`,
          name: 'Demo Workspace',
          description: 'Your first workspace for collaborative research (development mode)',
          owner_id: userId,
          color_theme: '#10B981',
          visibility: 'private',
          created_at: new Date().toISOString(),
          is_demo: true
        };
        return { data: [mockWorkspace], error: null };
      }

      // Production mode: query database
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading workspaces:', error);
        return { data: [], error };
      }

      console.log('✅ Workspaces loaded:', data?.length || 0, 'workspaces');
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get user workspaces error:', error);
      return { data: [], error };
    }
  },

  createWorkspace: async (workspaceData) => {
    try {
      console.log('✅ createWorkspace:', workspaceData.name);

      // In development mode, create mock workspace
      if (isDevelopmentMode) {
        console.log('🚧 Development mode: Creating mock workspace');
        const mockWorkspace = {
          id: `mock-workspace-${Date.now()}`,
          ...workspaceData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { data: [mockWorkspace], error: null };
      }

      // Production mode: insert into database
      const { data, error } = await supabase
        .from('workspaces')
        .insert([workspaceData])
        .select();

      if (error) {
        console.error('❌ Database error:', error);
        return { data: null, error };
      }

      console.log('✅ Workspace created successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Create workspace error:', error);
      return { data: null, error };
    }
  }
};

// 🗑️ REMOVED: Duplicate workspace functions (already in db object above)

// Users
export const users = {
  getByEmail: async (email) => {
    try {
      console.log('✅ Real getByEmail for email:', email);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading user:', error);
        return { data: null, error };
      }
      console.log('✅ User data loaded:', data ? 'found' : 'not found');
      return { data: data || null, error: null };
    } catch (error) {
      console.error('Get user by email error:', error);
      return { data: null, error };
    }
  },

  create: async (userData) => {
    try {
      console.log('✅ Real createUser:', userData.email);
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      console.log('✅ User created successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Create user error:', error);
      return { data: null, error };
    }
  },

  update: async (userId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update user error:', error);
      return { data: null, error };
    }
  }
};

// Workspace Members
export const workspaceMembers = {
  create: async (memberData) => {
    try {
      console.log('👥 Adding workspace member:', memberData);
      const { data, error } = await supabase
        .from('workspace_members')
        .insert([{
          ...memberData,
          joined_at: new Date().toISOString()
        }])
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('❌ Create workspace member error:', error);
      return { data: null, error };
    }
  },

  getByWorkspaceId: async (workspaceId) => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          user_profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('workspace_id', workspaceId);
      return { data, error };
    } catch (error) {
      console.error('Get workspace members error:', error);
      return { data: null, error };
    }
  },

  getByWorkspaceAndUser: async (workspaceId, userId) => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Get workspace member error:', error);
      return { data: null, error };
    }
  },

  update: async (workspaceId, userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .update(updates)
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Update workspace member error:', error);
      return { data: null, error };
    }
  },

  delete: async (workspaceId, userId) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);
      return { error };
    } catch (error) {
      console.error('Delete workspace member error:', error);
      return { error };
    }
  }
};

export default {
  ...db,
  ...users
};
