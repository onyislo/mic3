-- First, check if the bucket exists and create it if it doesn't
SELECT * FROM storage.buckets WHERE name = 'course-content';
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
SELECT 'course-content', 'course-content', false, false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'course-content');

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;

-- Create permissive policies for testing
-- 1. Allow authenticated users to upload anything
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 2. Allow authenticated users to update their own objects
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (auth.uid() = owner);

-- 3. Allow users to view files in course-content bucket
CREATE POLICY "Allow public viewing" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'course-content');

-- 4. Allow authenticated users to delete their own objects
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (auth.uid() = owner);

-- Check if the policies were created successfully
SELECT
    policy.policyname AS policy_name,
    roles.rolname AS role_name,
    obj.relname AS table_name,
    CASE pol.cmd
        WHEN 1 THEN 'SELECT'
        WHEN 2 THEN 'INSERT'
        WHEN 3 THEN 'UPDATE'
        WHEN 4 THEN 'DELETE'
    END AS command,
    pol.qual AS using_expression,
    pol.with_check AS with_check_expression
FROM
    pg_policy pol
    JOIN pg_class obj ON pol.polrelid = obj.oid
    JOIN pg_roles roles ON pol.polrole = roles.oid
    JOIN pg_policy policy ON pol.oid = policy.oid
WHERE
    obj.relname = 'objects' AND obj.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');
