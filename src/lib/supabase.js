import { createClient } from '@supabase/supabase-js'

// Check if we're in development mode with mocking enabled
const isDevelopmentMode = import.meta.env.VITE_APP_ENV === 'development' &&
                         import.meta.env.VITE_MOCK_PAYMENTS === 'true';

// Get the correct base URL for redirects
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, use current origin
    return window.location.origin;
  }
  // Fallback for SSR
  return import.meta.env.VITE_APP_URL || 'https://www.scholarai.eu';
};

// Supabase configuratie - FORCE CLOUD INSTANCE
const supabaseUrl = 'https://xicjnnzzykdhbmrpafhs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg0MjksImV4cCI6MjA2NDk1NDQyOX0.4N0ZKvuaCpDqWmmtgK_j-Ra4BkUQrVQXot2B8Gzs9kI'

// Controleer of keys correct zijn geladen
console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key geladen:', supabaseAnonKey ? 'Ja (eerste 10 tekens: ' + supabaseAnonKey.substring(0, 10) + '...)' : 'Nee');

// Test Supabase connection (only in development)
const testConnection = async () => {
  if (isDevelopmentMode) {
    try {
      console.log('🧪 Testing Supabase connection...');
      // Test with a simple health check instead of querying tables
      const { data, error } = await supabase.auth.getSession();
      if (error && error.message !== 'No session found') {
        console.log('⚠️ Supabase auth test failed:', error.message);
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (err) {
      console.log('🔍 Supabase connection error details:', err);
    }
  }
};

// Test connection after a short delay (only in dev)
if (isDevelopmentMode) {
  setTimeout(testConnection, 1000);
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
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
      console.log('🔐 Attempting sign in for:', email);
      console.log('🌐 Using Supabase URL:', supabaseUrl);

      if (isDevelopmentMode) {
        console.log('🧪 Development Mode - Using Mock Auth');
        return {
          data: {
            user: {
              id: '12345678-1234-1234-1234-123456789012', // Valid UUID format
              email: email,
              email_confirmed_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              user: {
                id: '12345678-1234-1234-1234-123456789012', // Valid UUID format
                email: email
              }
            }
          },
          error: null
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🚨 Sign in error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.status,
          details: error
        });
      } else {
        console.log('✅ Sign in successful:', data?.user?.email);
      }

      return { data, error }
    } catch (error) {
      console.error('🔥 Sign in exception:', error);
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
      // Check if we're in development mode and return mock data
      if (isDevelopmentMode) {
        console.log('🧪 Mock Research Queries Data');
        return {
          data: [
            {
              id: 'mock-1',
              user_id: userId,
              title: 'AI in Academic Research',
              question: 'How can artificial intelligence be effectively integrated into academic research workflows to enhance productivity and discovery?',
              query: 'AI academic research integration productivity',
              results: 'Mock results showing various AI tools and methodologies for research enhancement',
              status: 'completed',
              created_at: new Date().toISOString()
            },
            {
              id: 'mock-2',
              user_id: userId,
              title: 'Climate Change Impact Studies',
              question: 'What are the latest findings on climate change impacts on European ecosystems?',
              query: 'climate change Europe ecosystems impact',
              results: 'Mock results with recent climate studies and ecosystem data',
              status: 'completed',
              created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            }
          ],
          error: null
        };
      }

      const { data, error } = await supabase
        .from('research_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error }
    } catch (error) {
      console.error('Get user research queries error:', error)
      return { data: [], error }
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
      // Check if we're in development mode and return mock data
      if (isDevelopmentMode) {
        console.log('🧪 Mock Citations Data');
        return {
          data: [
            {
              id: 'mock-citation-1',
              user_id: userId,
              title: 'Artificial Intelligence in Academic Research: A Comprehensive Review',
              authors: 'Smith, J., Johnson, M., & Williams, K.',
              journal: 'Journal of Academic Technology',
              year: 2024,
              doi: '10.1000/mock.citation.1',
              url: 'https://example.com/paper1',
              abstract: 'This paper provides a comprehensive review of AI applications in academic research...',
              created_at: new Date().toISOString()
            },
            {
              id: 'mock-citation-2',
              user_id: userId,
              title: 'Climate Change Impacts on European Biodiversity',
              authors: 'Anderson, L., Brown, P., & Davis, R.',
              journal: 'European Environmental Science',
              year: 2023,
              doi: '10.1000/mock.citation.2',
              url: 'https://example.com/paper2',
              abstract: 'An analysis of climate change effects on biodiversity across European ecosystems...',
              created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ],
          error: null
        };
      }

      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error }
    } catch (error) {
      console.error('Get user citations error:', error)
      return { data: [], error }
    }
  },

  // Workspaces with RLS
  getUserWorkspaces: async (userId) => {
    try {
      // Check if we're in development mode and return mock data
      if (isDevelopmentMode) {
        console.log('🧪 Mock Workspaces Data');
        return {
          data: [
            {
              id: 'mock-workspace-1',
              name: 'AI Research Lab',
              description: 'Collaborative workspace for artificial intelligence research projects',
              user_id: userId,
              member_count: 5,
              project_count: 12,
              created_at: new Date().toISOString()
            },
            {
              id: 'mock-workspace-2',
              name: 'Climate Studies Group',
              description: 'Environmental research and climate change impact studies',
              user_id: userId,
              member_count: 8,
              project_count: 6,
              created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
            }
          ],
          error: null
        };
      }

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
      return { data: [], error }
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


