# Supabase Setup Guide for MIC3 Website

This guide explains how to set up your Supabase project for the MIC3 website.

## Step 1: Create a Supabase Projectits 

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project and note down your project URL and anon public key
3. Add these credentials to your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_SITE_URL=https://your-production-domain.com
   ```
   Note: For local development, use `http://localhost:5173` as your `VITE_SITE_URL`.
   For production, use your actual domain name (e.g., `https://mic3solutiongroup.com`).

## Step 2: Set Up Authentication

1. In the Supabase dashboard, go to Authentication → Settings
2. Configure Email Authentication:
   - Enable "Email Signup"
   - Enable "Email Confirmations" if you want users to confirm their email
   - Under "URL Configuration":
     - Set Site URL to your production domain (e.g., `https://your-production-domain.com`)
     - Add Redirect URLs for password reset: `https://your-production-domain.com/update-password`
3. Configure OAuth Providers (Optional):
   - Set up Google OAuth provider
   - Add the redirect URL: `https://your-vercel-domain.com/auth/callback` or your local development URL `http://localhost:5173/auth/callback`

## Step 3: Create Database Tables

Run the following SQL in the Supabase SQL editor to create all necessary tables:

```sql
-- Create profiles table for user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  purchased_courses TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles access policy
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course content table
CREATE TABLE course_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'text', 'quiz', 'assignment')),
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course progress table
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES courses NOT NULL,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, course_id)
);

-- Create course progress policy
CREATE POLICY "Users can view their own course progress" 
ON course_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" 
ON course_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" 
ON course_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES courses NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment policies
CREATE POLICY "Users can view their own payments" 
ON payments FOR SELECT 
USING (auth.uid() = user_id);

-- Create badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  badge_id UUID REFERENCES badges NOT NULL,
  earned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, badge_id)
);

-- Create user badges policy
CREATE POLICY "Users can view their own badges" 
ON user_badges FOR SELECT 
USING (auth.uid() = user_id);
```

## Step 4: Set Up Storage for Course Images and Media

1. In the Supabase dashboard, go to Storage
2. Create the following buckets:
   - `course-images` (for course thumbnails)
   - `avatars` (for user profile pictures) 
   - `course-content` (for course videos and materials)

3. Set appropriate bucket policies:

```sql
-- Course images bucket policy (public read)
CREATE POLICY "Course images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-images');

-- Avatar bucket policy (authenticated users can select)
CREATE POLICY "Avatars are viewable by authenticated users"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Course content policy (enrolled users can access)
CREATE POLICY "Course content accessible by enrolled users"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-content' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE auth.uid() = profiles.user_id 
  AND profiles.purchased_courses @> ARRAY[(storage.foldername(name))[1]]
));
```

## Step 5: Add Sample Data (Optional)

```sql
-- Insert sample admin
INSERT INTO admins (user_id, name, role)
VALUES ('your-auth-user-id', 'Admin Name', 'super_admin');

-- Insert sample badges
INSERT INTO badges (name, description, image_url, category, level)
VALUES 
  ('Beginner Developer', 'Completed beginner programming course', 'https://example.com/badge1.png', 'programming', 'beginner'),
  ('Intermediate Designer', 'Completed intermediate design course', 'https://example.com/badge2.png', 'design', 'intermediate');

-- Insert sample courses
INSERT INTO courses (title, description, price, duration, level, image_url, category)
VALUES 
  ('Introduction to Web Development', 'Learn the basics of HTML, CSS and JavaScript', 99.99, '4 weeks', 'beginner', 'https://example.com/course1.jpg', 'programming'),
  ('Advanced UI/UX Design', 'Master modern design principles', 149.99, '6 weeks', 'intermediate', 'https://example.com/course2.jpg', 'design');
```

## Step 6: Set up Supabase Edge Functions (Optional)

If you need to implement custom server-side logic, such as payment processing or sending custom emails, you can use Supabase Edge Functions.

## User Flow Diagram

```
┌─────────┐     ┌─────────┐     ┌───────────────┐
│ Register │────▶│  Login  │────▶│ View Courses  │
└─────────┘     └─────────┘     └───────┬───────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │                                       │
              ┌─────▼─────┐                         ┌───────▼──────┐
              │ Enrollment│                         │ Course Access │
              └─────┬─────┘                         └───────┬──────┘
                    │                                       │
              ┌─────▼─────┐                         ┌───────▼──────┐
              │  Payment  │                         │Track Progress │
              └─────┬─────┘                         └───────┬──────┘
                    │                                       │
                    └───────────────────▶◀────────────────┘
                                        │
                                ┌───────▼───────┐
                                │ Earn Badges   │
                                └───────────────┘
```

## Admin Flow Diagram

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│ Admin Login │────▶│ Admin Console │────▶│ User Analytics│
└─────────────┘     └───────┬───────┘     └───────────────┘
                            │
          ┌────────────────┬────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌──────▼─────┐   ┌─────▼────────┐
    │Course Mgmt│   │Payment Logs│   │Progress Track│
    └───────────┘   └────────────┘   └──────────────┘
```
