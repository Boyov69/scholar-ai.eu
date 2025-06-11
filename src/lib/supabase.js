import { createClient } from '@supabase/supabase-js'

// Check if we're in development mode with mocking enabled
const isDevelopmentMode = import.meta.env.VITE_APP_ENV === 'development' &&
                         import.meta.env.VITE_MOCK_PAYMENTS === 'true';

// Production Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xicjnnzzykdhbmrpafhs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Get the correct base URL for redirects
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, use current origin
    return window.location.origin;
  }
  // Fallback for SSR
  return import.meta.env.VITE_APP_URL || 'https://www.scholarai.eu';
};

// Create mock Supabase client for development
const createMockSupabaseClient = () => {
  console.log('🧪 Using Mock Supabase Client for Development');

  return {
    auth: {
      signUp: async ({ email, password, options }) => {
        console.log('🧪 Mock SignUp:', { email, password });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: email,
          user_metadata: options?.data || { full_name: 'Test User' },
          created_at: new Date().toISOString()
        };

        return {
          data: {
            user: mockUser,
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              user: mockUser
            }
          },
          error: null
        };
      },

      signInWithPassword: async ({ email, password }) => {
        console.log('🧪 Mock SignIn:', { email, password });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Import mock users dynamically
        const { getMockUser } = await import('./mockUsers.js');
        const mockUserData = getMockUser(email);

        const mockUser = mockUserData || {
          id: 'mock-user-' + Date.now(),
          email: email,
          user_metadata: {
            full_name: email.includes('admin') ? 'Admin User' :
                      email.includes('professor') ? 'Prof. Test User' :
                      email.includes('researcher') ? 'Dr. Test Researcher' : 'Test Student'
          }
        };

        return {
          data: {
            user: mockUser,
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              user: mockUser
            }
          },
          error: null
        };
      },

      signOut: async () => {
        console.log('🧪 Mock SignOut');
        return { error: null };
      },

      getSession: async () => {
        return { data: { session: null }, error: null };
      },

      getUser: async () => {
        return { data: { user: null }, error: null };
      },

      onAuthStateChange: (callback) => {
        console.log('🧪 Mock Auth State Change Listener');
        return { data: { subscription: { unsubscribe: () => {} } } };
      },

      resetPasswordForEmail: async (email) => {
        console.log('🧪 Mock Reset Password:', email);
        return { data: {}, error: null };
      }
    },

    from: (table) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          limit: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null })
        }),
        limit: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null })
      }),
      insert: async (data) => {
        console.log(`🧪 Mock DB Insert into ${table}:`, data);
        return { data: Array.isArray(data) ? data : [data], error: null };
      },
      update: async (data) => {
        console.log(`🧪 Mock DB Update in ${table}:`, data);
        return { data: data, error: null };
      },
      delete: async () => {
        console.log(`🧪 Mock DB Delete from ${table}`);
        return { error: null };
      }
    }),

    channel: () => ({
      on: () => ({ subscribe: () => {} })
    })
  };
};

// Create Supabase client with security options or mock client
export const supabase = isDevelopmentMode ?
  createMockSupabaseClient() :
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'scholar-ai-web'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });

// Authentication helpers
export const auth = {
  signUp: async (email, password, options = {}) => {
    try {
      if (isDevelopmentMode) {
        console.log('🧪 Mock Auth SignUp');
        return await supabase.auth.signUp({
          email,
          password,
          options: {
            data: options,
            emailRedirectTo: `${getBaseUrl()}/auth/callback`
          }
        });
      }

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
      if (isDevelopmentMode) {
        console.log('🧪 Mock Auth SignIn');
        return await supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { data: null, error }
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Update user profile error:', error)
      return { data: null, error }
    }
  },

  // Research queries with RLS
  createResearchQuery: async (queryData) => {
    try {
      const { data, error } = await supabase
        .from('research_queries')
        .insert([queryData])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Create research query error:', error)
      return { data: null, error }
    }
  },

  getUserResearchQueries: async (userId, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('research_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      return { data, error }
    } catch (error) {
      console.error('Get user research queries error:', error)
      return { data: null, error }
    }
  },

  updateResearchQuery: async (queryId, updates) => {
    try {
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
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      return { data, error }
    } catch (error) {
      console.error('Get user citations error:', error)
      return { data: null, error }
    }
  },

  // Workspaces with RLS
  getUserWorkspaces: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner(
            role,
            user_id
          )
        `)
        .eq('workspace_members.user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Get user workspaces error:', error)
      return { data: null, error }
    }
  },

  createWorkspace: async (workspaceData) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert([workspaceData])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Create workspace error:', error)
      return { data: null, error }
    }
  },

  getWorkspaceById: async (workspaceId) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single()
      return { data, error }
    } catch (error) {
      console.error('Get workspace by id error:', error)
      return { data: null, error }
    }
  }
}

// Workspace members management
export const workspaceMembers = {
  create: async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .insert([memberData])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Create workspace member error:', error)
      return { data: null, error }
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
        .eq('workspace_id', workspaceId)
      return { data, error }
    } catch (error) {
      console.error('Get workspace members error:', error)
      return { data: null, error }
    }
  },

  getByWorkspaceAndUser: async (workspaceId, userId) => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .single()
      return { data, error }
    } catch (error) {
      console.error('Get workspace member error:', error)
      return { data: null, error }
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
        .single()
      return { data, error }
    } catch (error) {
      console.error('Update workspace member error:', error)
      return { data: null, error }
    }
  },

  delete: async (workspaceId, userId) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
      return { error }
    } catch (error) {
      console.error('Delete workspace member error:', error)
      return { error }
    }
  }
}

// User management
export const users = {
  getByEmail: async (email) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()
      return { data, error }
    } catch (error) {
      console.error('Get user by email error:', error)
      return { data: null, error }
    }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToWorkspace: (workspaceId, callback) => {
    return supabase
      .channel(`workspace:${workspaceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workspace_activities',
        filter: `workspace_id=eq.${workspaceId}`
      }, callback)
      .subscribe()
  },

  subscribeToUserNotifications: (userId, callback) => {
    return supabase
      .channel(`user:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}

export default supabase

