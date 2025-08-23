-- Check existing tables and fix inconsistencies
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, column_name;

-- Create course_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.course_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    media_url TEXT,
    module INTEGER DEFAULT 0,
    section_title TEXT,
    order INTEGER DEFAULT 0,
    file_size BIGINT,
    duration INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT content_type_check CHECK (content_type IN ('video', 'pdf', 'text'))
);

-- Rename Course_Content table to course_content if it exists and course_content doesn't
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Course_Content') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_content') THEN
        ALTER TABLE "Course_Content" RENAME TO course_content;
    END IF;
END
$$;

-- Check if column casing needs to be fixed
DO $$
DECLARE
    col_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_content' AND column_name = 'Title'
    ) INTO col_exists;
    
    IF col_exists THEN
        ALTER TABLE course_content RENAME COLUMN "Title" TO title;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_content' AND column_name = 'Module'
    ) INTO col_exists;
    
    IF col_exists THEN
        ALTER TABLE course_content RENAME COLUMN "Module" TO module;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_content' AND column_name = 'Order'
    ) INTO col_exists;
    
    IF col_exists THEN
        ALTER TABLE course_content RENAME COLUMN "Order" TO "order";
    END IF;
END
$$;

-- Add a demo row for testing
INSERT INTO course_content (
    id, course_id, title, content_type, media_url, module, 
    section_title, "order", file_size, duration, is_published
)
SELECT 
    '12345678-1234-1234-1234-123456789012', 
    id,  -- First course id
    'Demo Content Item', 
    'text', 
    NULL, 
    0, 
    'Demo Section', 
    0, 
    NULL, 
    NULL, 
    TRUE
FROM courses 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add the current user as an admin
INSERT INTO admins (user_id, name, email, role)
SELECT 
    id, 
    email, 
    email, 
    'admin'
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (user_id) DO NOTHING;

-- Drop existing storage policies and create new ones for course-content
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
CREATE POLICY "Allow public viewing" 
ON storage.objects FOR SELECT 
TO public 
USING (true);

-- View final table structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'course_content'
ORDER BY ordinal_position;
