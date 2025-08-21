import { createClient } from '@supabase/supabase-js';

// Get environment variables - ONLY use import.meta.env (Vite will replace these at build time)
const getEnvVar = (key: string): string => {
  // Get from import.meta.env
  if (import.meta.env[key]) {
    // Don't log the actual values to prevent leaking them in logs
    console.log(`Found ${key} in environment variables`);
    return import.meta.env[key];
  }
  
  // If not found, log an error
  console.error(`Missing ${key} environment variable`);
  console.error(`Please make sure ${key} is set in Vercel environment variables`);
  
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please check your Vercel project settings and make sure the required environment variables are set.');
} else {
  // Don't log actual values for security
  console.log('Supabase environment variables found');
}

// Create the Supabase client
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  throw new Error('Could not initialize Supabase client');
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
