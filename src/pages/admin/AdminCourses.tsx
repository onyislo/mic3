import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Users, Video, FileText, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCourses, createCourse, deleteCourse, updateCourse, getCourseStudentCount } from '../../services/courseService';
import { uploadImage } from '../../services/storageService';
import { Course } from '../../services/supabaseClient';

export const AdminCourses: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    instructor: '',
    image_url: '',
  });
  const [editCourse, setEditCourse] = useState<{
    id: string;
    title: string;
    description: string;
    price: string;
    instructor: string;
    image_url: string;
    level: string;
    category: string;
  }>({
    id: '',
    title: '',
    description: '',
    price: '',
    instructor: '',
    image_url: '',
    level: 'beginner',
    category: 'general',
  });
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [editCourseImage, setEditCourseImage] = useState<File | null>(null);
  
  // Add studentCounts state to store the number of students for each course
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  
  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
    
    // Check if we arrived from the dashboard with the intention to add a course
    if (location.state && location.state.showAddForm) {
      setShowAddForm(true);
    }
  }, [location]);
  
  // Function to fetch courses from the database
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get courses from the service
      const coursesData = await getCourses();
      setCourses(coursesData);
      
      // Get student counts for each course
      const counts: Record<string, number> = {};
      for (const course of coursesData) {
        counts[course.id] = await getCourseStudentCount(course.id);
      }
      setStudentCounts(counts);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
      setLoading(false);
    }
  };

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCourseImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate that price is a number
      const priceValue = parseFloat(newCourse.price);
      if (isNaN(priceValue)) {
        setError('Price must be a valid number');
        return;
      }
      
      // If there's an image, upload it first
      let imageUrl = '';
      if (courseImage) {
        // Upload the image using the storageService
        const uploadedUrl = await uploadImage(courseImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('Failed to upload image. Please try again.');
          return;
        }
      }
      
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        price: priceValue, // Use parsed float value
        instructor: newCourse.instructor,
        image_url: imageUrl,
        status: 'active' as const, // Set status to active so it shows up on the courses page
      };
      
      const result = await createCourse(courseData);
      if (result) {
        // Refresh courses list
        await fetchCourses();
        setNewCourse({ 
          title: '', 
          description: '', 
          price: '', 
          instructor: '',
          image_url: ''
        });
        setCourseImage(null);
        setImagePreview('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course. Please try again.');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        const success = await deleteCourse(id);
        if (success) {
          // Refresh courses list
          await fetchCourses();
        } else {
          setError('Failed to delete course. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Failed to delete course. Please try again.');
      }
    }
  };
  
  // Function to handle opening the edit form with a selected course's data
  const handleEditCourseClick = (course: Course) => {
    setEditCourse({
      id: course.id,
      title: course["Course Title"] || '',
      description: course["Description"] || '',
      price: course["Price"] ? course["Price"].toString() : '',
      instructor: course["Instructor"] || '',
      image_url: course.image_url || '',
      level: course.level || 'beginner',
      category: course.category || 'general',
    });
    
    // If there's an image, set the preview
    if (course.image_url) {
      setEditImagePreview(course.image_url);
    }
    
    setShowEditForm(true);
  };
  
  // Function to handle edit image change
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setEditCourseImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };
  
  // Function to save edited course
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate that price is a number
      const priceValue = parseFloat(editCourse.price);
      if (isNaN(priceValue)) {
        setError('Price must be a valid number');
        return;
      }
      
      // If there's a new image, upload it first
      let imageUrl = editCourse.image_url;
      if (editCourseImage) {
        // Upload the image using the storageService
        const uploadedUrl = await uploadImage(editCourseImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('Failed to upload image. Please try again.');
          return;
        }
      }
      
      const courseData = {
        title: editCourse.title,
        description: editCourse.description,
        price: priceValue,
        instructor: editCourse.instructor,
        image_url: imageUrl,
        level: editCourse.level as 'beginner' | 'intermediate' | 'advanced',
        category: editCourse.category,
      };
      
      const result = await updateCourse(editCourse.id, courseData);
      if (result) {
        // Refresh courses list
        await fetchCourses();
        setEditCourseImage(null);
        setEditImagePreview('');
        setShowEditForm(false);
      } else {
        setError('Failed to update course. Please try again.');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900">Course Management</h2>
          <p className="text-red-600">Manage your courses and content</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Add Course Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Add New Course</h3>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Instructor</label>
                <input
                  type="text"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Description</label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Price (KSh)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newCourse.price}
                onChange={(e) => {
                  // Only allow valid numeric input
                  const value = e.target.value;
                  if (value === '' || !isNaN(parseFloat(value))) {
                    setNewCourse({ ...newCourse, price: value });
                  }
                }}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
              <small className="text-red-500">Enter a valid numeric price</small>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Course Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                />
                {imagePreview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCourseImage(null);
                        setImagePreview('');
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <small className="text-red-500">Upload a course image (recommended size: 1280x720px)</small>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Course
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Course Form */}
      {showEditForm && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Edit Course</h3>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Instructor</label>
                <input
                  type="text"
                  value={editCourse.instructor}
                  onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Category</label>
                <select
                  value={editCourse.category}
                  onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="general">General</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                  <option value="data">Data</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">Level</label>
                <select
                  value={editCourse.level}
                  onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Description</label>
              <textarea
                value={editCourse.description}
                onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Price (KSh)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editCourse.price}
                onChange={(e) => {
                  // Only allow valid numeric input
                  const value = e.target.value;
                  if (value === '' || !isNaN(parseFloat(value))) {
                    setEditCourse({ ...editCourse, price: value });
                  }
                }}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
              <small className="text-red-500">Enter a valid numeric price</small>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">Course Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                />
                {editImagePreview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={editImagePreview}
                      alt="Course preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditCourseImage(null);
                        setEditImagePreview('');
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <small className="text-red-500">Update course image (recommended size: 1280x720px)</small>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Update Course
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditCourseImage(null);
                  setEditImagePreview('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          <span className="ml-2 text-red-600">Loading courses...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Courses Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full divide-y divide-red-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {course.image_url && (
                          <img 
                            src={course.image_url} 
                            alt={course["Course Title"]}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-red-900">{course["Course Title"]}</div>
                          <div className="text-sm text-red-500">{course["Description"]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                      {course.category || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                      KSh {course["Price"] ? course["Price"].toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-red-900">
                        <Users className="h-4 w-4 mr-1" />
                        {studentCounts[course.id] || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                        ${!course.level || course.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {course.level || 'beginner'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded text-xs"
                          title="Manage course content"
                        >
                          Content
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="Preview course">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditCourseClick(course)}
                          className="text-yellow-600 hover:text-yellow-900" 
                          title="Edit course details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* No Courses Message */}
      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-10">
          <div className="text-red-900 mb-2">No courses found</div>
          <p className="text-red-600 mb-4">Add your first course to get started.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
        </div>
      )}
    </div>
  );
};