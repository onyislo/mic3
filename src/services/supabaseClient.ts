import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create client with optimized options for larger file uploads
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Increase timeout for larger files
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        // 10 minute timeout instead of default 30s
        signal: AbortSignal.timeout(10 * 60 * 1000),
      });
    },
  },
});

// Import centralized types
import { 
  Course, 
  CourseContent, 
  CourseProgress, 
  Payment 
} from '../types/CourseTypes';

// Export the imported types for backward compatibility
export type { Course, CourseContent, CourseProgress };
export type CoursePayment = Payment;

// Local types still defined here
export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
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
