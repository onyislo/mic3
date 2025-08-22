# Testing Course Creation Functionality

This guide provides steps to verify that the course creation and persistence functionality is working correctly.

## Prerequisites

1. Ensure your Supabase project is running and properly connected
2. Make sure you are logged in as an admin user
3. Navigate to the Admin Courses section

## Test 1: Create a New Course

1. **Navigate to Admin Courses**:
   - Log in as an admin
   - Go to the Admin Dashboard
   - Click on "Courses" in the sidebar

2. **Create a New Course**:
   - Click the "Add Course" or "Create Course" button
   - Fill out the form with the following test data:
     - Course Title: "Test Course 101"
     - Description: "This is a test course to verify database persistence"
     - Instructor: "Test Instructor"
     - Price: 99.99
     - Duration: "4 weeks"
     - Level: "beginner"
     - Category: "testing"
   - Click "Save" or "Create Course"

3. **Verify Success**:
   - You should see a success message
   - The new course should appear in the course list

4. **Test Persistence**:
   - Refresh the page completely (F5 or Ctrl+R)
   - Verify the course still appears in the list
   - Click on the course to verify all details were saved correctly

## Test 2: Edit an Existing Course

1. **Select a Course**:
   - From the course list, find your "Test Course 101"
   - Click "Edit" or the edit icon

2. **Make Changes**:
   - Change the Course Title to "Updated Test Course 101"
   - Change the Description to "This description has been updated"
   - Click "Save" or "Update"

3. **Verify Changes Persist**:
   - Refresh the page completely
   - Verify the updated title and description appear

## Test 3: Check Database Directly

If possible, verify in Supabase that:

1. The course was added to the `Courses` table (note the capital C)
2. The column names match the expected format ("Course Title", "Description", etc.)
3. The values are stored correctly

## Troubleshooting

If courses still don't persist:

1. Check browser console for any errors during save operations
2. Verify Supabase connection settings in the environment variables
3. Check the database logs for any rejected operations
4. Ensure the SQL in `fix-table-capitalization.sql` has been run if needed

## Report Issues

If you encounter any issues during testing, please document:

1. The exact steps that led to the issue
2. Any error messages from the console
3. The state of the database before and after the operation
4. Screenshots if available

Provide this information to the development team for further investigation.
