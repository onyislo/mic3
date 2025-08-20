-- Run this SQL script in your Supabase SQL Editor

-- First, check if the admins table exists
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replace 'your-user-id' with the actual user ID from auth.users
-- You can find your user ID by running: SELECT * FROM auth.users;
INSERT INTO admins (user_id, name, role)
VALUES ('your-user-id', 'Admin User', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

-- Make sure to give admins table appropriate RLS policies
CREATE POLICY IF NOT EXISTS "Admin users can view their own info" 
ON admins FOR SELECT 
USING (auth.uid() = user_id);
