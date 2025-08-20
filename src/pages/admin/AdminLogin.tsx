import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Info } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [envInfo, setEnvInfo] = useState('');
  const { login, authError } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Show environment info for debugging
    const isProduction = window.location.hostname.includes('vercel.app') || 
                      !window.location.hostname.includes('localhost');
    setEnvInfo(`Environment: ${isProduction ? 'Production' : 'Development'}`);
    
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-600/20 border-2 border-red-400">
            <Shield className="h-8 w-8 text-red-300" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-red-200">
            MIC3 Solution Group - Administrative Access
          </p>
          {envInfo && (
            <p className="mt-1 text-center text-xs text-red-300/70">
              {envInfo}
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-red-100 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-3 bg-red-800/30 border border-red-600/40 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  placeholder="Enter admin email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-red-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-3 bg-red-800/30 border border-red-600/40 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Access Admin Panel'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-xs text-red-300">
            Authorized personnel only. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};