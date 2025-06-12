import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, supabase } from '../lib/supabase.js';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // In development mode, skip auth check and use mock data
        if (import.meta.env.VITE_APP_ENV === 'development') {
          console.log('🧪 Development mode - using mock auth data');
          const mockUser = {
            id: 'demo-user-123',
            email: 'demo@scholarai.eu',
            created_at: new Date().toISOString(),
            user_metadata: {
              full_name: 'Demo User',
              role: 'student'
            }
          };
          setUser(mockUser);

          const mockProfile = {
            id: mockUser.id,
            user_id: mockUser.id,
            email: mockUser.email,
            full_name: 'Demo User',
            display_name: 'Demo User',
            institution: 'Scholar AI University',
            research_field: 'Computer Science',
            role: 'student',
            subscription_tier: 'premium',
            subscription_status: 'active'
          };
          setProfile(mockProfile);
          setLoading(false);
          return;
        }

        const { user: currentUser } = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserProfile(currentUser.id);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err.message);
        // Don't set error in development mode, just continue with mock data
        if (import.meta.env.VITE_APP_ENV !== 'development') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🧪 Auth state change:', event, session?.user?.email);

        if (session?.user) {
          setUser(session.user);
          try {
            await loadUserProfile(session.user.id);
          } catch (profileError) {
            // Create mock profile for development
            if (import.meta.env.VITE_APP_ENV === 'development') {
              const mockProfile = {
                id: session.user.id,
                user_id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 'Test User',
                role: session.user.user_metadata?.role || 'student',
                subscription_tier: 'premium',
                subscription_status: 'active'
              };
              setProfile(mockProfile);
            }
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data: userProfile, error } = await db.getUserProfile(userId);
      
      // If profile doesn't exist (406 or 404 error), that's okay - it will be created on first sign-in
      if (error && error.code !== 'PGRST116' && error.code !== '406') {
        throw error;
      }
      
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      // Only set error for actual errors, not missing profiles
      if (err.code !== 'PGRST116' && err.code !== '406') {
        setError(err.message);
      }
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Pass user metadata in the options object
      const { data, error } = await auth.signUp(email, password, {
        data: {
          full_name: userData.fullName || '',
          role: userData.role || 'student',
          institution: userData.institution || '',
          department: userData.department || ''
        }
      });
      
      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;

      // Set user state immediately after successful login
      if (data?.user) {
        setUser(data.user);

        // Load or create user profile
        try {
          await loadUserProfile(data.user.id);
        } catch (profileError) {
          // If profile doesn't exist, create a mock one for development
          if (import.meta.env.VITE_APP_ENV === 'development') {
            const mockProfile = {
              id: data.user.id,
              user_id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || 'Test User',
              role: data.user.user_metadata?.role || 'student',
              institution: data.user.user_metadata?.institution || 'Test University',
              department: data.user.user_metadata?.department || 'Computer Science',
              subscription_tier: 'free',
              subscription_status: 'active'
            };
            setProfile(mockProfile);
          }
        }
      }

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const { data, error } = await auth.resetPassword(email);
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      // In development mode, just update local state
      if (import.meta.env.VITE_APP_ENV === 'development') {
        console.log('🧪 Development mode - updating profile locally');
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        return { data: updatedProfile, error: null };
      }

      // Update database profile
      if (user?.id) {
        const { data: profileData, error: profileError } = await db.updateUserProfile(user.id, updates);
        if (profileError) throw profileError;
        setProfile(profileData);
        return { data: profileData, error: null };
      }

      return { data: null, error: new Error('No user ID available') };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isResearcher: profile?.role === 'researcher',
    isStudent: profile?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

