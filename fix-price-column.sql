-- SQL script to fix the Price column in Courses table

-- 1. First, rename the existing price column if it exists (this avoids conflicts)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Courses' AND column_name = 'price') THEN
        ALTER TABLE "Courses" RENAME COLUMN price TO price_old;
    END IF;
END $$;

-- 2. Add the properly capitalized Price column
ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "Price" NUMERIC(10, 2) DEFAULT 0;

-- 3. Copy data from old column to new column if the old column existed
UPDATE "Courses" SET "Price" = price_old WHERE price_old IS NOT NULL;

-- 4. Drop the old column if it exists (only if you want to clean up)
-- Uncomment the line below after verifying data was properly transferred
-- ALTER TABLE "Courses" DROP COLUMN IF EXISTS price_old;

-- 5. Output a message to indicate completion
DO $$
BEGIN
    RAISE NOTICE 'Price column capitalization fix completed successfully';
END $$;
