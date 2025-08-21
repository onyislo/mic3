import { createClient } from '@supabase/supabase-js';

// Enhanced Environment Variable handling with detailed logging
const getEnvVar = (key: string): string => {
  // Get environment variables with enhanced logging
  console.log(`[Supabase] Checking for ${key} in environment variables...`);
  
  // For debugging - check what's available in import.meta.env (don't log sensitive values)
  const availableKeys = Object.keys(import.meta.env).filter(k => 
    !k.includes('KEY') && !k.includes('TOKEN') && !k.includes('SECRET')
  );
  console.log(`[Supabase] Available env keys: ${availableKeys.join(', ')}`);
  
  // Check if we're in production
  const isProduction = window.location.hostname.includes('vercel.app') || 
                       !window.location.hostname.includes('localhost');
  console.log(`[Supabase] Environment: ${isProduction ? 'Production' : 'Development'}`);
  
  // First try import.meta.env (Vite's standard way)
  if (import.meta.env[key]) {
    console.log(`[Supabase] ✅ Found ${key} in import.meta.env`);
    return import.meta.env[key];
  }
  
  // Fallback options for production
  if (isProduction) {
    // Log the issue but don't expose values
    console.error(`[Supabase] ❌ Missing ${key} in import.meta.env`);
    console.error(`[Supabase] This might be due to Vercel environment variables not being properly injected.`);
    console.error(`[Supabase] Please ensure ${key} is set in your Vercel project settings`);
    
    // Emergency fallback for demo purposes only - REMOVE IN PRODUCTION
    if (key === 'VITE_SUPABASE_URL' && !import.meta.env[key]) {
      return 'https://REPLACE-WITH-YOUR-SUPABASE-URL.supabase.co'; 
    }
    
    if (key === 'VITE_SUPABASE_ANON_KEY' && !import.meta.env[key]) {
      return 'REPLACE-WITH-YOUR-ANON-KEY';
    }
  }
  
  return '';
};

// Get the values with enhanced logging
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Validate the values
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('REPLACE') || supabaseAnonKey.includes('REPLACE')) {
  console.error('[Supabase] ⛔ Invalid Supabase configuration');
  console.error('[Supabase] Please check your Vercel project settings and make sure the required environment variables are set.');
  console.error('[Supabase] To set environment variables in Vercel:');
  console.error('[Supabase] 1. Go to https://vercel.com/[your-username]/[project-name]/settings/environment-variables');
  console.error('[Supabase] 2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('[Supabase] 3. Redeploy your application');
} else {
  console.log('[Supabase] ✅ Valid Supabase configuration found');
}

// Create the Supabase client
let supabase;
try {
  // Create the client with available values
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('[Supabase] ✅ Client created successfully');
} catch (error) {
  console.error('[Supabase] ❌ Failed to create Supabase client:', error);
  throw new Error('Could not initialize Supabase client. Check console for details.');
}

// Export the client
export { supabase };

export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
};

export type CourseProgress = {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  last_accessed: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type CoursePayment = {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_date: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_date: string;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
};
