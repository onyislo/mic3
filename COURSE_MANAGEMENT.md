# Course Management System

## Recent Updates

### Course Persistence Implementation

The course management system has been updated to properly persist courses in the Supabase database. Previously, courses were only stored in component state and would disappear when the page was refreshed.

#### Changes Made:

1. Created `courseService.ts` file to handle CRUD operations for courses:
   - `getCourses()` - Retrieves all courses from the database
   - `getCourseById(id)` - Gets a specific course by ID
   - `createCourse(courseData)` - Creates a new course in the database
   - `updateCourse(id, courseData)` - Updates an existing course
   - `deleteCourse(id)` - Removes a course from the database

2. Updated the `AdminCourses.tsx` component to:
   - Fetch courses from the database on component mount
   - Store courses in state
   - Add new courses to the database when the form is submitted
   - Delete courses from the database when the delete button is clicked

3. Enhanced the `Course` type in `supabaseClient.ts` to include:
   - `instructor` field
   - `status` field ('active', 'draft', or 'archived')
   - `slug` field for SEO-friendly URLs

4. Created `courses-update.sql` script to update the database schema:
   - Added missing columns to the courses table
   - Created an index on the slug field for faster lookups

#### Database Schema:

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  image_url TEXT,
  category TEXT,
  instructor TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### How to Use:

1. Make sure the Supabase tables are set up correctly using the SQL script in `SUPABASE_SETUP_GUIDE.md`
2. Run the `courses-update.sql` script to add the new columns to the courses table
3. Use the Admin panel at `/admin/courses` to create and manage courses
4. Courses will now persist between page refreshes

This update ensures that courses are properly stored in the database and can be retrieved across sessions.
