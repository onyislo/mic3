import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Play, FileText, BookOpen, CheckCircle, Download, ExternalLink, Lock } from 'lucide-react';
import { api } from '../services';
import { useAuth } from '../contexts/AuthContext';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  url?: string;
  duration?: number;
  fileSize?: number;
  isCompleted: boolean;
  order: number;
}

interface CourseSection {
  id: string;
  title: string;
  items: ContentItem[];
  order: number;
}

interface CourseContent {
  id: string;
  title: string;
  sections: CourseSection[];
  progress: number;
}

export const CourseContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [completedBadge, setCompletedBadge] = useState<{
    name: string;
    image: string;
    description: string;
  } | null>(null);

  // Mock course content
  const mockContent = useMemo<CourseContent>(() => ({
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
  }), []);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        if (slug) {
          // Extract course ID from slug or use slug directly
          const courseId = '1'; // In real app, you'd get this from course data
          const data = await api.getCourseContent(courseId);
          // Type assertion since we know the structure of the returned data
          setContent(data as CourseContent);
        }
      } catch (error) {
        // Fall back to mock data
        console.error("Failed to fetch course content:", error);
        setContent(mockContent);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [slug, mockContent]);

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

  // Get currently selected section and item
  const getCurrentContent = () => {
    if (!content || content.sections.length === 0) return null;
    
    const section = content.sections[currentSection];
    if (!section || section.items.length === 0) return null;
    
    return {
      section,
      item: section.items[currentItem] || section.items[0]
    };
  };

  const currentContent = getCurrentContent();
  
  // Calculate total items and completed items
  const getTotalProgress = () => {
    if (!content) return { total: 0, completed: 0 };
    
    let total = 0;
    let completed = 0;
    
    content.sections.forEach(section => {
      section.items.forEach(item => {
        total++;
        if (item.isCompleted) completed++;
      });
    });
    
    return { total, completed };
  };

  const handleMarkAsComplete = async () => {
    if (!content || !currentContent) return;
    
    try {
      const { section, item } = currentContent;
      
      // Create a copy of the sections array
      const updatedSections = content.sections.map(s => {
        if (s.id === section.id) {
          return {
            ...s,
            items: s.items.map(i => {
              if (i.id === item.id) {
                return { ...i, isCompleted: true };
              }
              return i;
            })
          };
        }
        return s;
      });
      
      // Calculate the new progress percentage
      const { total, completed } = getTotalProgress();
      const newProgress = total > 0 ? Math.round(((completed + 1) / total) * 100) : 0;
      
      // Update the local state
      setContent({
        ...content,
        sections: updatedSections,
        progress: newProgress
      });

      // Send the update to the API
      await api.updateLessonProgress({
        courseId: content.id,
        lessonId: item.id,
        completed: true
      });

      // Check if the course is now complete
      if (newProgress === 100) {
        await api.markCourseComplete(content.id);
        
        // Show completion alert
        alert(`🎉 Congratulations on completing the ${content.title} course!`);
        
        // Initialize badge data (if we have a badge system)
        const badgeData = {
          name: `${content.title} Master`,
          image: 'https://img.icons8.com/color/96/000000/prize.png',
          description: `Congratulations on completing the ${content.title} course!`
        };
        
        // If we have badge modals set up
        if (typeof setCompletedBadge === 'function' && typeof setShowBadgeModal === 'function') {
          setCompletedBadge(badgeData);
          setShowBadgeModal(true);
        }
      }

      // Navigate to next content if available
      navigateToNextContent();
    } catch (error) {
      console.error('Error updating content progress:', error);
    }
  };
  
  // Navigation functions
  const navigateToPreviousContent = () => {
    if (!content) return;
    
    if (currentItem > 0) {
      // Move to previous item in current section
      setCurrentItem(currentItem - 1);
    } else if (currentSection > 0) {
      // Move to last item of previous section
      setCurrentSection(currentSection - 1);
      const prevSection = content.sections[currentSection - 1];
      setCurrentItem(prevSection.items.length - 1);
    }
  };
  
  const navigateToNextContent = () => {
    if (!content) return;
    
    const section = content.sections[currentSection];
    if (currentItem < section.items.length - 1) {
      // Move to next item in current section
      setCurrentItem(currentItem + 1);
    } else if (currentSection < content.sections.length - 1) {
      // Move to first item of next section
      setCurrentSection(currentSection + 1);
      setCurrentItem(0);
    }
  };
  
  const isFirstContent = currentSection === 0 && currentItem === 0;
  const isLastContent = content && 
    currentSection === content.sections.length - 1 && 
    currentItem === content.sections[currentSection]?.items.length - 1;

  return (
    <div className="min-h-screen bg-bg-dark text-text-light">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Course Content List */}
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

          {/* Course Sections and Items */}
          <div className="pb-4 md:pb-0">
            {content.sections.map((section, sectionIndex) => (
              <div key={section.id} className="mb-4">
                <div className="px-6 py-3 bg-bg-dark/30">
                  <h3 className="font-semibold text-text-light">{section.title}</h3>
                </div>
                <div className="space-y-1 mt-2">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentSection(sectionIndex);
                        setCurrentItem(itemIndex);
                      }}
                      className={`w-full text-left px-6 py-3 transition-colors ${
                        currentSection === sectionIndex && currentItem === itemIndex
                          ? 'bg-primary/20 border-l-4 border-primary'
                          : 'hover:bg-bg-dark/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {item.type === 'video' && <Play className="h-4 w-4 text-primary mr-2" />}
                          {item.type === 'pdf' && <FileText className="h-4 w-4 text-blue-400 mr-2" />}
                          {item.type === 'text' && <BookOpen className="h-4 w-4 text-green-400 mr-2" />}
                          <span className="text-sm">{item.title}</span>
                        </div>
                        {item.isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4"></div> 
                        )}
                      </div>
                      <div className="flex text-xs text-text-muted pl-6">
                        {item.type === 'video' && item.duration && (
                          <span>{Math.floor(item.duration / 60)} min</span>
                        )}
                        {item.type === 'pdf' && item.fileSize && (
                          <span>{(item.fileSize / 1048576).toFixed(1)} MB</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8">
          {currentContent ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{currentContent.item.title}</h1>
                <div className="flex items-center text-text-muted">
                  {currentContent.item.type === 'video' && (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      <span>
                        {currentContent.item.duration 
                          ? `${Math.floor(currentContent.item.duration / 60)}:${String(currentContent.item.duration % 60).padStart(2, '0')} minutes` 
                          : 'Video'}
                      </span>
                    </>
                  )}
                  {currentContent.item.type === 'pdf' && (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      <span>
                        {currentContent.item.fileSize 
                          ? `PDF (${(currentContent.item.fileSize / 1048576).toFixed(2)} MB)` 
                          : 'PDF Document'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Content Display Area */}
              {currentContent.item.type === 'video' && (
                <div className="bg-bg-dark-light rounded-lg mb-8 aspect-video flex items-center justify-center">
                  {currentContent.item.url ? (
                    <video 
                      controls 
                      className="w-full h-full rounded-lg"
                      src={currentContent.item.url}
                      poster="/video-thumbnail.jpg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center">
                      <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-text-muted">Video Player</p>
                      <p className="text-sm text-text-muted mt-2">
                        This is a placeholder for the video player
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentContent.item.type === 'pdf' && (
                <div className="bg-bg-dark-light rounded-lg mb-8 p-8 flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">PDF Document</h3>
                  <p className="text-text-muted mb-4">
                    {currentContent.item.title}
                    {currentContent.item.fileSize && ` (${(currentContent.item.fileSize / 1048576).toFixed(2)} MB)`}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={currentContent.item.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View PDF
                    </a>
                    <a
                      href={currentContent.item.url || '#'}
                      download
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              )}

              {currentContent.item.type === 'text' && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-bg-dark-light p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Text Content</h3>
                    <p className="text-text-muted leading-relaxed">
                      This is a text content item. In a real application, this would contain detailed text content.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-wrap gap-4 justify-between mt-8">
                <button
                  onClick={navigateToPreviousContent}
                  disabled={isFirstContent}
                  className="bg-bg-dark-light hover:bg-primary/20 text-text-light px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Content
                </button>

                <div className="flex gap-4">
                  {!currentContent.item.isCompleted && (
                    <button
                      onClick={handleMarkAsComplete}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Complete
                    </button>
                  )}

                  <button
                    onClick={navigateToNextContent}
                    disabled={isLastContent}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Content
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-muted">Select a content item from the sidebar to begin learning.</p>
            </div>
          )}
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