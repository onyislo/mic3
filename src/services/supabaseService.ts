import { 
  supabase, 
  UserProfile, 
  CourseProgress, 
  CoursePayment, 
  Badge, 
  UserBadge,
  Course
} from './supabaseClient';

// User Profile Services
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Course Services
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('Courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data || [];
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('Courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }

  return data;
};

// Course Progress Services
export const getUserCourseProgress = async (userId: string): Promise<CourseProgress[]> => {
  console.log('Fetching course progress for userId:', userId);
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user course progress:', error);
    return [];
  }

  return data || [];
};

export const updateCourseProgress = async (
  userId: string, 
  courseId: string, 
  progressPercentage: number,
  isCompleted = false
) => {
  // Check if progress record exists
  const { data: existing } = await supabase
    .from('Course_Progress')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('course_progress')
      .update({ 
        progress_percentage: progressPercentage,
        is_completed: isCompleted,
        last_accessed: now,
        updated_at: now
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('course_progress')
      .insert({ 
        user_id: userId,
        course_id: courseId,
        progress_percentage: progressPercentage,
        is_completed: isCompleted,
        last_accessed: now,
        created_at: now,
        updated_at: now
      });

    if (error) {
      console.error('Error creating course progress:', error);
      throw error;
    }
  }

  // If course is completed, award badge if applicable
  if (isCompleted) {
    await checkAndAwardBadge(userId, courseId);
  }
};

// Payments Services
export const getUserPayments = async (userId: string): Promise<CoursePayment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*, courses(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user payments:', error);
    return [];
  }

  return data || [];
};

export const createPayment = async (
  userId: string,
  courseId: string,
  amount: number,
  paymentMethod: string
) => {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      course_id: courseId,
      amount,
      status: 'completed',
      payment_date: now,
      payment_method: paymentMethod,
      created_at: now,
      updated_at: now
    });

  if (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
};

// Badges Services
export const getUserBadges = async (userId: string): Promise<{badge: Badge, userBadge: UserBadge}[]> => {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data ? data.map(item => ({
    badge: item.badges,
    userBadge: {
      id: item.id,
      user_id: item.user_id,
      badge_id: item.badge_id,
      earned_date: item.earned_date,
      created_at: item.created_at
    }
  })) : [];
};

// Helper functions
const checkAndAwardBadge = async (userId: string, courseId: string) => {
  try {
    // Get the course details to determine which badge to award
    const { data: course } = await supabase
      .from('Courses')
      .select('category, level')
      .eq('id', courseId)
      .single();
    
    if (!course) return;
    
    // Find the appropriate badge based on course category and level
    const { data: badge } = await supabase
      .from('badges')
      .select('*')
      .eq('category', course.category)
      .eq('level', course.level)
      .single();
    
    if (!badge) return;
    
    // Check if user already has this badge
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .single();
    
    if (existingBadge) return;
    
    // Award the badge to the user
    const now = new Date().toISOString();
    
    await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badge.id,
        earned_date: now,
        created_at: now
      });
      
    console.log(`Badge ${badge.name} awarded to user ${userId}`);
  } catch (error) {
    console.error('Error awarding badge:', error);
  }
};

// Admin Analytics Services
export const getAdminAnalytics = async () => {
  try {
    // Get total users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get total courses
    const { count: courseCount } = await supabase
      .from('Courses')
      .select('*', { count: 'exact', head: true });
    
    // Get total payments
    const { data: payments } = await supabase
      .from('Payments')
      .select('amount')
      .eq('status', 'completed');
    
    // Calculate total revenue
    const totalRevenue = payments ? payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
    
    // Get completed courses count
    const { count: completedCoursesCount } = await supabase
      .from('Course_Progress')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', true);
    
    return {
      userCount: userCount || 0,
      courseCount: courseCount || 0,
      totalRevenue,
      completedCoursesCount: completedCoursesCount || 0
    };
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }
};

// Admin User Management Services
export const getUsers = async () => {
  try {
    // Get all user profiles which is the reliable way to get users for client-side code
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    
    if (!profiles || profiles.length === 0) {
      console.warn('No user profiles found in the database');
      return [];
    }
    
    console.log(`Found ${profiles.length} profiles in database`);
    
    // For each profile, get their enrolled courses
    const usersWithCourses = await Promise.all(profiles.map(async (profile) => {
      // Get course progress for user
      const { data: coursesProgress } = await supabase
        .from('course_progress')
        .select('*, courses(title)')
        .eq('user_id', profile.user_id);
      
      // Get payments for user
      const { data: payments } = await supabase
        .from('payments')
        .select('*, courses(title)')
        .eq('user_id', profile.user_id)
        .eq('status', 'completed');
      
      // Combine enrollments from course_progress and payments
      const enrolledCourses = [
        ...(coursesProgress?.map(cp => cp.courses?.title) || []), 
        ...(payments?.map(p => p.courses?.title) || [])
      ];
      
      // Filter out duplicates and nulls
      const uniqueEnrolledCourses = Array.from(new Set(enrolledCourses)).filter(Boolean) as string[];
      
      return {
        id: profile.user_id,
        name: profile.name || 'No Name',
        email: profile.email || 'No Email',
        enrolledCourses: uniqueEnrolledCourses,
        joinDate: new Date(profile.created_at).toISOString().split('T')[0],
        status: 'active' as const
      };
    }));
    
    return usersWithCourses;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};



export const enrollUserInCourse = async (userId: string, courseId: string) => {
  try {
    // Check if the course exists
    const { data: course } = await supabase
      .from('Courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Create an enrollment record instead of a payment
    const now = new Date().toISOString();
    
    // Only create a payment record if we need to track it, but with admin_enrollment status
    // so it doesn't appear as a regular completed payment
    const { error: paymentError } = await supabase
      .from('Payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount: 0, // Free for admin enrollments
        status: 'admin_enrolled', // Custom status that won't show as completed
        payment_date: now,
        payment_method: 'admin_enrollment',
        created_at: now,
        updated_at: now
      });
    
    if (paymentError) {
      throw paymentError;
    }
    
    // Create initial progress record
    const { error: progressError } = await supabase
      .from('course_progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        progress_percentage: 0,
        is_completed: false,
        last_accessed: now,
        created_at: now,
        updated_at: now
      });
    
    if (progressError) {
      throw progressError;
    }
    
    // Update user's purchased_courses array in profiles
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('purchased_courses')
      .eq('user_id', userId)
      .single();
    
    const purchased_courses = userProfile?.purchased_courses || [];
    if (!purchased_courses.includes(courseId)) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          purchased_courses: [...purchased_courses, courseId],
          updated_at: now
        })
        .eq('user_id', userId);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
};

export const removeUserFromCourse = async (userId: string, courseId: string) => {
  try {
    // Delete course progress
    const { error: progressError } = await supabase
      .from('course_progress')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);
    
    if (progressError) {
      throw progressError;
    }
    
    // Update user's purchased_courses array in profiles
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('purchased_courses')
      .eq('user_id', userId)
      .single();
    
    const purchased_courses = userProfile?.purchased_courses || [];
    const updatedCourses = purchased_courses.filter((id: string) => id !== courseId);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        purchased_courses: updatedCourses,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing user from course:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // In a real application, you should use Supabase Admin APIs or Edge Functions
    // to delete the auth.users record. For this implementation, we'll just delete
    // related records but leave the auth user intact.
    
    // Delete course progress
    const { error: progressError } = await supabase
      .from('course_progress')
      .delete()
      .eq('user_id', userId);
    
    if (progressError) {
      throw progressError;
    }
    
    // Delete payments
    const { error: paymentsError } = await supabase
      .from('Payments')
      .delete()
      .eq('user_id', userId);
    
    if (paymentsError) {
      throw paymentsError;
    }
    
    // Delete user badges
    const { error: badgesError } = await supabase
      .from('user_badges')
      .delete()
      .eq('user_id', userId);
    
    if (badgesError) {
      throw badgesError;
    }
    
    // Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);
    
    if (profileError) {
      throw profileError;
    }
    
    // Note: The auth.user record can only be deleted through admin APIs
    // This is just marking the user as deleted in our application tables
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
