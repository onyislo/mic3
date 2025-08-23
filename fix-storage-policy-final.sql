-- This script will fix storage permissions for the course-content bucket

-- First, check if the bucket exists
SELECT * FROM storage.buckets WHERE name = 'course-content';

-- If it doesn't exist, create it
INSERT INTO storage.buckets (id, name, public)
SELECT 'course-content', 'course-content', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE name = 'course-content'
);

-- Remove any conflicting policies
DELETE FROM storage.policies 
WHERE bucket_id = 'course-content';

-- Create a policy that allows authenticated users to upload files
INSERT INTO storage.policies (bucket_id, name, definition, action, role)
VALUES 
  ('course-content', 'Allow authenticated uploads', 'auth.role() = ''authenticated''', 'INSERT', 'authenticated');

-- Allow authenticated users to select their own files
INSERT INTO storage.policies (bucket_id, name, definition, action, role)
VALUES 
  ('course-content', 'Allow authenticated users to read files', 'auth.role() = ''authenticated''', 'SELECT', 'authenticated');

-- Allow users to update their own files
INSERT INTO storage.policies (bucket_id, name, definition, action, role)
VALUES 
  ('course-content', 'Allow authenticated users to update files', 'auth.role() = ''authenticated''', 'UPDATE', 'authenticated');

-- Allow users to delete their own files
INSERT INTO storage.policies (bucket_id, name, definition, action, role)
VALUES 
  ('course-content', 'Allow authenticated users to delete files', 'auth.role() = ''authenticated''', 'DELETE', 'authenticated');

-- Create a policy to allow public access to view files
INSERT INTO storage.policies (bucket_id, name, definition, action, role)
VALUES 
  ('course-content', 'Allow public to view files', 'true', 'SELECT', 'anon');

-- If you want to make the bucket public (optional)
UPDATE storage.buckets
SET public = true
WHERE name = 'course-content';

-- Output success message
SELECT 'Storage policies updated successfully for course-content bucket' AS result;
