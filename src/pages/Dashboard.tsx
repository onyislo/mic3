import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Clock, Play, TrendingUp, Search, ChevronRight, Medal, Zap, Star, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserCourseProgress, 
  getUserBadges, 
  getCourses, 
  getCourseById 
} from '../services/supabaseService';

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

interface UserCourse {
  id: string;
  slug: string;
  title: string;
  progress: number;
  lastAccessed: string;
  image: string;
  totalLessons: number;
  completedLessons: number;
  category: string;
  instructor: string;
  badgeEarned: Badge | null;
}

interface Badge {
  name: string;
  image: string;
  earnedDate: string;
}

interface Activity {
  type: string;
  title: string;
  course: string;
  date: string;
  icon: React.ElementType;
}

interface Stat {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  // const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<UserCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  
  // Load user's courses and progress data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
  try {
        
        // Fetch courses progress for the user
        const progressData = await getUserCourseProgress(user.id);
        
        // Fetch all available courses
        const allCourses = await getCourses();
        
        // Fetch user badges
        const userBadgesData = await getUserBadges(user.id);
        
        // Create purchased courses array with progress information
        const userCourses = await Promise.all(
          progressData.map(async (progress) => {
            // Get course details
            const courseId = progress.course_id;
            const course = await getCourseById(courseId);
            if (!course || !course["Course Title"] || course["Course Title"].trim().toLowerCase() === 'untitled course') return null;
            // Find badge if course is completed
            const badgeData = userBadgesData.find(
              (b) => b.userBadge.badge_id === course.badge_id
            );
            const badge = badgeData ? {
              name: badgeData.badge.name,
              image: badgeData.badge["Course Image"],
              earnedDate: badgeData.userBadge.earned_date,
            } : null;
            return {
              id: course.id,
              slug: course.slug,
              title: course["Course Title"],
              progress: progress.progress_percentage || 0,
              lastAccessed: getTimeAgo(progress.last_accessed_at),
              image: course["Course Image"],
              totalLessons: course.total_lessons || 0,
              completedLessons: Math.round((progress.progress_percentage / 100) * (course.total_lessons || 0)),
              category: course.category,
              instructor: course.Instructor,
              badgeEarned: badge,
            };
          })
        );
        // Filter out null values and courses with missing or 'Untitled Course' titles
        const validUserCourses = userCourses
          .filter((c): c is UserCourse => !!c && c.title && c.title.trim().toLowerCase() !== 'untitled course')
          .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
        setPurchasedCourses(validUserCourses);
        // Set available courses (excluding purchased ones and untitled/mocked)
        const userCourseIds = validUserCourses.map(c => c.id);
        const availableCoursesList = allCourses
          .filter(course => course["Course Title"] && course["Course Title"].trim().toLowerCase() !== 'untitled course' && !userCourseIds.includes(course.id))
          .map(course => ({
            id: course.id,
            slug: course.slug,
            title: course["Course Title"],
            description: course.Description,
            price: course.Price,
            duration: course.Duration,
            students: course.enrolled_count,
            rating: course.average_rating,
            instructor: course.Instructor,
            image: course["Course Image"],
            category: course.Category,
          }));
        setAvailableCourses(availableCoursesList);
        // Set recommended courses (first few available courses)
        
        // Generate stats
        const calculatedStats = [
          {
            icon: BookOpen,
            label: 'Courses Enrolled',
            value: validUserCourses.length,
            color: 'text-primary',
          },
          // Certificates Earned stat removed
          {
            icon: Clock,
            label: 'Hours Learned',
            value: Math.round(validUserCourses.reduce((acc, course) => 
              acc + (course.completedLessons * 15 / 60), 0)), // Assuming 15 min per lesson
            color: 'text-green-400',
          },
          {
            icon: TrendingUp,
            label: 'Average Progress',
            value: validUserCourses.length ? 
              Math.round(validUserCourses.reduce((acc, course) => acc + course.progress, 0) / validUserCourses.length) + '%' : 
              '0%',
            color: 'text-blue-400',
          },
        ];
        
        setStats(calculatedStats);
        
        // Generate recent activities based on course progress
        const activities = [];
        
        for (const course of validUserCourses) {
          if (course.progress > 0) {
            activities.push({
              type: 'lesson_completed',
              title: `${course.completedLessons} lessons completed`,
              course: course.title,
              date: course.lastAccessed,
              icon: FileText,
            });
          } else {
            activities.push({
              type: 'course_started',
              title: course.title,
              course: course.title,
              date: course.lastAccessed,
              icon: Play,
            });
          }
        }
        
        setRecentActivities(activities.slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Helper function for time formatting
  function getTimeAgo(dateString: string): string {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }

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
                                to={`/courses/${course.id}/content`}
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

                {/* Available Courses Section (shows all available courses on dashboard) */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Available Courses</h2>
                    {/* View all button removed as requested */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableCourses.length === 0 ? (
                      <div className="col-span-2 text-center text-text-muted">No available courses found.</div>
                    ) : (
                      availableCourses.slice(0, 4).map((course) => (
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
                              <div className="text-primary font-semibold">KSh {course.price?.toLocaleString?.() ?? course.price}</div>
                              <div className="text-text-muted text-sm">{course.duration}</div>
                            </div>
                            <Link
                              to={`/courses/${course.id}`}
                              className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
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
                  {/* Recent Activities */}
                  <div className="mt-4">
                    {recentActivities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-start mb-2">
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
                                {/* Completed badge removed */}
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
                              to={`/courses/${course.id}/content`}
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
                            
                            {/* View Certificate button removed */}
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
                          to={`/courses/${course.id}`}
                          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No courses found message removed as requested */}

              <div className="mt-8 text-center">
                {/* View All Courses link removed as requested */}
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
                {/* Certificates Earned stat card removed */}
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

              {/* Certificates Section removed as requested */}

              {/* Progress Goals Section removed as requested */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};