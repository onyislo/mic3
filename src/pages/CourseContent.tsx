import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Play, BookOpen, CheckCircle, Lock, Award, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  videoUrl?: string;
  content: string;
}

interface CourseContent {
  id: string;
  title: string;
  lessons: Lesson[];
  progress: number;
}

export const CourseContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [completedBadge, setCompletedBadge] = useState<{
    name: string;
    image: string;
    description: string;
  } | null>(null);

  // Mock course content
  const mockContent: CourseContent = {
    id: '1',
    title: 'React Masterclass',
    progress: 35,
    lessons: [
      {
        id: '1',
        title: 'Introduction to React',
        duration: '15 min',
        isCompleted: true,
        content: 'Welcome to the React Masterclass! In this lesson, we\'ll cover what React is, why it\'s popular, and what you\'ll learn throughout this course.',
      },
      {
        id: '2',
        title: 'Setting up Development Environment',
        duration: '20 min',
        isCompleted: true,
        content: 'Learn how to set up your development environment with Node.js, npm, and create-react-app.',
      },
      {
        id: '3',
        title: 'JSX and Components',
        duration: '25 min',
        isCompleted: false,
        content: 'Understand JSX syntax and how to create your first React components.',
      },
      {
        id: '4',
        title: 'Props and State',
        duration: '30 min',
        isCompleted: false,
        content: 'Learn about props for component communication and state for managing component data.',
      },
      {
        id: '5',
        title: 'Event Handling',
        duration: '18 min',
        isCompleted: false,
        content: 'Master event handling in React components and understand synthetic events.',
      },
    ],
  };

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        if (slug) {
          // Extract course ID from slug or use slug directly
          const courseId = '1'; // In real app, you'd get this from course data
          const data = await api.getCourseContent(courseId);
          setContent(data);
        }
      } catch (err) {
        // Fall back to mock data
        setContent(mockContent);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [slug]);

  // Check if user has purchased this course
  const hasPurchased = user?.purchasedCourses?.includes(content?.id || '');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPurchased && !loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-light flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Purchased</h2>
          <p className="text-text-muted mb-4">
            You need to purchase this course to access the content.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-text-light">Loading course content...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-text-light">Course content not found</div>
      </div>
    );
  }

  const selectedLesson = currentLesson || content.lessons[0];

  const handleMarkAsComplete = async () => {
    if (!content || !selectedLesson) return;
    
    try {
      // Create a copy of the lessons array
      const updatedLessons = content.lessons.map(lesson => {
        if (lesson.id === selectedLesson.id) {
          return { ...lesson, isCompleted: true };
        }
        return lesson;
      });
      
      // Calculate the new progress percentage
      const completedLessons = updatedLessons.filter(l => l.isCompleted).length;
      const totalLessons = updatedLessons.length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);
      
      // Update the local state
      setContent({
        ...content,
        lessons: updatedLessons,
        progress: newProgress
      });

      // Send the update to the API
      await api.updateLessonProgress({
        courseId: content.id,
        lessonId: selectedLesson.id,
        completed: true
      });

      // Check if the course is now complete
      if (newProgress === 100) {
        await api.markCourseComplete(content.id);
        
        // Show badge completion modal
        setCompletedBadge({
          name: `${content.title} Master`,
          image: 'https://img.icons8.com/color/96/000000/prize.png',
          description: `Congratulations on completing the ${content.title} course!`
        });
        setShowBadgeModal(true);
      }

      // Move to the next lesson if not the last one
      const currentIndex = content.lessons.findIndex(l => l.id === selectedLesson.id);
      if (currentIndex < content.lessons.length - 1) {
        setCurrentLesson(content.lessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-light">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Lessons List */}
        <div className="w-full md:w-80 bg-bg-dark-light border-r border-primary/20 md:h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{content.title}</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-muted">Progress</span>
                <span className={content.progress === 100 ? "text-green-500" : "text-primary"}>
                  {content.progress}%
                </span>
              </div>
              <div className="w-full bg-bg-dark rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    content.progress === 100 ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${content.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-2 px-4 pb-4 md:pb-0">
            {content.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedLesson.id === lesson.id
                    ? 'bg-primary/20 border-l-4 border-primary'
                    : 'hover:bg-bg-dark/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Lesson {index + 1}</span>
                  {lesson.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-4 w-4 text-text-muted" />
                  )}
                </div>
                <h3 className="font-medium mb-1">{lesson.title}</h3>
                <span className="text-sm text-text-muted">{lesson.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
              <div className="flex items-center text-text-muted">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{selectedLesson.duration}</span>
              </div>
            </div>

            {/* Video Player Placeholder */}
            <div className="bg-bg-dark-light rounded-lg mb-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-text-muted">Video Player</p>
                <p className="text-sm text-text-muted mt-2">
                  In a real application, this would be a video player component
                </p>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-invert max-w-none">
              <div className="bg-bg-dark-light p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Lesson Notes</h3>
                <p className="text-text-muted leading-relaxed">{selectedLesson.content}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-4 justify-between mt-8">
              <button
                onClick={() => {
                  const currentIndex = content.lessons.findIndex(l => l.id === selectedLesson.id);
                  if (currentIndex > 0) {
                    setCurrentLesson(content.lessons[currentIndex - 1]);
                  }
                }}
                disabled={content.lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                className="bg-bg-dark-light hover:bg-primary/20 text-text-light px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Lesson
              </button>

              <div className="flex gap-4">
                {!selectedLesson.isCompleted && (
                  <button
                    onClick={handleMarkAsComplete}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Complete
                  </button>
                )}

                <button
                  onClick={() => {
                    const currentIndex = content.lessons.findIndex(l => l.id === selectedLesson.id);
                    if (currentIndex < content.lessons.length - 1) {
                      setCurrentLesson(content.lessons[currentIndex + 1]);
                    }
                  }}
                  disabled={content.lessons.findIndex(l => l.id === selectedLesson.id) === content.lessons.length - 1}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Earned Modal */}
      {showBadgeModal && completedBadge && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-bg-dark-light p-8 rounded-xl max-w-md w-full text-center relative">
            <button 
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-light"
            >
              ✕
            </button>
            <div className="mb-4">
              <img src={completedBadge.image} alt={completedBadge.name} className="w-32 h-32 mx-auto" />
            </div>
            <div className="py-4">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                Congratulations!
              </h3>
              <h4 className="text-xl font-bold mb-3">
                You earned the {completedBadge.name} badge
              </h4>
              <p className="text-text-muted mb-6">
                {completedBadge.description}
              </p>
              <button
                onClick={() => setShowBadgeModal(false)}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};