import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, FileText, Upload, Edit, Trash2, X, Plus, MoveUp, MoveDown, Video } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { uploadCourseContent } from '../../services/storageService';
import { ContentSection, ContentItem, getCourseContent, saveCourseContent } from '../../services/courseContentService';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
}

export const CourseContentManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { admin, isAuthenticated, loading } = useAdminAuth();
  
  // Course data state
  const [course, setCourse] = useState<Course>({
    id: courseId || '',
    title: 'Loading...',
    description: ''
  });
  
  // State for content sections
  const [sections, setSections] = useState<ContentSection[]>([]);
  // Removed local loading state; use admin loading from useAdminAuth
  const [savingChanges, setSavingChanges] = useState(false);
  
  // State for file uploads
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // State for active section for adding content
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  // States for new section and item forms
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'video' as 'video' | 'pdf' | 'text'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Check authentication first (with loading state)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch course data and content
  useEffect(() => {
    const fetchCourseAndContent = async () => {
      if (courseId && isAuthenticated) {
        try {
          // Fetch course details
          const { data: courseData, error: courseError } = await supabase
            .from('Courses')
            .select('*')
            .eq('id', courseId)
            .single();
          
          if (courseError) {
            console.error('Error fetching course:', courseError);
            return;
          }
          
          const course = {
            id: courseId,
            title: courseData["Course Title"] || 'Untitled Course',
            description: courseData["Description"] || ''
          };
          
          setCourse(course);
          
          // Fetch course content
          const contentSections = await getCourseContent(courseId);
          setSections(contentSections);
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      }
    };
    if (!loading) {
      fetchCourseAndContent();
    }
  }, [courseId, isAuthenticated, loading, navigate]);
  
  // Handler for adding a new section
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      title: newSectionTitle,
      order: sections.length,
      items: []
    };
    
    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setShowNewSectionForm(false);
    
    // If we have a courseId, save the new section to the database
    if (courseId) {
      saveCourseContent(courseId, [...sections, newSection])
        .catch(error => console.error('Error saving new section:', error));
    }
  };
  
  // Handler for deleting a section
  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section? All content will be lost.')) {
      // Find the section to get its items for deletion
      const sectionToDelete = sections.find(s => s.id === sectionId);
      const updatedSections = sections.filter(section => section.id !== sectionId);
      
      setSections(updatedSections);
      
      // Save the changes to the database
      if (courseId) {
        try {
          // First delete any media files from storage
          if (sectionToDelete) {
            for (const item of sectionToDelete.items) {
              if (item.url && (item.type === 'video' || item.type === 'pdf')) {
                // Here you would delete the file from storage
                // This is a more complex operation that requires tracking the storage paths
                console.log(`Should delete file: ${item.url}`);
              }
            }
          }
          
          // Then update the database to remove the section and its items
          await saveCourseContent(courseId, updatedSections);
        } catch (error) {
          console.error('Error deleting section:', error);
          alert('Failed to delete section. Please try again.');
        }
      }
    }
  };
  
  // Handler for adding a new item to a section
  const handleAddItem = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    
    setUploading(true);
    
    try {
      let fileUrl = '';
      let fileSize = 0;
      let duration = 0;
      
      if (selectedFile && courseId) {
        setUploadProgress(0);
        
        // Actually upload file to Supabase storage
        console.log(`Uploading ${selectedFile.name} to Supabase...`);
        
        // Use the uploadCourseContent function to upload the file
        const uploadResult = await uploadCourseContent(
          selectedFile,
          newItem.type,
          courseId
        );
        
        if (uploadResult.url) {
          fileUrl = uploadResult.url;
          fileSize = uploadResult.fileSize;
          duration = uploadResult.duration || 0;
          console.log('File uploaded successfully:', fileUrl);
        } else {
          throw new Error('Failed to upload file to storage');
        }
      }
      
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex !== -1) {
        const updatedSections = [...sections];
        
        const newContentItem: ContentItem = {
          id: `temp-${Date.now()}`, // Will be replaced with UUID when saved to database
          title: newItem.title,
          type: newItem.type,
          url: fileUrl,
          fileSize,
          duration,
          order: updatedSections[sectionIndex].items.length,
          isPublished: false
        };
        
        updatedSections[sectionIndex].items = [
          ...updatedSections[sectionIndex].items,
          newContentItem
        ];
        
        setSections(updatedSections);
        
        // Save to database
        if (courseId) {
          console.log('Saving content to database...');
          await saveCourseContent(courseId, updatedSections);
          console.log('Content saved successfully');
        }
      }
      
      // Reset the form
      setNewItem({ title: '', type: 'video' });
      setSelectedFile(null);
      setShowNewItemForm(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      // Show more detailed error
      if (error instanceof Error) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert('Failed to upload file. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };
  
  // Handler for deleting an item
  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex !== -1) {
        // Find the item to be deleted
        const itemToDelete = sections[sectionIndex].items.find(item => item.id === itemId);
        
        // Update the local state
        const updatedSections = [...sections];
        updatedSections[sectionIndex].items = updatedSections[sectionIndex].items.filter(
          item => item.id !== itemId
        );
        
        setSections(updatedSections);
        
        // Save changes to the database
        if (courseId) {
          try {
            // If there's a URL, attempt to delete the file from storage
            if (itemToDelete?.url && (itemToDelete.type === 'video' || itemToDelete.type === 'pdf')) {
              // Ideally would delete from storage here
              console.log(`Should delete file: ${itemToDelete.url}`);
            }
            
            await saveCourseContent(courseId, updatedSections);
          } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
          }
        }
      }
    }
  };
  
  // Handler for file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };
  
  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handler for reordering sections
  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    if (
      (direction === 'up' && sectionIndex > 0) ||
      (direction === 'down' && sectionIndex < sections.length - 1)
    ) {
      const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      const updatedSections = [...sections];
      const sectionToMove = updatedSections[sectionIndex];
      
      // Remove the section from its current position
      updatedSections.splice(sectionIndex, 1);
      // Insert it at the new position
      updatedSections.splice(newIndex, 0, sectionToMove);
      
      // Update order properties
      updatedSections.forEach((section, idx) => {
        section.order = idx;
      });
      
      setSections(updatedSections);
      
      // Save changes to database
      if (courseId) {
        try {
          await saveCourseContent(courseId, updatedSections);
        } catch (error) {
          console.error('Error reordering sections:', error);
        }
      }
    }
  };
  
  // Handler for reordering items within a section
  const handleMoveItem = async (sectionId: string, itemId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
      const itemIndex = sections[sectionIndex].items.findIndex(item => item.id === itemId);
      
      if (
        (direction === 'up' && itemIndex > 0) ||
        (direction === 'down' && itemIndex < sections[sectionIndex].items.length - 1)
      ) {
        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        const updatedSections = [...sections];
        const itemToMove = updatedSections[sectionIndex].items[itemIndex];
        
        // Remove the item from its current position
        updatedSections[sectionIndex].items.splice(itemIndex, 1);
        // Insert it at the new position
        updatedSections[sectionIndex].items.splice(newIndex, 0, itemToMove);
        
        // Update order properties
        updatedSections[sectionIndex].items.forEach((item, idx) => {
          item.order = idx;
        });
        
        setSections(updatedSections);
        
        // Save changes to database
        if (courseId) {
          try {
            await saveCourseContent(courseId, updatedSections);
          } catch (error) {
            console.error('Error reordering items:', error);
          }
        }
      }
    }
  };
  
  // Handler for toggling item publish status
  const handleTogglePublish = async (sectionId: string, itemId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
      const itemIndex = sections[sectionIndex].items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].items[itemIndex].isPublished = 
          !updatedSections[sectionIndex].items[itemIndex].isPublished;
        
        setSections(updatedSections);
        
        // Save changes to database
        if (courseId) {
          try {
            await saveCourseContent(courseId, updatedSections);
          } catch (error) {
            console.error('Error toggling publish status:', error);
          }
        }
      }
    }
  };
  
  // Show loading state (admin auth loading only)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent border-solid rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-lg text-gray-600">Loading admin authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900">{course.title}</h2>
          <p className="text-red-600">Course Content Management</p>
          {!admin && (
            <p className="text-yellow-600 mt-2">
              ⚠️ You appear to be logged out. Content uploads may fail. Please refresh the page or log in again.
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/courses')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Courses
          </button>
          <button
            onClick={() => setShowNewSectionForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </button>
        </div>
      </div>
      
      {/* New Section Form */}
      {showNewSectionForm && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-900">Add New Section</h3>
            <button onClick={() => setShowNewSectionForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddSection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Section Title</label>
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="e.g., Introduction, Getting Started, etc."
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Section
              </button>
              <button
                type="button"
                onClick={() => setShowNewSectionForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Course Content Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-red-900">{section.title}</h3>
                <span className="ml-3 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                </span>
                <div className="ml-4 flex space-x-2">
                  <button 
                    onClick={() => handleMoveSection(section.id, 'up')}
                    className="text-gray-600 hover:text-red-600"
                    disabled={section.order === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleMoveSection(section.id, 'down')}
                    className="text-gray-600 hover:text-red-600"
                    disabled={section.order === sections.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setActiveSectionId(section.id);
                    setShowNewItemForm(true);
                  }}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Video/PDF
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded flex items-center"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
            
            {/* Content Items */}
            {section.items.length > 0 ? (
              <ul className="divide-y divide-red-100">
                {section.items.map((item) => (
                  <li key={item.id} className="px-6 py-4 hover:bg-red-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {item.type === 'video' ? (
                            <div className="rounded-full bg-red-100 p-2">
                              <Play className="h-4 w-4 text-red-600" />
                            </div>
                          ) : (
                            <div className="rounded-full bg-blue-100 p-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-red-900">{item.title}</h4>
                          <div className="text-xs text-red-500 space-x-2">
                            <span>{item.type.toUpperCase()}</span>
                            {item.fileSize && <span>{formatFileSize(item.fileSize)}</span>}
                            {item.duration && <span>{formatDuration(item.duration)}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 items-center">
                        <div className="flex space-x-2 mr-4">
                          <button 
                            onClick={() => handleMoveItem(section.id, item.id, 'up')}
                            className="text-gray-600 hover:text-red-600"
                            disabled={item.order === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleMoveItem(section.id, item.id, 'down')}
                            className="text-gray-600 hover:text-red-600"
                            disabled={item.order === section.items.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleTogglePublish(section.id, item.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            item.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.isPublished ? 'Published' : 'Draft'}
                        </button>
                        
                        <button className="text-gray-600 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteItem(section.id, item.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center mb-4">
                  <Upload className="h-8 w-8 text-red-400 mb-2" />
                  <h4 className="text-lg font-medium text-red-900 mb-1">No Content Yet</h4>
                  <p className="text-red-500">This section is empty. Upload videos or PDFs using the button below.</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveSectionId(section.id);
                    setShowNewItemForm(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video or PDF
                </button>
              </div>
            )}
            
            {/* New Item Form */}
            {showNewItemForm && activeSectionId === section.id && (
              <div className="border-t border-red-100 p-6 bg-red-50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium text-red-900 text-lg">Upload Content to "{section.title}"</h4>
                    <p className="text-sm text-red-600">Add videos, PDFs, or text content to this section</p>
                  </div>
                  <button onClick={() => setShowNewItemForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={(e) => handleAddItem(e, section.id)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="e.g., Introduction Video, Course Resources, etc."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">Content Type</label>
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ 
                        ...newItem, 
                        type: e.target.value as 'video' | 'pdf' | 'text' 
                      })}
                      className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                      required
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF Document</option>
                      <option value="text">Text Content</option>
                    </select>
                  </div>
                  
                  {newItem.type !== 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        Upload {newItem.type === 'video' ? 'Video' : 'PDF'}
                      </label>
                      <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept={newItem.type === 'video' ? 'video/*' : 'application/pdf'}
                          className="hidden"
                          id="file-upload"
                          required
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                        >
                          <Upload className="h-12 w-12 text-red-400" />
                          <span className="text-lg font-medium text-red-700">
                            {selectedFile 
                              ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})` 
                              : `Click here to upload a ${newItem.type === 'video' ? 'video file' : 'PDF document'}`
                            }
                          </span>
                          <span className="text-sm text-red-500">
                            {newItem.type === 'video' 
                              ? 'Supported formats: MP4, MOV, AVI, etc.' 
                              : 'Only PDF files are supported'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            Select {newItem.type === 'video' ? 'Video' : 'PDF'} File
                          </button>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
                    >
                      {uploading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : 'Add Content'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewItemForm(false);
                        setSelectedFile(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {sections.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-10 text-center">
          <div className="flex flex-col items-center mb-6">
            <Video className="h-12 w-12 text-red-400 mb-2" />
            <h3 className="text-xl font-bold text-red-900 mb-2">No Course Content Yet</h3>
            <p className="text-red-500 mb-4">
              To upload videos or PDFs, first create a section, then click "Upload Video/PDF" within that section.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-left">
              <div className="bg-red-100 rounded-full p-2">
                <span className="font-bold text-red-900">1</span>
              </div>
              <span className="text-red-700">First, create a section (like a chapter)</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <div className="bg-red-100 rounded-full p-2">
                <span className="font-bold text-red-900">2</span>
              </div>
              <span className="text-red-700">Then click "Upload Video/PDF" in the section</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <div className="bg-red-100 rounded-full p-2">
                <span className="font-bold text-red-900">3</span>
              </div>
              <span className="text-red-700">Select your file and add the content details</span>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={() => setShowNewSectionForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Section
            </button>
          </div>
        </div>
      )}
      
      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button 
          onClick={async () => {
            if (!courseId) return;
            
            setSavingChanges(true);
            try {
              const success = await saveCourseContent(courseId, sections);
              if (success) {
                alert('Course content saved successfully!');
              } else {
                alert('Failed to save course content. Please try again.');
              }
            } catch (error) {
              console.error('Error saving course content:', error);
              alert('An error occurred while saving content. Please try again.');
            } finally {
              setSavingChanges(false);
            }
          }} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          disabled={savingChanges}
        >
          {savingChanges ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};
