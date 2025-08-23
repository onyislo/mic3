export interface Course {
  id: string;
  ["Course Title"]: string;
  ["Description"]?: string | null;
  ["Instructor"]?: string | null;
  ["Price"]?: number;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  ["Course Image"]?: string | null;
  category?: string;
  status?: 'active' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface CourseContent {
  id: string;
  course_id: string;
  "Title": string;
  "Content"?: string | null;
  "Module"?: number;
  "Order"?: number;
  content_type?: string;
  media_url?: string;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress?: number;
  completed?: boolean;
  last_accessed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'admin_enrolled';
  payment_method?: string;
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
}
