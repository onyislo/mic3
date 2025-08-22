import { useState } from 'react';

// Types
interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  imageUrl: string;
  duration: string;
  level: string;
  rating: number;
  enrolledCount: number;
  slug: string;
  isPublished?: boolean;
}

interface ContentSection {
  id: string;
  title: string;
  order: number;
  items: ContentItem[];
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  url?: string;
  duration?: number; // video duration in seconds
  fileSize?: number; // pdf file size in bytes
  isCompleted?: boolean;
  order: number;
}

interface CourseContent {
  id: string;
  title: string;
  progress: number;
  sections: ContentSection[];
}

// Mock database
class MockDatabase {
  private courses: Course[] = [
    {
      id: '1',
      title: 'React Masterclass',
      instructor: 'Jane Smith',
      description: 'Learn React from the ground up with this comprehensive course.',
      price: 19900,
      imageUrl: '/course1.jpg',
      duration: '10 hours',
      level: 'Intermediate',
      rating: 4.8,
      enrolledCount: 1243,
      slug: 'react-masterclass',
      isPublished: true,
    },
    {
      id: '2',
      title: 'Node.js for Beginners',
      instructor: 'John Doe',
      description: 'Get started with Node.js and build your first server.',
      price: 14900,
      imageUrl: '/course2.jpg',
      duration: '8 hours',
      level: 'Beginner',
      rating: 4.5,
      enrolledCount: 956,
      slug: 'nodejs-beginners',
      isPublished: true,
    },
    {
      id: '3',
      title: 'Advanced JavaScript Patterns',
      instructor: 'Alex Johnson',
      description: 'Master advanced JavaScript design patterns and techniques.',
      price: 24900,
      imageUrl: '/course3.jpg',
      duration: '12 hours',
      level: 'Advanced',
      rating: 4.9,
      enrolledCount: 782,
      slug: 'advanced-js-patterns',
      isPublished: true,
    },
  ];

  private courseContents: Record<string, CourseContent> = {
    '1': {
      id: '1',
      title: 'React Masterclass',
      progress: 35,
      sections: [
        {
          id: '1',
          title: 'Introduction',
          order: 0,
          items: [
            {
              id: '101',
              title: 'Welcome to the Course',
              type: 'video',
              url: 'https://example.com/videos/welcome.mp4',
              duration: 360, // 6 minutes in seconds
              isCompleted: true,
              order: 0
            },
            {
              id: '102',
              title: 'Course Resources',
              type: 'pdf',
              url: 'https://example.com/pdfs/resources.pdf',
              fileSize: 2500000, // 2.5MB
              isCompleted: false,
              order: 1
            }
          ]
        },
        {
          id: '2',
          title: 'Getting Started with React',
          order: 1,
          items: [
            {
              id: '201',
              title: 'Setting Up Your Environment',
              type: 'video',
              url: 'https://example.com/videos/setup.mp4',
              duration: 720, // 12 minutes in seconds
              isCompleted: false,
              order: 0
            },
            {
              id: '202',
              title: 'Creating Your First React App',
              type: 'video',
              url: 'https://example.com/videos/first-app.mp4',
              duration: 900, // 15 minutes in seconds
              isCompleted: false,
              order: 1
            },
            {
              id: '203',
              title: 'React Fundamentals Guide',
              type: 'pdf',
              url: 'https://example.com/pdfs/react-guide.pdf',
              fileSize: 3500000, // 3.5MB
              isCompleted: false,
              order: 2
            }
          ]
        },
        {
          id: '3',
          title: 'Advanced React Concepts',
          order: 2,
          items: [
            {
              id: '301',
              title: 'Hooks and State Management',
              type: 'video',
              url: 'https://example.com/videos/hooks.mp4',
              duration: 1500, // 25 minutes in seconds
              isCompleted: false,
              order: 0
            },
            {
              id: '302',
              title: 'Context API and Redux',
              type: 'text',
              isCompleted: false,
              order: 1
            }
          ]
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Node.js for Beginners',
      progress: 0,
      sections: [
        {
          id: '1',
          title: 'Introduction to Node.js',
          order: 0,
          items: [
            {
              id: '101',
              title: 'What is Node.js?',
              type: 'video',
              url: 'https://example.com/videos/what-is-nodejs.mp4',
              duration: 480, // 8 minutes in seconds
              isCompleted: false,
              order: 0
            }
          ]
        }
      ]
    }
  };

  private users = [
    {
      id: '1',
      name: 'Test User',
      email: 'user@example.com',
      purchasedCourses: ['1'],
    }
  ];

  // Course methods
  getCourses() {
    return [...this.courses];
  }

  getCourse(slug: string) {
    return this.courses.find(course => course.slug === slug);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  createCourse(course: Omit<Course, 'id' | 'slug'>) {
    const id = (this.courses.length + 1).toString();
    const slug = course.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const newCourse = {
      ...course,
      id,
      slug,
      rating: 0,
      enrolledCount: 0,
      isPublished: false
    };
    
    this.courses.push(newCourse);
    
    // Initialize empty course content
    this.courseContents[id] = {
      id,
      title: course.title,
      progress: 0,
      sections: []
    };
    
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>) {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return null;
    
    this.courses[index] = {
      ...this.courses[index],
      ...updates
    };
    
    return this.courses[index];
  }

  // Course content methods
  getCourseContent(id: string) {
    return this.courseContents[id] || null;
  }

  updateCourseContent(id: string, content: CourseContent) {
    this.courseContents[id] = content;
    return this.courseContents[id];
  }

  // Section methods
  addSection(courseId: string, section: Omit<ContentSection, 'id'>) {
    if (!this.courseContents[courseId]) return null;
    
    const courseContent = this.courseContents[courseId];
    const sectionId = `s-${Date.now()}`;
    
    const newSection = {
      ...section,
      id: sectionId,
      items: [] as ContentItem[]
    };
    
    courseContent.sections.push(newSection);
    
    return newSection;
  }

  updateSection(courseId: string, sectionId: string, updates: Partial<ContentSection>) {
    if (!this.courseContents[courseId]) return null;
    
    const courseContent = this.courseContents[courseId];
    const sectionIndex = courseContent.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return null;
    
    courseContent.sections[sectionIndex] = {
      ...courseContent.sections[sectionIndex],
      ...updates
    };
    
    return courseContent.sections[sectionIndex];
  }

  deleteSection(courseId: string, sectionId: string) {
    if (!this.courseContents[courseId]) return false;
    
    const courseContent = this.courseContents[courseId];
    const sectionIndex = courseContent.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return false;
    
    courseContent.sections.splice(sectionIndex, 1);
    
    return true;
  }

  // Content item methods
  addContentItem(courseId: string, sectionId: string, item: Omit<ContentItem, 'id'>) {
    if (!this.courseContents[courseId]) return null;
    
    const courseContent = this.courseContents[courseId];
    const sectionIndex = courseContent.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return null;
    
    const itemId = `i-${Date.now()}`;
    
    const newItem = {
      ...item,
      id: itemId,
      isCompleted: false
    };
    
    courseContent.sections[sectionIndex].items.push(newItem);
    
    return newItem;
  }

  updateContentItem(courseId: string, sectionId: string, itemId: string, updates: Partial<ContentItem>) {
    if (!this.courseContents[courseId]) return null;
    
    const courseContent = this.courseContents[courseId];
    const sectionIndex = courseContent.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return null;
    
    const itemIndex = courseContent.sections[sectionIndex].items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return null;
    
    courseContent.sections[sectionIndex].items[itemIndex] = {
      ...courseContent.sections[sectionIndex].items[itemIndex],
      ...updates
    };
    
    return courseContent.sections[sectionIndex].items[itemIndex];
  }

  deleteContentItem(courseId: string, sectionId: string, itemId: string) {
    if (!this.courseContents[courseId]) return false;
    
    const courseContent = this.courseContents[courseId];
    const sectionIndex = courseContent.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return false;
    
    const itemIndex = courseContent.sections[sectionIndex].items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return false;
    
    courseContent.sections[sectionIndex].items.splice(itemIndex, 1);
    
    return true;
  }

  // User methods
  getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  // Progress tracking
  updateLessonProgress(data: { courseId: string, lessonId: string, completed: boolean }) {
    const courseContent = this.courseContents[data.courseId];
    if (!courseContent) return false;
    
    // Find the item in any section
    for (const section of courseContent.sections) {
      const itemIndex = section.items.findIndex(item => item.id === data.lessonId);
      if (itemIndex >= 0) {
        section.items[itemIndex].isCompleted = data.completed;
        
        // Recalculate progress
        this.recalculateCourseProgress(data.courseId);
        return true;
      }
    }
    
    return false;
  }

  recalculateCourseProgress(courseId: string) {
    const courseContent = this.courseContents[courseId];
    if (!courseContent) return;
    
    let totalItems = 0;
    let completedItems = 0;
    
    for (const section of courseContent.sections) {
      for (const item of section.items) {
        totalItems++;
        if (item.isCompleted) completedItems++;
      }
    }
    
    courseContent.progress = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;
  }
}

// Create a singleton instance
const mockDB = new MockDatabase();

// Create a hook for persistence in the React app
export function useMockDB() {
  const [db] = useState(mockDB);
  return db;
}

// Export API methods
export const mockApi = {
  // Courses
  getCourses: () => Promise.resolve(mockDB.getCourses()),
  getCourse: (slug: string) => Promise.resolve(mockDB.getCourse(slug)),
  getCourseById: (id: string) => Promise.resolve(mockDB.getCourseById(id)),
  createCourse: (course: any) => Promise.resolve(mockDB.createCourse(course)),
  updateCourse: (id: string, updates: any) => Promise.resolve(mockDB.updateCourse(id, updates)),
  
  // Course Content
  getCourseContent: (id: string) => Promise.resolve(mockDB.getCourseContent(id)),
  updateCourseContent: (id: string, content: any) => Promise.resolve(mockDB.updateCourseContent(id, content)),
  
  // Sections
  addSection: (courseId: string, section: any) => Promise.resolve(mockDB.addSection(courseId, section)),
  updateSection: (courseId: string, sectionId: string, updates: any) => 
    Promise.resolve(mockDB.updateSection(courseId, sectionId, updates)),
  deleteSection: (courseId: string, sectionId: string) => Promise.resolve(mockDB.deleteSection(courseId, sectionId)),
  
  // Content Items
  addContentItem: (courseId: string, sectionId: string, item: any) => 
    Promise.resolve(mockDB.addContentItem(courseId, sectionId, item)),
  updateContentItem: (courseId: string, sectionId: string, itemId: string, updates: any) => 
    Promise.resolve(mockDB.updateContentItem(courseId, sectionId, itemId, updates)),
  deleteContentItem: (courseId: string, sectionId: string, itemId: string) => 
    Promise.resolve(mockDB.deleteContentItem(courseId, sectionId, itemId)),
  
  // User Progress
  updateLessonProgress: (data: { courseId: string, lessonId: string, completed: boolean }) => 
    Promise.resolve(mockDB.updateLessonProgress(data)),
  markCourseComplete: (courseId: string) => {
    const courseContent = mockDB.getCourseContent(courseId);
    if (courseContent) {
      // Mark all items as completed
      courseContent.sections.forEach(section => {
        section.items.forEach(item => {
          item.isCompleted = true;
        });
      });
      courseContent.progress = 100;
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Course not found'));
  },
  
  // Authentication (simplified)
  login: (email: string, password: string) => {
    const user = mockDB.getUserByEmail(email);
    if (user && password === 'password') {
      return Promise.resolve({
        user,
        token: 'mock-token'
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },
  
  // Admin Auth
  adminLogin: (email: string, password: string) => {
    if (email === 'admin@example.com' && password === 'admin123') {
      return Promise.resolve({
        user: {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        },
        token: 'admin-mock-token'
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  // Contact form submission
  submitContact: (data: { name: string; email: string; message: string }) => {
    console.log('Contact form submission:', {
      ...data,
      recipientEmail: 'info@mic3solutiongroup.com',
      timestamp: new Date().toISOString()
    });
    // In a real implementation, this would send an email to info@mic3solutiongroup.com
    return Promise.resolve({ success: true, message: 'Thank you for your message! We will respond shortly.' });
  }
};
