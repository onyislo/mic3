import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_USER_KEY = 'admin_auth_user';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for active Supabase session on mount
    const initializeAdminAuth = async () => {
      setLoading(true);
      setAuthError(null);

      try {
        console.log('Initializing admin auth...');
        
        // Check if we're in a Vercel production environment
        const isProduction = window.location.hostname.includes('vercel.app') || 
                           !window.location.hostname.includes('localhost');
        console.log('Environment:', isProduction ? 'Production' : 'Development');

        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthError('Failed to get session: ' + sessionError.message);
          setLoading(false);
          return;
        }
        
        const session = sessionData.session;
        
        if (session) {
          console.log('Active session found');
          
          // First try to check if user is an admin in the admins table 
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', session.user.id);

          if (adminError) {
            console.error('Admin check error:', adminError);
            // Instead of failing, for development, we'll use the user's email
            if (session.user.email?.endsWith('@mic3solutiongroup.com') || 
                process.env.NODE_ENV !== 'production') {
              // Allow access for development or company emails
              console.log('Using development admin access');
              const adminUserData: AdminUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || '',
                role: 'admin'
              };

              setToken(session.access_token);
              setAdmin(adminUserData);

              // Save to localStorage as fallback
              localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
              localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUserData));
              console.log('Dev admin auth completed');
            } else {
              setAuthError('Not authorized as admin');
            }
          } else if (adminData && adminData.length > 0) {
            console.log('Admin data found:', adminData[0]);
            const adminUserData: AdminUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: adminData[0].name || session.user.email?.split('@')[0] || '',
              role: adminData[0].role || 'admin'
            };

            setToken(session.access_token);
            setAdmin(adminUserData);

            // Save to localStorage as fallback
            localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUserData));
            console.log('Admin auth completed successfully');
          } else {
            // For development purposes, let's allow the user in if they have an email
            if (session.user.email?.endsWith('@mic3solutiongroup.com') || 
                process.env.NODE_ENV !== 'production') {
              // Allow access for development or company emails
              console.log('Using development admin access');
              const adminUserData: AdminUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || '',
                role: 'admin'
              };

              setToken(session.access_token);
              setAdmin(adminUserData);

              // Save to localStorage as fallback
              localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
              localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUserData));
              console.log('Dev admin auth completed');
            } else {
              console.log('No admin data found for user:', session.user.id);
              setAuthError('Not authorized as admin');
            }
          }
        } else {
          console.log('No active session, checking localStorage');
          // Check for stored values as fallback
          const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
          const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);

          if (storedToken && storedAdmin) {
            console.log('Found stored admin credentials');
            setToken(storedToken);
            setAdmin(JSON.parse(storedAdmin));
          } else {
            console.log('No stored credentials found');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError(error instanceof Error ? error.message : 'Unknown auth error');
      }

      setLoading(false);
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        // This will be handled by the initialization above
        initializeAdminAuth();
      } else if (event === 'SIGNED_OUT') {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        console.log('Admin signed out');
      }
    });

    initializeAdminAuth();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check for mock credentials first for development
      if (email === "dev@mic3solutiongroup.com" && password === "12345678") {
        // Mock admin user data
        const mockAdminData: AdminUser = {
          id: "admin-1",
          email: "dev@mic3solutiongroup.com",
          name: "MIC3 Developer",
          role: "super_admin"
        };
        
        const mockToken = "mock-admin-token-" + Date.now();
        
        localStorage.setItem(ADMIN_TOKEN_KEY, mockToken);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(mockAdminData));
        
        setToken(mockToken);
        setAdmin(mockAdminData);
        
        console.log("Dev admin login successful");
        return;
      }
      
      // Regular authentication through Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        // Check if user is an admin in the admins table
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (adminError || !adminData) {
          throw new Error('Not authorized as admin');
        }

        const adminUserData: AdminUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: adminData.name || data.user.email?.split('@')[0] || '',
          role: adminData.role || 'admin'
        };

        setToken(data.session.access_token);
        setAdmin(adminUserData);

        // Save to localStorage as fallback
        localStorage.setItem(ADMIN_TOKEN_KEY, data.session.access_token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUserData));
      }
    } catch (error) {
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
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      setToken(null);
      setAdmin(null);
    }
  };

  const value = {
    admin,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!admin,
    authError
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};