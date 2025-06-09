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
        const { user: currentUser } = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserProfile(currentUser.id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
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

      // Update auth profile
      const { data: authData, error: authError } = await auth.updateProfile(updates);
      if (authError) throw authError;

      // Update database profile
      if (user?.id) {
        const { data: profileData, error: profileError } = await db.updateUserProfile(user.id, updates);
        if (profileError) throw profileError;
        setProfile(profileData);
      }

      return { data: authData, error: null };
    } catch (err) {
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

