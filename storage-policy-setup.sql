-- Enable RLS on the storage.objects table (it should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read course images
CREATE POLICY "Public Access Course Images" 
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-images');

-- Create a policy that allows authenticated users to upload course images
CREATE POLICY "Authenticated Users Can Upload Course Images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-images' 
  AND auth.role() = 'authenticated'
);

-- Create a policy that allows authenticated users to update their own course images
CREATE POLICY "Authenticated Users Can Update Own Course Images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-images'
  AND auth.role() = 'authenticated'
);

-- Create a policy that allows authenticated users to delete their own course images
CREATE POLICY "Authenticated Users Can Delete Course Images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-images'
  AND auth.role() = 'authenticated'
);
