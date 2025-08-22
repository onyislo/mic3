import { supabase } from './supabaseClient';
import { Course } from '../types/CourseTypes';

// Interface for creating/updating courses
export interface CourseInput {
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  image_url?: string;
  category?: string;
  status?: 'active' | 'draft' | 'archived';
}

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCourses:', error);
    return [];
  }
};

// Get a single course by ID
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};

// Get a single course by title
export const getCourseByTitle = async (title: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .eq('Course Title', title)
      .single();

    if (error) {
      console.error('Error fetching course by title:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCourseByTitle:', error);
    return null;
  }
};

// Create a new course
export const createCourse = async (courseData: CourseInput): Promise<Course | null> => {
  try {
    // Validate and sanitize price to ensure it's a valid number
    let price = 0;
    if (courseData.price !== undefined) {
      // If price is a string, try to convert it to a number
      if (typeof courseData.price === 'string') {
        const parsedPrice = parseFloat(courseData.price);
        if (!isNaN(parsedPrice)) {
          price = parsedPrice;
        } else {
          throw new Error(`Invalid price value: ${courseData.price}. Price must be a number.`);
        }
      } else if (typeof courseData.price === 'number') {
        price = courseData.price;
      }
    }
    
    // Make sure description is a string
    const description = courseData.description ? String(courseData.description) : '';
    
    const { data, error } = await supabase
      .from('Courses')
      .insert({
        "Course Title": courseData.title,
        "Instructor": courseData.instructor,
        "Description": description, // Explicitly convert to string
        "duration": courseData.duration || '4 weeks',
        "level": courseData.level || 'beginner',
        "image_url": courseData.image_url || '',
        "category": courseData.category || 'general',
        "Price": price, // Use the validated price value
        "status": courseData.status || 'draft'
        // Removed slug field as it doesn't exist in your database
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createCourse:', error);
    return null;
  }
};

// Update an existing course
export const updateCourse = async (id: string, courseData: Partial<CourseInput>): Promise<Course | null> => {
  try {
    // Map the input data to match our column names
    const updates: Record<string, string | number | undefined> = {};
    
    if (courseData.title) {
      updates["Course Title"] = courseData.title;
      // Removed slug field as it doesn't exist in your database
    }
    
    if (courseData.description !== undefined) {
      // Ensure description is a string
      updates["Description"] = String(courseData.description);
    }
    
    if (courseData.instructor) {
      updates["Instructor"] = courseData.instructor;
    }

    if (courseData.price !== undefined) {
      // Validate and sanitize price
      let price = 0;
      if (typeof courseData.price === 'string') {
        const parsedPrice = parseFloat(courseData.price as string);
        if (!isNaN(parsedPrice)) {
          price = parsedPrice;
        } else {
          throw new Error(`Invalid price value: ${courseData.price}. Price must be a number.`);
        }
      } else if (typeof courseData.price === 'number') {
        price = courseData.price;
      }
      
      updates["Price"] = price;
    }

    if (courseData.duration) {
      updates["duration"] = courseData.duration;
    }

    if (courseData.level) {
      updates["level"] = courseData.level;
    }

    if (courseData.image_url) {
      updates["image_url"] = courseData.image_url;
    }

    if (courseData.category) {
      updates["category"] = courseData.category;
    }

    if (courseData.status) {
      updates["status"] = courseData.status;
    }
    
    const { data, error } = await supabase
      .from('Courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCourse:', error);
    return null;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    // First delete associated payments
    const { error: paymentsError } = await supabase
      .from('Payments')
      .delete()
      .eq('course_id', id);
    
    if (paymentsError) {
      console.error('Error deleting associated payments:', paymentsError);
      return false;
    }
    
    // Next delete any course progress records
    const { error: progressError } = await supabase
      .from('course_progress')
      .delete()
      .eq('course_id', id);
    
    if (progressError) {
      console.error('Error deleting associated course progress:', progressError);
      return false;
    }
    
    // Delete course content
    const { error: contentError } = await supabase
      .from('course_content')
      .delete()
      .eq('course_id', id);
    
    if (contentError) {
      console.error('Error deleting associated course content:', contentError);
      return false;
    }
    
    // Finally delete the course
    const { error } = await supabase
      .from('Courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    return false;
  }
};

// Change course status
export const updateCourseStatus = async (id: string, status: 'active' | 'draft' | 'archived'): Promise<Course | null> => {
  return updateCourse(id, { status });
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCoursesByCategory:', error);
    return [];
  }
};

// Get active courses
export const getActiveCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActiveCourses:', error);
    return [];
  }
};

// Get count of students enrolled in a course
export const getCourseStudentCount = async (courseId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('course_progress')  // Using lowercase version to match actual table name
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    if (error) {
      console.error('Error counting course students:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getCourseStudentCount:', error);
    return 0;
  }
};
