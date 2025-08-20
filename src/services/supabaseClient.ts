import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

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
