# Table Name Capitalization Fix

## Issue Fixed

We encountered an error when trying to add courses through the admin panel:

```
Error creating course: 
Object { code: "PGRST205", details: null, hint: "Perhaps you meant the table 'public.Courses'", message: "Could not find the table 'public.courses' in the schema cache" }
```

The error occurred because the table names in the Supabase database used capital letters (e.g., `Courses`), but our code was trying to access them using lowercase letters (e.g., `courses`).

## Changes Made

1. Updated all references in `courseService.ts` to use capital letters for table names:
   - Changed `from('courses')` to `from('Courses')`
   - Changed `from('course_progress')` to `from('Course_Progress')`

2. Updated all references in `supabaseService.ts` to use capital letters for table names:
   - Changed `from('courses')` to `from('Courses')`

3. Created a SQL script (`fix-table-capitalization.sql`) that can be run in the Supabase SQL Editor to ensure consistent capitalization across all tables.

## How to Use This Fix

1. The code in this repository now uses the correct capitalization for table names.

2. If you need to create tables in Supabase with consistent capitalization, you can run the `fix-table-capitalization.sql` script in the Supabase SQL Editor.

3. Note that when working with Supabase, table names are case-sensitive, so it's important to be consistent.

## Best Practices for Supabase Table Names

When creating tables in Supabase:

1. Be consistent with capitalization. Either use all lowercase (the PostgreSQL convention) or capitalize the first letter of each word (like `Courses` and `Portfolio`).

2. Use quotation marks around table names if they include capital letters when creating them in SQL, e.g., `CREATE TABLE "Courses" (...)`.

3. If mixing capitalization styles, make sure your code uses the exact same capitalization as the table name in the database.

4. Consider using lowercase with underscores for all new tables to follow PostgreSQL conventions.
