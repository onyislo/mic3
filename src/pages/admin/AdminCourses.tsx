import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  students: number;
  status: 'active' | 'draft' | 'archived';
  instructor: string;
  createdAt: string;
}

export const AdminCourses: React.FC = () => {
  const location = useLocation();
  
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'React Masterclass',
      description: 'Learn React from beginner to advanced level',
      price: 2500,
      students: 1200,
      status: 'active',
      instructor: 'John Doe',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications',
      price: 3000,
      students: 850,
      status: 'active',
      instructor: 'Jane Smith',
      createdAt: '2024-01-05',
    },
    {
      id: '3',
      title: 'Mobile App Development',
      description: 'Create mobile apps for iOS and Android',
      price: 3500,
      students: 650,
      status: 'draft',
      instructor: 'Mike Johnson',
      createdAt: '2024-01-10',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    instructor: '',
  });
  
  // Check if we arrived from the dashboard with the intention to add a course
  useEffect(() => {
    if (location.state && location.state.showAddForm) {
      setShowAddForm(true);
    }
  }, [location, setShowAddForm]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = {
      id: Date.now().toString(),
      title: newCourse.title,
      description: newCourse.description,
      price: parseInt(newCourse.price),
      students: 0,
      status: 'draft',
      instructor: newCourse.instructor,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', price: '', instructor: '' });
    setShowAddForm(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
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

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Status
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
                    <div>
                      <div className="text-sm font-medium text-red-900">{course.title}</div>
                      <div className="text-sm text-red-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    KSh {course.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-red-900">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
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
    </div>
  );
};