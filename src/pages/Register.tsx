import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="20" height="20">
    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
  </svg>
);

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);
      // Only navigate and show verification message after successful registration
      if (result?.success) {
        // At this point, the backend would have sent a verification email
        navigate('/login', { 
          state: { 
            verificationEmail: true,
            email: email 
          } 
        });
      }
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-text-light">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full px-3 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Create a password"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-text-muted">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary-dark transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary-dark transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            
            <div className="flex items-center justify-between">
              <hr className="w-full border-gray-600" />
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <hr className="w-full border-gray-600" />
            </div>
            
            <button
              type="button"
              onClick={() => alert('Google registration will be integrated with backend')}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 font-medium hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <GoogleIcon />
              <span className="ml-2">Sign up with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};