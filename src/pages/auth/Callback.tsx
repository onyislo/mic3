import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the callback URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data?.session) {
          throw new Error('No session found');
        }
        
        // Create or update user profile
        const userId = data.session.user.id;
        const userEmail = data.session.user.email;
        const userName = data.session.user.user_metadata?.full_name || 
                       data.session.user.user_metadata?.name || 
                       userEmail?.split('@')[0] || 'User';
                       
        console.log('Creating/updating user profile for', userId);
        
        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking for existing profile:', profileError);
        }
        
        if (!existingProfile) {
          // Create new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              name: userName,
              email: userEmail,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            console.log('Created new user profile');
          }
        } else {
          console.log('User profile already exists');
        }
        
        // Check if user is admin to decide redirect
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (adminData) {
          console.log('User is admin, redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.log('Regular user, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        setError('Authentication failed. Please try again.');
        
        // On error, redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-dark-light p-8 rounded-lg shadow-lg">
        {error ? (
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h2>
            <p className="text-text-light mb-4">{error}</p>
            <p className="text-text-muted text-sm">Redirecting to login page...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Authenticating...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="text-text-muted text-sm mt-4 text-center">Please wait while we complete your authentication.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
