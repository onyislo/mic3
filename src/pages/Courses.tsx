import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Search } from 'lucide-react';
import { api } from '../services/api';

interface Course {
  id: string;
  slug: string;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for demo
  const mockCourses: Course[] = [
    {
      id: '1',
      slug: 'react-masterclass',
      title: 'React Masterclass',
      description: 'Learn React from beginner to advanced level with real-world projects.',
      price: 2500,
      duration: '12 weeks',
      students: 1200,
      rating: 4.8,
      instructor: 'John Doe',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Frontend',
    },
    {
      id: '2',
      slug: 'nodejs-backend',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
      price: 3000,
      duration: '10 weeks',
      students: 850,
      rating: 4.7,
      instructor: 'Jane Smith',
      image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Backend',
    },
    {
      id: '3',
      slug: 'mobile-app-development',
      title: 'Mobile App Development',
      description: 'Create mobile apps for iOS and Android using React Native.',
      price: 3500,
      duration: '14 weeks',
      students: 650,
      rating: 4.9,
      instructor: 'Mike Johnson',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Mobile',
    },
    {
      id: '4',
      slug: 'ui-ux-design',
      title: 'UI/UX Design Fundamentals',
      description: 'Master the principles of user interface and user experience design.',
      price: 2000,
      duration: '8 weeks',
      students: 950,
      rating: 4.6,
      instructor: 'Sarah Wilson',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Design',
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Try to fetch from API first
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        // Fall back to mock data if API fails
        console.log('Using mock data for courses');
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ['all', ...Array.from(new Set(mockCourses.map(course => course.category)))];

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
          <div className="flex gap-2">
            {categories.map((category) => (
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
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
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
                    to={`/courses/${course.slug}`}
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