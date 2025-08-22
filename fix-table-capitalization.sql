-- Script to ensure table structure matches our application code

-- 1. Create the Courses table with proper column names if it doesn't exist
CREATE TABLE IF NOT EXISTS "Courses" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Course Title" TEXT NOT NULL,
  "Description" TEXT,
  "Instructor" TEXT,
  "Price" NUMERIC(10, 2) DEFAULT 0,
  duration TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  image_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Course_Content table with proper column names
CREATE TABLE IF NOT EXISTS "Course_Content" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES "Courses"(id) ON DELETE CASCADE,
  "Title" TEXT NOT NULL,
  "Content" TEXT,
  "Module" INTEGER,
  "Order" INTEGER,
  content_type TEXT DEFAULT 'text',
  media_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Course_Progress table
CREATE TABLE IF NOT EXISTS "Course_Progress" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES "Courses"(id) ON DELETE CASCADE,
  progress NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Payments table
CREATE TABLE IF NOT EXISTS "Payments" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES "Courses"(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Migration script to fix existing data if tables already exist with different names
-- Only uncomment and run if you need to migrate data from lowercase tables to proper case tables
/*
-- Migrate courses data
INSERT INTO "Courses" (id, "Course Title", "Description", "Instructor", "Price", duration, level, image_url, category, status, slug, created_at, updated_at)
SELECT id, title, description, instructor, price, duration, level, image_url, category, status, slug, created_at, updated_at
FROM courses
ON CONFLICT (id) DO NOTHING;

-- Migrate course content data
INSERT INTO "Course_Content" (id, course_id, "Title", "Content", "Module", "Order", content_type, media_url, duration, created_at, updated_at)
SELECT id, course_id, title, content, module_number, "order", content_type, media_url, duration, created_at, updated_at
FROM course_content
ON CONFLICT (id) DO NOTHING;

-- Migrate course progress data
INSERT INTO "Course_Progress" (id, user_id, course_id, progress, completed, last_accessed_at, created_at, updated_at)
SELECT id, user_id, course_id, progress, completed, last_accessed_at, created_at, updated_at
FROM course_progress
ON CONFLICT (id) DO NOTHING;

-- Migrate payments data
INSERT INTO "Payments" (id, user_id, course_id, amount, status, payment_method, transaction_id, created_at, updated_at)
SELECT id, user_id, course_id, amount, status, payment_method, transaction_id, created_at, updated_at
FROM payments
ON CONFLICT (id) DO NOTHING;
*/

-- 2. Copy data from old tables to new tables
INSERT INTO "Courses" SELECT * FROM courses;
INSERT INTO "Course_Progress" SELECT * FROM course_progress;
INSERT INTO "Course_Content" SELECT * FROM course_content;
INSERT INTO "Payments" SELECT * FROM payments;
INSERT INTO "Badges" SELECT * FROM badges;
INSERT INTO "User_Badges" SELECT * FROM user_badges;

-- 3. Add the missing columns to Courses table if they don't exist
ALTER TABLE "Courses" 
ADD COLUMN IF NOT EXISTS instructor TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS courses_slug_idx ON "Courses" (slug);

-- NOTE: This script assumes you have backed up your data before running it.
-- You may need to adjust foreign key references and recreate policies after running this script.
