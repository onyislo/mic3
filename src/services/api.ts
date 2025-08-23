const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  // Always use Supabase for all course and content fetching

  // Course-specific methods
  async getCourses() {
    const { getCourses } = await import('./courseService');
    return await getCourses();
  }

  async getCourse(courseId: string) {
    const { getCourseById } = await import('./courseService');
    return await getCourseById(courseId);
  }

  async getCourseContent(id: string) {
    const { getCourseContent } = await import('./courseContentService');
    const sections = await getCourseContent(id);
    // We need to transform this to match the CourseContent structure expected by components
    if (sections && sections.length > 0) {
      const { getCourseById } = await import('./courseService');
      const courseData = await getCourseById(id);
      return {
        id: id,
        title: courseData ? courseData["Course Title"] : "Course",
        sections: sections,
        progress: 0 // This would normally be calculated from user progress
      };
    }
    return null;
  }
}

export const api = new ApiClient();