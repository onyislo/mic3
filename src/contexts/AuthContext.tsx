import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, UserProfile } from '../services/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  purchasedCourses?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{success: boolean; message?: string}>;
  googleAuth: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active Supabase session on mount
    const initializeAuth = async () => {
      setLoading(true);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user profile info from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name || session.user.email?.split('@')[0] || '',
          purchasedCourses: profile?.purchased_courses || []
        };

        setToken(session.access_token);
        setUser(userData);

        // Save to localStorage as fallback
        localStorage.setItem(TOKEN_KEY, session.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        // Check for stored values as fallback (will be deprecated)
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }

      setLoading(false);
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // This will be handled by the initialization above
      } else if (event === 'SIGNED_OUT') {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    });

    initializeAuth();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        // Get user profile info from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.email?.split('@')[0] || '',
          purchasedCourses: profile?.purchased_courses || []
        };

        setToken(data.session.access_token);
        setUser(userData);

        // Save to localStorage as fallback
        localStorage.setItem(TOKEN_KEY, data.session.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Check if a profile with this email already exists
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking existing profile:', profileCheckError.message);
        throw profileCheckError;
      }

      if (existingProfiles) {
        return {
          success: false,
          message: 'This email is already registered. Please log in instead.'
        };
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        // If email already exists, return a friendly message
        if (error.message && error.message.toLowerCase().includes('user already registered')) {
          return {
            success: false,
            message: 'This email is already registered. Please log in instead.'
          };
        }
        throw error;
      }

      if (data.user) {
        // Create profile record in profiles table
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          name,
          email
        });

        if (profileError) {
          console.error('Error creating user profile:', profileError.message);
        }
      }

      // Return success - user will need to verify email if email confirmation is enabled
      return { 
        success: true, 
        message: "Please check your email to confirm your registration" 
      };
    } catch (error: any) {
      // If email already exists, return a friendly message
      if (error?.message && error.message.toLowerCase().includes('user already registered')) {
        return {
          success: false,
          message: 'This email is already registered. Please log in instead.'
        };
      }
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state listener will handle clearing the state
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback to local clearing if API call fails
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const googleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    googleAuth,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};