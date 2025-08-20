# Supabase Database Setup Guide

This document provides step-by-step instructions for setting up your Supabase database for the MIC3 website.

## Step 1: Run the SQL Script

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor (in the left sidebar)
4. Create a new query
5. Copy and paste the entire script below
6. Run the script

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

## Step 2: Create Storage Buckets

1. In the Supabase dashboard, go to Storage (in the left sidebar)
2. Create the following buckets:
   - `course-images` (for course thumbnails)
   - `avatars` (for user profile pictures) 
   - `course-content` (for course videos and materials)

3. Set bucket policies by running this SQL:

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

## Step 3: Create an Admin User

After registering a regular user account, you'll need to add yourself as an admin:

1. First, find your user ID by running this SQL:

```sql
SELECT * FROM auth.users;
```

2. Note your user ID from the results (it will be a UUID)

3. Insert yourself as an admin:

```sql
INSERT INTO admins (user_id, name, role)
VALUES ('your-user-id-here', 'Your Name', 'super_admin');
```

For example:
```sql
INSERT INTO admins (user_id, name, role)
VALUES ('d4b8b6e0-1f2b-4c3d-a5e6-f7g8h9i0j1k2', 'John Doe', 'super_admin');
```

## Step 4: Add Sample Data (Optional)

If you want to add some initial data to test your application:

```sql
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

## What to Include in the Profiles Table

The `profiles` table is automatically populated when a user registers. Here's what each field means:

- `id`: A unique identifier for the profile (automatically generated)
- `user_id`: References the user's ID in the auth.users table (automatically populated)
- `name`: The user's display name
- `email`: The user's email address
- `avatar_url`: URL to the user's profile picture (can be stored in the avatars bucket)
- `purchased_courses`: An array of course IDs the user has purchased
- `created_at` and `updated_at`: Timestamps for when the profile was created/updated

You don't need to manually create profile entries. Your application should:

1. When a user registers, automatically create a profile entry using the code in your AuthContext.tsx
2. Allow users to update their profile information as needed

## Troubleshooting Common Issues

### Tables Already Exist
If you get an error saying tables already exist, you can modify the SQL to:

```sql
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS course_progress;
DROP TABLE IF EXISTS course_content;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS profiles;

-- Then continue with the CREATE TABLE statements
```

### Policy Already Exists
If policies already exist, add `IF NOT EXISTS` to the policy creation:

```sql
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);
```

### Authentication Issues
Make sure you've configured authentication settings in Supabase:
1. Go to Authentication → Settings
2. Configure Email Authentication
3. Add your site URL and redirect URLs for OAuth providers
