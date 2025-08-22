-- Script to update Courses table structure to match application code
-- 1. Make sure essential columns exist with proper capitalization

-- Add or update the Price column - capitalized 
ALTER TABLE "Courses"
ADD COLUMN IF NOT EXISTS "Price" NUMERIC(10, 2) DEFAULT 0;

-- Add status column if it doesn't exist
ALTER TABLE "Courses"
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived'));

-- Add any other required columns that might be missing
ALTER TABLE "Courses"
ADD COLUMN IF NOT EXISTS "Course Title" TEXT,
ADD COLUMN IF NOT EXISTS "Description" TEXT,
ADD COLUMN IF NOT EXISTS "Instructor" TEXT;

-- 2. Set default status for existing courses that don't have one
UPDATE "Courses" SET status = 'active' WHERE status IS NULL;

-- 3. Fix any capitalization issues with columns
DO $$
BEGIN
    -- Rename lowercase price to capitalized Price if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Courses' AND column_name = 'price') THEN
        ALTER TABLE "Courses" RENAME COLUMN price TO "Price";
    END IF;
    
    -- Copy data from lowercase title to Course Title if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Courses' AND column_name = 'title') THEN
        UPDATE "Courses" SET "Course Title" = title WHERE "Course Title" IS NULL AND title IS NOT NULL;
    END IF;
    
    -- Copy data from lowercase description to Description if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Courses' AND column_name = 'description') THEN
        UPDATE "Courses" SET "Description" = description WHERE "Description" IS NULL AND description IS NOT NULL;
    END IF;
    
    -- Copy data from lowercase instructor to Instructor if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Courses' AND column_name = 'instructor') THEN
        UPDATE "Courses" SET "Instructor" = instructor WHERE "Instructor" IS NULL AND instructor IS NOT NULL;
    END IF;
END $$;

-- 4. Example of adding a course with the correct column names
-- INSERT INTO "Courses" 
--   ("Course Title", "Instructor", "Description", duration, level, image_url, category, "Price", status)
-- VALUES 
--   ('React Masterclass', 'John Doe', 'Learn React from beginner to advanced', '8 weeks', 'intermediate', 'https://example.com/react.jpg', 'programming', 2500, 'active');

-- 5. Output message to indicate completion
DO $$
BEGIN
    RAISE NOTICE 'Course table structure update completed successfully';
END $$;
