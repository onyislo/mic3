import { createClient } from '@supabase/supabase-js';

// Try to get environment variables from different sources
// 1. Vite's import.meta.env (development)
// 2. Window.__env__ (could be set in index.html for production)
// 3. Hardcoded fallback values (last resort)

// Function to get environment variables from all possible sources
function getEnvVariable(key: string, fallback: string = ''): string {
  // Check if we have Vite's import.meta.env
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Check if we have window.__env__ (can be set in index.html)
  if (typeof window !== 'undefined' && 
      window.__env__ && 
      window.__env__[key]) {
    return window.__env__[key];
  }
  
  // Last resort: hardcoded values - same as in vercel.json/env
  const hardcodedValues: Record<string, string> = {
    'VITE_SUPABASE_URL': 'https://hucxgczibzdqpaiuvwrf.supabase.co',
    'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3hnY3ppYnpkcXBhaXV2d3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQ1NTQsImV4cCI6MjA3MTE5MDU1NH0.fJSyNAF7peA1mvcZyTJkDgljzmQSgiegVADBEOjkUlc'
  };
  
  if (hardcodedValues[key]) {
    console.log(`Using hardcoded value for ${key}`);
    return hardcodedValues[key];
  }
  
  return fallback;
}

// Get environment variables
const supabaseUrl = getEnvVariable('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVariable('VITE_SUPABASE_ANON_KEY');

// Validate keys
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Log for debugging (in development only)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase URL:', supabaseUrl.substring(0, 20) + '...');
  console.log('Supabase Key:', supabaseAnonKey.substring(0, 10) + '...');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
