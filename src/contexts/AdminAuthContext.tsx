import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
    // Load admin auth state from localStorage on mount
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check for mock credentials first
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
      
      // If not mock credentials, proceed with API authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Admin login failed');
      }

      const data = await response.json();
      const { token: authToken, admin: adminData } = data;

      localStorage.setItem(ADMIN_TOKEN_KEY, authToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
      
      setToken(authToken);
      setAdmin(adminData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setToken(null);
    setAdmin(null);
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