# Fix for Course Content Database Issue

## What Was Changed

We've removed all references to the `order` column from database operations since that column doesn't exist in your Supabase database. This includes:

1. Removed `order` field from all database queries
2. Removed sorting by `order`
3. Removed `order` from data being inserted or updated
4. Made the `order` property optional in the TypeScript interface

## Storage Configuration

The storage bucket name `course-content` (with a hyphen) is correctly being used throughout the code.

## What to Expect

- The error message `"column course_content.order does not exist"` should no longer appear
- Course content will be shown in the order it's returned from the database 
- Upload functionality should work normally with the `course-content` storage bucket

## If Issues Persist

If you continue to see errors:

1. Check the browser console for exact error messages
2. Verify that your Supabase database has a table named `course_content`
3. Verify that your Supabase storage has a bucket named `course-content`
4. Make sure you're properly authenticated when uploading files
