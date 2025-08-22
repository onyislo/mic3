import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const navigate = useNavigate();

  // Check if we're in a recovery flow
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setMessage({
        type: 'error',
        text: 'Invalid password reset link. Please request a new password reset.'
      });
    }
  }, []);

  // Password strength checker
  useEffect(() => {
    const checkPasswordRequirements = () => {
      const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };
      
      setPasswordRequirements(requirements);
      
      // Calculate strength score
      const score = Object.values(requirements).filter(Boolean).length;
      setPasswordStrength(score);
    };
    
    checkPasswordRequirements();
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match.'
      });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setMessage({
        type: 'error',
        text: 'Password is too weak. Please make it stronger.'
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Your password has been successfully updated!'
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Update password error:', err);
      setMessage({
        type: 'error',
        text: 'An error occurred while updating your password. Please try again.'
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
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-text-light">
            Update your password
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Enter a new secure password for your account.
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
          
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                New Password
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
                  placeholder="Enter new password"
                />
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-text-muted">Password strength:</span>
                    <span className="text-xs font-medium">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                      {passwordStrength === 5 && "Very strong"}
                    </span>
                  </div>
                  <div className="w-full bg-bg-dark-light rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        passwordStrength < 2 ? 'bg-red-500' : 
                        passwordStrength < 4 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className={`text-xs flex items-center ${passwordRequirements.length ? 'text-green-400' : 'text-text-muted'}`}>
                      {passwordRequirements.length ? <Check className="h-3 w-3 mr-1" /> : '•'} At least 8 characters
                    </div>
                    <div className={`text-xs flex items-center ${passwordRequirements.uppercase ? 'text-green-400' : 'text-text-muted'}`}>
                      {passwordRequirements.uppercase ? <Check className="h-3 w-3 mr-1" /> : '•'} Uppercase letter
                    </div>
                    <div className={`text-xs flex items-center ${passwordRequirements.lowercase ? 'text-green-400' : 'text-text-muted'}`}>
                      {passwordRequirements.lowercase ? <Check className="h-3 w-3 mr-1" /> : '•'} Lowercase letter
                    </div>
                    <div className={`text-xs flex items-center ${passwordRequirements.number ? 'text-green-400' : 'text-text-muted'}`}>
                      {passwordRequirements.number ? <Check className="h-3 w-3 mr-1" /> : '•'} Number
                    </div>
                    <div className={`text-xs flex items-center ${passwordRequirements.special ? 'text-green-400' : 'text-text-muted'}`}>
                      {passwordRequirements.special ? <Check className="h-3 w-3 mr-1" /> : '•'} Special character
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light mb-2">
                Confirm Password
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
                  placeholder="Confirm new password"
                />
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || password !== confirmPassword || passwordStrength < 3}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update password'}
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

export default UpdatePassword;
