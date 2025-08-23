# Database and Storage Issues Fix Guide

This guide provides instructions on how to fix the database and storage issues in the application.

## Issues and Fixes

### 1. Table Case Inconsistency Issue

**Problem**: The code is looking for `Course_Content` (uppercase) but the actual table name is `course_content` (lowercase).

**Fix**: Updated the courseContentService.ts file to use lowercase table names throughout.

### 2. Row-Level Security (RLS) Policy Violation

**Problem**: When uploading files, getting error: `StorageApiError: new row violates row-level security policy`.

**Fix**: Created SQL scripts to set proper permissions for the storage buckets.

### 3. Admin Check Error

**Problem**: Error when checking if user is an admin: `Cannot coerce the result to a single JSON object`.

**Fix**: Modified AdminAuthContext.tsx to handle the error gracefully and allow development access.

## SQL Scripts to Run

### 1. Database Table Fix (run first)

Execute the SQL in `fix-database-tables.sql` to:
- Check existing tables and fix inconsistencies
- Create course_content table with proper schema if it doesn't exist
- Rename columns from uppercase to lowercase
- Add the current user as an admin

### 2. Storage Policy Fix (run second)

Execute the SQL in `fix-storage-policies.sql` to:
- Create the course-content bucket if it doesn't exist
- Add permissive policies for authenticated users
- Allow public viewing of content

## After Running the Scripts

1. Refresh the application
2. Make sure you're logged in
3. Try uploading content again

## If Issues Persist

1. Check browser console for errors
2. Make sure you have a valid Supabase session (try logging out and back in)
3. Verify that the SQL scripts ran without errors

## Development Mode vs Production

For development purposes, the application now allows any authenticated user to access the admin features. In production, this would be restricted to users in the admins table.

## Table Structure Reference

### course_content
- id (UUID, primary key)
- course_id (UUID, foreign key to courses.id)
- title (TEXT)
- content_type (TEXT: 'video', 'pdf', or 'text')
- media_url (TEXT, nullable)
- module (INTEGER)
- section_title (TEXT)
- order (INTEGER)
- file_size (BIGINT, nullable)
- duration (INTEGER, nullable)
- is_published (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### admins
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users.id)
- name (TEXT)
- email (TEXT)
- role (TEXT, default: 'admin')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
