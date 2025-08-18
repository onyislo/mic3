import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Award, Clock, Play, TrendingUp, Search, ChevronRight, Medal, Gift, Zap, Gift as GiftIcon, Bookmark, Bell, Star, Tag, FileText, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // Mock data for purchased courses
  const purchasedCourses = [
    {
      id: '1',
      slug: 'react-masterclass',
      title: 'React Masterclass',
      progress: 65,
      lastAccessed: '2 days ago',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      totalLessons: 45,
      completedLessons: 29,
      category: 'Frontend',
      instructor: 'John Doe',
      badgeEarned: null,
    },
    {
      id: '2',
      slug: 'nodejs-backend',
      title: 'Node.js Backend Development',
      progress: 30,
      lastAccessed: '1 week ago',
      image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400',
      totalLessons: 38,
      completedLessons: 11,
      category: 'Backend',
      instructor: 'Jane Smith',
      badgeEarned: null,
    },
    {
      id: '3',
      slug: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      progress: 100,
      lastAccessed: '1 month ago',
      image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
      totalLessons: 32,
      completedLessons: 32,
      category: 'Programming',
      instructor: 'Alex Johnson',
      badgeEarned: {
        name: 'JavaScript Master',
        image: 'https://img.icons8.com/color/96/000000/javascript--v1.png',
        earnedDate: '2025-07-15',
      },
    },
  ];

  // Mock data for available courses
  const availableCourses = [
    {
      id: '4',
      slug: 'python-for-beginners',
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python, one of the most popular languages.',
      price: 1800,
      duration: '8 weeks',
      students: 2300,
      rating: 4.7,
      instructor: 'Michael Scott',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Programming',
    },
    {
      id: '5',
      slug: 'web-design-fundamentals',
      title: 'Web Design Fundamentals',
      description: 'Learn the principles of modern web design and create beautiful websites.',
      price: 2100,
      duration: '6 weeks',
      students: 1650,
      rating: 4.8,
      instructor: 'Emma Wilson',
      image: 'https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Design',
    },
    {
      id: '6',
      slug: 'devops-ci-cd',
      title: 'DevOps CI/CD Pipeline',
      description: 'Master continuous integration and deployment with modern DevOps tools.',
      price: 3200,
      duration: '10 weeks',
      students: 850,
      rating: 4.9,
      instructor: 'David Lee',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'DevOps',
    },
  ];

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses Enrolled',
      value: purchasedCourses.length,
      color: 'text-primary',
    },
    {
      icon: Award,
      label: 'Certificates Earned',
      value: purchasedCourses.filter(course => course.badgeEarned).length,
      color: 'text-yellow-400',
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: 47,
      color: 'text-green-400',
    },
    {
      icon: TrendingUp,
      label: 'Average Progress',
      value: purchasedCourses.length ? 
        Math.round(purchasedCourses.reduce((acc, course) => acc + course.progress, 0) / purchasedCourses.length) + '%' : 
        '0%',
      color: 'text-blue-400',
    },
  ];

  // Recent activity data
  const recentActivities = [
    {
      type: 'lesson_completed',
      title: 'JSX and Components',
      course: 'React Masterclass',
      date: '2 days ago',
      icon: FileText,
    },
    {
      type: 'course_started',
      title: 'Node.js Backend Development',
      course: 'Node.js Backend Development',
      date: '1 week ago',
      icon: Play,
    },
    {
      type: 'certificate_earned',
      title: 'JavaScript Master',
      course: 'JavaScript Fundamentals',
      date: '1 month ago',
      icon: Award,
    },
    {
      type: 'quiz_passed',
      title: 'React Component Basics',
      course: 'React Masterclass',
      date: '3 days ago',
      icon: UserCheck,
    },
  ];

  // Get recommended courses
  useEffect(() => {
    // In a real app, you would fetch this from an API based on user preferences
    setRecommendedCourses(availableCourses);
    setLoading(false);
  }, []);

  // Filter courses by search term
  const filteredCourses = availableCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-dark text-text-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-text-muted">Continue your learning journey</p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-primary text-white' 
                : 'bg-bg-dark-light text-text-muted hover:text-text-light'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('my-courses')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'my-courses' 
                ? 'bg-primary text-white' 
                : 'bg-bg-dark-light text-text-muted hover:text-text-light'
            }`}
          >
            My Courses
          </button>
          <button 
            onClick={() => setActiveTab('find-courses')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'find-courses' 
                ? 'bg-primary text-white' 
                : 'bg-bg-dark-light text-text-muted hover:text-text-light'
            }`}
          >
            Find Courses
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'achievements' 
                ? 'bg-primary text-white' 
                : 'bg-bg-dark-light text-text-muted hover:text-text-light'
            }`}
          >
            My Achievements
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
                  <div className="flex items-center">
                    <stat.icon className={`h-8 w-8 ${stat.color} mr-3`} />
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-text-muted text-sm">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* In Progress Courses Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Continue Learning</h2>
                    <Link to="#" onClick={() => setActiveTab('my-courses')} className="text-primary hover:text-primary-dark flex items-center">
                      View all <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  {purchasedCourses.filter(course => course.progress > 0 && course.progress < 100).length > 0 ? (
                    <div className="space-y-6">
                      {purchasedCourses
                        .filter(course => course.progress > 0 && course.progress < 100)
                        .slice(0, 2)
                        .map((course) => (
                        <div key={course.id} className="bg-bg-dark-light rounded-lg overflow-hidden border border-primary/20">
                          <div className="flex flex-col sm:flex-row">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full sm:w-48 h-32 object-cover"
                            />
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                  <p className="text-text-muted text-sm">
                                    {course.completedLessons} of {course.totalLessons} lessons completed
                                  </p>
                                </div>
                                <span className="text-sm text-text-muted">
                                  Last accessed {course.lastAccessed}
                                </span>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Progress</span>
                                  <span className="text-sm text-primary">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-bg-dark rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <Link
                                to={`/courses/${course.slug}/content`}
                                className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Continue Learning
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-bg-dark-light rounded-lg border border-primary/20">
                      <BookOpen className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">No courses in progress</h3>
                      <p className="text-text-muted mb-4">
                        Start learning today by exploring our course catalog
                      </p>
                      <button 
                        onClick={() => setActiveTab('find-courses')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Find Courses
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommended Courses Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Recommended for You</h2>
                    <button 
                      onClick={() => setActiveTab('find-courses')}
                      className="text-primary hover:text-primary-dark flex items-center"
                    >
                      View all <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendedCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="bg-bg-dark-light rounded-lg overflow-hidden border border-primary/20 hover:shadow-lg transition-shadow">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-primary font-medium">{course.category}</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-text-muted">{course.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                          <p className="text-text-muted text-sm mb-4 line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-primary font-semibold">KSh {course.price.toLocaleString()}</div>
                            <div className="text-text-muted text-sm">{course.duration}</div>
                          </div>
                          
                          <Link
                            to={`/courses/${course.slug}`}
                            className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Profile</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-text-muted text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <button className="w-full bg-bg-dark hover:bg-primary/20 text-text-light py-2 px-4 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                </div>

                <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-3 mt-1 p-2 bg-bg-dark rounded-full">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm">
                          <p className="text-text-muted">{activity.type.replace('_', ' ')}</p>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-xs text-text-muted">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Badge Section - if user has any badges */}
                {purchasedCourses.some(course => course.badgeEarned) && (
                  <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-4">Latest Achievement</h3>
                    {(() => {
                      const courseWithBadge = purchasedCourses.find(course => course.badgeEarned);
                      if (courseWithBadge && courseWithBadge.badgeEarned) {
                        return (
                          <div className="text-center">
                            <div className="mb-3 flex justify-center">
                              <img 
                                src={courseWithBadge.badgeEarned.image} 
                                alt={courseWithBadge.badgeEarned.name} 
                                className="w-24 h-24"
                              />
                            </div>
                            <h4 className="text-xl font-bold mb-1 text-yellow-400">
                              {courseWithBadge.badgeEarned.name}
                            </h4>
                            <p className="text-text-muted text-sm mb-3">
                              Earned on {new Date(courseWithBadge.badgeEarned.earnedDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              For completing <span className="font-medium">{courseWithBadge.title}</span>
                            </p>
                            <button
                              onClick={() => setActiveTab('achievements')}
                              className="mt-4 text-primary hover:underline text-sm"
                            >
                              View all achievements
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* MY COURSES TAB */}
        {activeTab === 'my-courses' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Enrolled Courses</h2>
              
              {purchasedCourses.length > 0 ? (
                <div className="space-y-6">
                  {purchasedCourses.map((course) => (
                    <div key={course.id} className="bg-bg-dark-light rounded-lg overflow-hidden border border-primary/20">
                      <div className="flex flex-col md:flex-row">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full md:w-64 h-48 md:h-auto object-cover"
                        />
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded mr-2">
                                  {course.category}
                                </span>
                                {course.badgeEarned && (
                                  <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                                    <Award className="h-3 w-3 mr-1" /> Completed
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                              <p className="text-text-muted text-sm mb-2">
                                Instructor: {course.instructor}
                              </p>
                              <p className="text-text-muted text-sm">
                                {course.completedLessons} of {course.totalLessons} lessons completed
                              </p>
                            </div>
                            <span className="text-sm text-text-muted mt-2 md:mt-0">
                              Last accessed {course.lastAccessed}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-primary">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-bg-dark rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  course.progress === 100 ? 'bg-green-500' : 'bg-primary'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <Link
                              to={`/courses/${course.slug}/content`}
                              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              {course.progress === 100 ? (
                                <>
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Review Course
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue Learning
                                </>
                              )}
                            </Link>
                            
                            {course.badgeEarned && (
                              <button className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                <Award className="h-4 w-4 mr-2" />
                                View Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-bg-dark-light rounded-lg border border-primary/20">
                  <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                  <p className="text-text-muted mb-4">
                    Start your learning journey by exploring our course catalog
                  </p>
                  <button
                    onClick={() => setActiveTab('find-courses')}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* FIND COURSES TAB */}
        {activeTab === 'find-courses' && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Explore Courses</h2>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="bg-bg-dark-light rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-primary/10 hover:border-primary/30">
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
                      <p className="text-text-muted mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center justify-between mb-4 text-sm text-text-muted">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {course.students} students
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">KSh {course.price.toLocaleString()}</span>
                        <Link
                          to={`/courses/${course.slug}`}
                          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12 bg-bg-dark-light rounded-lg border border-primary/20">
                  <Search className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-text-muted">
                    Try a different search term or browse all courses
                  </p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center bg-bg-dark-light hover:bg-primary/20 text-text-light px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View All Courses <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
                  <div className="flex items-center">
                    <Award className="h-10 w-10 text-yellow-400 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">
                        {purchasedCourses.filter(course => course.badgeEarned).length}
                      </p>
                      <p className="text-text-muted text-sm">Certificates Earned</p>
                    </div>
                  </div>
                </div>
                <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
                  <div className="flex items-center">
                    <Medal className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.floor(purchasedCourses.reduce((acc, course) => acc + course.completedLessons, 0) / 10)}
                      </p>
                      <p className="text-text-muted text-sm">Badges Collected</p>
                    </div>
                  </div>
                </div>
                <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
                  <div className="flex items-center">
                    <Zap className="h-10 w-10 text-green-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">
                        {purchasedCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
                      </p>
                      <p className="text-text-muted text-sm">Lessons Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificates Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Your Certificates</h3>
                
                {purchasedCourses.some(course => course.badgeEarned) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedCourses
                      .filter(course => course.badgeEarned)
                      .map((course) => (
                        <div key={course.id} className="bg-bg-dark-light rounded-lg overflow-hidden border border-primary/20 p-6 text-center">
                          {course.badgeEarned && (
                            <>
                              <div className="mb-4">
                                <img
                                  src={course.badgeEarned.image}
                                  alt={course.badgeEarned.name}
                                  className="w-24 h-24 mx-auto"
                                />
                              </div>
                              <h4 className="text-xl font-bold mb-1 text-yellow-400">
                                {course.badgeEarned.name}
                              </h4>
                              <p className="text-text-muted text-sm mb-3">
                                Earned on {new Date(course.badgeEarned.earnedDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm mb-4">
                                For completing <span className="font-medium">{course.title}</span>
                              </p>
                              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center">
                                <Award className="h-4 w-4 mr-2" />
                                View Certificate
                              </button>
                            </>
                          )}
                        </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-bg-dark-light rounded-lg border border-primary/20">
                    <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
                    <p className="text-text-muted mb-4">
                      Complete courses to earn certificates and showcase your skills
                    </p>
                    <button
                      onClick={() => setActiveTab('my-courses')}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Go to My Courses
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Goals Section */}
              <div>
                <h3 className="text-xl font-bold mb-4">Learning Goals</h3>
                
                <div className="bg-bg-dark-light rounded-lg overflow-hidden border border-primary/20 p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Weekly Learning Goal</span>
                      <span className="text-primary">3 of 5 hours</span>
                    </div>
                    <div className="w-full bg-bg-dark rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Course Completion Goal</span>
                      <span className="text-green-500">1 of 3 courses</span>
                    </div>
                    <div className="w-full bg-bg-dark rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};