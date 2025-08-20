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
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_USER_KEY = 'admin_auth_user';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active Supabase session on mount
    const initializeAdminAuth = async () => {
      setLoading(true);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if user is an admin in the admins table
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (adminData) {
          const adminUserData: AdminUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: adminData.name || session.user.email?.split('@')[0] || '',
            role: adminData.role || 'admin'
          };

          setToken(session.access_token);
          setAdmin(adminUserData);

          // Save to localStorage as fallback
          localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUserData));
        }
      } else {
        // Check for stored values as fallback
        const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
        const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);

        if (storedToken && storedAdmin) {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));
        }
      }

      setLoading(false);
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // This will be handled by the initialization above
        initializeAdminAuth();
      } else if (event === 'SIGNED_OUT') {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
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