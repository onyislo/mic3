-- This SQL file focuses on fixing the "order" column issue

-- Check current table structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'course_content'
ORDER BY ordinal_position;

-- Fix the 'order' column if it doesn't exist
DO $$
BEGIN
    -- Check if column exists (with any case)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'course_content'
        AND column_name = 'order'
    ) THEN
        -- Add the order column if it doesn't exist
        ALTER TABLE public.course_content ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'course-content';

-- Create the bucket if it doesn't exist (note the hyphen in the name)
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
SELECT 'course-content', 'course-content', true, false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'course-content');

-- Set permissive policy for course-content bucket
DROP POLICY IF EXISTS "Allow authenticated uploads course-content" ON storage.objects;
CREATE POLICY "Allow authenticated uploads course-content" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'course-content');

DROP POLICY IF EXISTS "Allow public viewing course-content" ON storage.objects;
CREATE POLICY "Allow public viewing course-content" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'course-content');

-- Show a summary of our setup
SELECT 
    'Table: ' || table_name || ', Column: ' || column_name || ', Type: ' || data_type AS database_info
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'course_content'
UNION ALL
SELECT 
    'Storage: ' || name || ', Public: ' || public::text AS storage_info
FROM 
    storage.buckets
WHERE
    name = 'course-content';
