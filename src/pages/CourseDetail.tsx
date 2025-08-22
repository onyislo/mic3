import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, Play, BookOpen, Award, Smartphone } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Course as CourseType } from '../types/CourseTypes';

// Display-specific course interface with UI-friendly structure
interface DisplayCourse {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  instructor: string;
  image: string;
  category: string;
  lessons: number;
  features: string[];
  requirements: string[];
  whatYoullLearn: string[];
}

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<DisplayCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const fetchedData = await api.getCourse(courseId);
          
          // Map the database course structure to our display structure
          if (fetchedData) {
            const dbCourse = fetchedData as CourseType;
            
            const displayCourse: DisplayCourse = {
              id: dbCourse.id,
              title: dbCourse["Course Title"] || "Course Title",
              description: dbCourse["Description"] || "Course Description",
              fullDescription: dbCourse["Description"] || "This is a comprehensive course to help you master new skills.",
              price: dbCourse["Price"] || 0,
              duration: dbCourse.duration || "8 weeks",
              students: 0, // Default value since it's not in our database yet
              rating: 5.0, // Default value since it's not in our database yet
              instructor: dbCourse["Instructor"] || "Expert Instructor",
              image: dbCourse.image_url || "",
              category: dbCourse.category || "General",
              lessons: 10, // Default value
              // Default values for arrays since they're not in our database yet
              features: [
                'Lifetime access to course content', 
                'Certificate of completion', 
                'Personalized feedback'
              ],
              requirements: [
                'Basic understanding of the subject', 
                'Dedication to learn'
              ],
              whatYoullLearn: [
                'Master the fundamentals',
                'Apply knowledge in real-world scenarios',
                'Build your own projects'
              ]
            };
            setCourse(displayCourse);
          }
        }
      } catch (fetchError) {
        console.error('Error fetching course:', fetchError);
        // Fall back to mock data
        const mockCourse: DisplayCourse = {
          id: '1',
          title: 'React Masterclass',
          description: 'Learn React from beginner to advanced level with real-world projects.',
          fullDescription: 'This comprehensive React course will take you from a complete beginner to an advanced React developer.',
          price: 2500,
          duration: '12 weeks',
          students: 1200,
          rating: 4.8,
          instructor: 'John Doe',
          image: '',
          category: 'Frontend',
          lessons: 45,
          features: ['Lifetime access to course content', 'Certificate of completion'],
          requirements: ['Basic knowledge of HTML, CSS, and JavaScript'],
          whatYoullLearn: ['React fundamentals and JSX', 'Component lifecycle and hooks'],
        };
        setCourse(mockCourse);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !phoneNumber) return;

    setPaymentLoading(true);
    try {
      await api.initiateMpesaPayment({
        courseId: course.id,
        phoneNumber,
        amount: course.price,
      });
      alert('Payment initiated! Please check your phone for the M-Pesa prompt.');
      setShowPaymentForm(false);
      setPhoneNumber('');
    } catch (paymentError) {
      console.error('Payment error:', paymentError);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const hasPurchased = user?.purchasedCourses?.includes(course?.id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-text-light">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-text-light">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-primary font-medium">{course.category}</span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{course.title}</h1>
              <p className="text-xl text-text-muted">{course.description}</p>
            </div>

            <div className="flex items-center gap-6 mb-8 text-sm text-text-muted">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{course.rating} ({course.students} students)</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-1" />
                <span>{course.lessons} lessons</span>
              </div>
            </div>

            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
                onError={(e) => {
                  // Hide the image if it fails to load
                  console.log("Image load error in course detail for:", course.title);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-bg-dark-light flex items-center justify-center rounded-lg mb-8">
                <span className="text-text-muted">No course image available</span>
              </div>
            )}

            {/* Course Tabs */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-text-muted leading-relaxed">{course.fullDescription}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYoullLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-text-muted">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Course Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-text-muted">
                      <Play className="h-5 w-5 text-primary mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-bg-dark-light p-6 rounded-lg sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  KSh {course.price.toLocaleString()}
                </div>
                <p className="text-text-muted">One-time payment</p>
              </div>

              {hasPurchased ? (
                <Link
                  to={`/courses/${course.id}/content`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
                >
                  Access Course Content
                </Link>
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold mb-4 transition-colors flex items-center justify-center"
                  >
                    <Smartphone className="h-5 w-5 mr-2" />
                    Buy with M-Pesa
                  </button>

                  {showPaymentForm && (
                    <form onSubmit={handleMpesaPayment} className="space-y-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          M-Pesa Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="254XXXXXXXXX"
                          className="w-full px-3 py-2 bg-bg-dark border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={paymentLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {paymentLoading ? 'Processing...' : 'Pay Now'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
                  >
                    Login to Purchase
                  </Link>
                  <p className="text-center text-text-muted text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Students enrolled:</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Lessons:</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Instructor:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};