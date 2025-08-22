import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Use your production URL instead of window.location.origin
      // This ensures the reset link works in all environments
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/update-password`,
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email address. Please check your inbox.'
      });
    } catch (err) {
      console.error('Reset password error:', err);
      setMessage({
        type: 'error',
        text: 'An error occurred while sending the password reset email. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-text-light">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`${
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            } px-4 py-3 rounded-lg border`}>
              {message.text}
            </div>
          )}
          
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

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send reset instructions'}
            </button>
            
            <div className="mt-4 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
