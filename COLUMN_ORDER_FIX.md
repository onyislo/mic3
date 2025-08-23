# Database and Storage Issue Resolution

This document explains how to fix the database column and storage bucket issues in the application.

## Current Issues

### 1. Database Column Error

Error message: `"column course_content.order does not exist"`

This error occurs because:
1. 'order' is a reserved SQL keyword and needs special handling in queries
2. The column either doesn't exist or needs to be quoted in queries

### 2. Storage Bucket Configuration

The storage bucket is correctly named `course-content` (with a hyphen) in Supabase.

## How to Fix

### Step 1: Run the SQL Script

Run the SQL in `fix-order-column.sql` in your Supabase SQL Editor. This will:

1. Check if the `order` column exists in the `course_content` table
2. Add the column if it's missing
3. Verify the `course-content` storage bucket exists
4. Set proper permissions on the storage bucket

### Step 2: Update Your Code (Already Done)

The following code changes have been made:

1. Updated SQL queries to properly quote the `order` column:
   - Changed `order('order', {...})` to `order('"order"', {...})`
   - Changed column references from `item.order` to `item["order"]`

2. Verified storage bucket references:
   - Confirmed using `course-content` (with hyphen) throughout

## Table and Column Information

### Database Table: `course_content`

The table should have these columns:
- `id`: UUID (primary key)
- `course_id`: UUID (foreign key)
- `title`: TEXT
- `content_type`: TEXT ('video', 'pdf', or 'text')
- `media_url`: TEXT (nullable)
- `module`: INTEGER
- `section_title`: TEXT
- `order`: INTEGER (special handling required)
- `file_size`: BIGINT (nullable)
- `duration`: INTEGER (nullable)
- `is_published`: BOOLEAN
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Storage Bucket: `course-content`

The storage bucket should have these characteristics:
- Name: `course-content` (with hyphen)
- Public: true
- Policies: 
  - Allow authenticated users to upload
  - Allow public viewing of content

## After Making Changes

After running the SQL script, refresh your application and try uploading content again. The errors should be resolved.
