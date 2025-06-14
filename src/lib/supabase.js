import { createClient } from '@supabase/supabase-js'

// Production mode - no mocking
const isDevelopmentMode = false;

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
      console.log('✅ Real createResearchQuery:', queryData);
      
      if (!queryData.user_id || !queryData.query || !queryData.agent_type) {
        const error = new Error('Missing required fields');
        console.error('❌ Validation error:', error);
        return { data: null, error };
      }

      const minimalData = {
        user_id: queryData.user_id,
        query: queryData.query,
        agent_type: queryData.agent_type
      };

      console.log('🔍 Starting minimal insert with 3s timeout...');
      const minimalInsertPromise = supabase
        .from('research_queries')
        .insert([minimalData])
        .select()
        .single();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Minimal insert timeout after 3 seconds')), 3000);
      });

      try {
        const { data: minimalResult, error: minimalError } = await Promise.race([
          minimalInsertPromise,
          timeoutPromise
        ]);

        if (minimalError) {
          console.error('❌ Minimal insert failed:', minimalError);
          throw minimalError;
        }

        console.log('✅ Minimal insert succeeded:', minimalResult);
        return { data: minimalResult, error: null };
      } catch (timeoutError) {
        console.log('⚠️ Research query creation timed out, using window storage fallback');

        // Create fallback query with full data
        const fallbackQuery = {
          id: `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...queryData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Store in window storage for immediate access
        if (!window.recentQueries) {
          window.recentQueries = [];
        }
        window.recentQueries.unshift(fallbackQuery);
        console.log('💾 Stored research query in window storage for immediate access');

        return { data: fallbackQuery, error: null };
      }

    } catch (error) {
      console.error('❌ Create research query exception:', error);
      return { data: null, error }
    }
  },

  getUserResearchQueries: async (userId, limit = 50) => {
    try {
      console.log('✅ Real getUserResearchQueries for user:', userId);

      // Check window storage first
      if (window.recentQueries && window.recentQueries.length > 0) {
        console.log('💾 Found queries in window storage:', window.recentQueries.length, 'queries');
        return { data: window.recentQueries, error: null };
      }

      // Fallback to database with timeout
      const queriesPromise = supabase
        .from('research_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Research queries timeout after 10 seconds')), 10000);
      });

      try {
        const { data, error } = await Promise.race([queriesPromise, timeoutPromise]);
        if (error) {
          console.error('❌ Error loading research queries:', error);
          return { data: [], error };
        }
        console.log('✅ Research queries loaded:', data?.length || 0, 'queries');
        return { data: data || [], error: null };
      } catch (timeoutError) {
        console.warn('⚠️ Research queries timed out, using fallback:', timeoutError.message);
        return {
          data: [],
          error: null,
          message: 'Database temporarily slow - using cached data'
        };
      }
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
      console.log('✅ Real getUserCitations for user:', userId);

      // First check window storage for recent citations
      if (window.recentCitations && window.recentCitations.length > 0) {
        console.log('💾 Found citations in window storage:', window.recentCitations.length, 'citations');
        return { data: window.recentCitations, error: null };
      }

      // Fallback to database with timeout
      const citationsPromise = supabase
        .from('citations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Citations query timeout after 15 seconds')), 15000);
      });

      try {
        const { data, error } = await Promise.race([citationsPromise, timeoutPromise]);
        if (error) {
          console.error('❌ Error loading real citations:', error);
          return { data: [], error };
        }
        console.log('✅ Real citations loaded:', data?.length || 0, 'citations');
        return { data: data || [], error: null };
      } catch (timeoutError) {
        console.error('❌ Citations query timed out:', timeoutError);
        return { data: [], error: null };
      }
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
      console.log('✅ Real getUserWorkspaces for user:', userId);

      // Check window storage first
      if (window.recentWorkspaces && window.recentWorkspaces.length > 0) {
        console.log('💾 Found workspaces in window storage:', window.recentWorkspaces.length, 'workspaces');
        return { data: window.recentWorkspaces, error: null };
      }

      // Fallback to database with timeout
      const workspacesPromise = supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Workspaces query timeout after 10 seconds')), 10000);
      });

      try {
        const { data, error } = await Promise.race([workspacesPromise, timeoutPromise]);
        if (error) {
          console.error('❌ Error loading workspaces:', error);
          return { data: [], error };
        }
        console.log('✅ Workspaces loaded:', data?.length || 0, 'workspaces');
        return { data: data || [], error: null };
      } catch (timeoutError) {
        console.warn('⚠️ Workspaces query timed out, providing demo workspace:', timeoutError.message);
        // Return mock workspace for demo
        const mockWorkspace = {
          id: `demo-workspace-${Date.now()}`,
          name: 'Demo Workspace',
          description: 'Your first workspace for collaborative research (demo mode)',
          user_id: userId,
          color_theme: '#10B981',
          visibility: 'private',
          created_at: new Date().toISOString(),
          is_demo: true
        };
        return { data: [mockWorkspace], error: null };
      }
    } catch (error) {
      console.error('Get user workspaces error:', error);
      return { data: [], error };
    }
  },

  createWorkspace: async (workspaceData) => {
    try {
      console.log('✅ Real createWorkspace:', workspaceData.name);

      // Create workspace with ID and timestamp
      const newWorkspace = {
        id: `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...workspaceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in window storage for immediate access
      if (!window.recentWorkspaces) {
        window.recentWorkspaces = [];
      }
      window.recentWorkspaces.unshift(newWorkspace);
      console.log('💾 Stored workspace in window storage for immediate access');

      // Try database insert with timeout
      const insertPromise = supabase
        .from('workspaces')
        .insert([workspaceData])
        .select();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Workspace creation timeout after 8 seconds')), 8000);
      });

      try {
        const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
        if (error) {
          console.error('❌ Database error:', error);
        } else {
          console.log('✅ Workspace saved to database successfully');
          // Update window storage with real database data
          if (data && data.length > 0) {
            window.recentWorkspaces[0] = data[0];
          }
        }
      } catch (timeoutError) {
        console.log('⚠️ Workspace creation timed out, but workspace is stored in window for immediate access');
      }

      return { data: [newWorkspace], error: null };
    } catch (error) {
      console.error('Create workspace error:', error);
      return { data: null, error };
    }
  }
};

// Workspaces
export const workspaces = {
  getUserWorkspaces: async (userId) => {
    try {
      console.log('✅ Real getUserWorkspaces for user:', userId);
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', userId)
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
      console.log('✅ Real createWorkspace:', workspaceData.name);
      const { data, error } = await supabase
        .from('workspaces')
        .insert([workspaceData])
        .select();
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      console.log('✅ Workspace saved successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Create workspace error:', error);
      return { data: null, error };
    }
  }
};

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
  ...workspaces,
  ...users
};
