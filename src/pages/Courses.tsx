import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Search } from 'lucide-react';
import { api } from '../services/api';
import { Course as CourseType } from '../types/CourseTypes';

// A display-friendly interface for rendering courses
interface DisplayCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  instructor: string;
  image: string;
  category: string;
}

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Try to fetch from API
        const data = await api.getCourses();
        
        // Map the Supabase course structure to our display structure
        // Properly type the data from API
        const apiData = data as CourseType[];
        const displayCourses: DisplayCourse[] = apiData.map((course) => {
          console.log("Course from API:", course);
          return {
            id: course.id,
            title: course["Course Title"] || "",
            description: course["Description"] || "",
            price: course["Price"] || 0,
            duration: course.duration || "8 weeks",
            students: 0, // We don't have this data yet
            rating: 5.0, // Default rating
            instructor: course["Instructor"] || "Instructor",
            image: course["Course Image"] || "",  // Don't use a default here, let the onError handler handle it
            category: course.category || "General"
          };
        });
        
        // Only use active courses
        const activeCourses = displayCourses.filter(course => 
          course.title && course.description && course.price > 0
        );
        
        setCourses(activeCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Extract categories from actual courses
  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-text-light">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Courses</h1>
          <p className="text-xl text-text-muted">
            Discover our comprehensive collection of courses designed to help you master new skills.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-bg-dark-light text-text-muted hover:text-text-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-bg-dark-light rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Hide the image if it fails to load
                    console.log("Image load error for course:", course.title);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-bg-dark-light flex items-center justify-center">
                  <span className="text-text-muted">No image available</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary font-medium">{course.category}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-text-muted">{course.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-text-muted mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-text-muted">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students} students
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">KSh {course.price.toLocaleString()}</span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Course
                  </Link>
                </div>
                
                <div className="mt-4 text-sm text-text-muted">
                  Instructor: {course.instructor}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};