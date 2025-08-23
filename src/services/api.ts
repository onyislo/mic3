const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Course-specific methods
  async getCourses() {
    try {
      // Try to use the direct API endpoint if available
      return await this.get('/courses');
    } catch (error) {
      // Fallback to Supabase direct import if needed
      console.log('Falling back to Supabase for courses');
      const { getCourses } = await import('./courseService');
      return await getCourses();
    }
  }

  async getCourse(courseId: string) {
    try {
      // Try to use the direct API endpoint if available
      return await this.get(`/courses/${courseId}`);
    } catch (error) {
      // Fallback to Supabase direct import if needed
      console.log('Falling back to Supabase for course details');
      const { getCourseById } = await import('./courseService');
      return await getCourseById(courseId);
    }
  }

  async getCourseContent(id: string) {
    try {
      // First try using direct API endpoint
      return await this.get(`/courses/${id}/content`);
    } catch (error) {
      // Fallback to Supabase
      console.log('Falling back to Supabase for course content');
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

  // Student progress tracking methods
  async updateLessonProgress(data: {
    courseId: string;
    lessonId: string;
    completed: boolean;
  }) {
    return this.post('/progress/lesson', data);
  }

  async markCourseComplete(courseId: string) {
    return this.post(`/progress/course/${courseId}/complete`);
  }

  async getUserProgress() {
    return this.get('/progress');
  }

  async getCourseBadges(courseId: string) {
    return this.get(`/courses/${courseId}/badges`);
  }

  // Payment methods
  async initiateMpesaPayment(data: {
    courseId: string;
    phoneNumber: string;
    amount: number;
  }) {
    return this.post('/payments/mpesa/stk', data);
  }

  // Contact method
  async submitContact(data: {
    name: string;
    email: string;
    message: string;
  }) {
    try {
      // Try to post to the API endpoint
      return await this.post('/contact', data);
    } catch (error) {
      console.log('Contact form submission - fallback mode:', {
        ...data,
        recipient: 'info@mic3solutiongroup.com',
        timestamp: new Date().toISOString()
      });
      
      // Save to localStorage for development purposes
      const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      savedMessages.push({
        ...data,
        recipient: 'info@mic3solutiongroup.com',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contactMessages', JSON.stringify(savedMessages));
      
      // In development mode, we'll resolve anyway to simulate successful submission
      if (import.meta.env.DEV) {
        return { success: true, message: 'Message stored locally (development mode)' };
      }
      
      // In production, we should properly handle the error
      throw error;
    }
  }
}

export const api = new ApiClient(API_BASE_URL);