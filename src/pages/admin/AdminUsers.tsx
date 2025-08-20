import React, { useState, useEffect } from 'react';
import { Edit, Trash2, UserPlus, UserMinus, Loader, RefreshCcw } from 'lucide-react';
import { 
  getUsers, 
  enrollUserInCourse, 
  removeUserFromCourse, 
  deleteUser,
  getCourses
} from '../../services/supabaseService';
import { Course } from '../../services/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  joinDate: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch users and courses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching users and courses data...');
        
        // Fetch users
        const usersData = await getUsers();
        console.log('Users data received:', usersData);
        
        if (usersData.length === 0) {
          console.warn('No users returned from getUsers()');
          setError('No users found in the database. Make sure users have registered and profiles are created.');
        }
        
        // Type assertion to ensure it matches our User type
        setUsers(usersData as User[]);
        
        // Fetch available courses
        const coursesData = await getCourses();
        console.log('Courses data received:', coursesData);
        setAvailableCourses(coursesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load users: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [refreshTrigger]);

  const handleEnrollUser = async (userId: string, courseId: string) => {
    try {
      setProcessing(true);
      await enrollUserInCourse(userId, courseId);
      // Refresh the user list to get updated data
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error enrolling user:', err);
      alert('Failed to enroll user in course. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUnenrollUser = async (userId: string, courseTitle: string) => {
    try {
      setProcessing(true);
      // Find course ID by title
      const course = availableCourses.find(c => c.title === courseTitle);
      if (!course) {
        throw new Error('Course not found');
      }
      
      await removeUserFromCourse(userId, course.id);
      // Refresh the user list to get updated data
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error unenrolling user:', err);
      alert('Failed to remove user from course. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setProcessing(true);
        await deleteUser(id);
        // Refresh the user list to get updated data
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900">User Management</h2>
          <p className="text-red-600">Manage users and their course enrollments</p>
        </div>
        <button 
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-red-600 animate-spin" />
              <span className="ml-2 text-red-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-red-600">No users found</p>
            </div>
          ) : (
            <table className="w-full divide-y divide-red-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Join Date
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-red-900">{user.name || 'No Name'}</div>
                        <div className="text-sm text-red-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                          user.enrolledCourses.map((course, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {course}
                              <button
                                onClick={() => handleUnenrollUser(user.id, course)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                                disabled={processing}
                              >
                                <UserMinus className="h-3 w-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No courses enrolled</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user.id);
                            setShowEnrollModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Enroll in course"
                          disabled={processing}
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900" disabled={processing}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={processing}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Enroll User in Course</h3>
            {processing ? (
              <div className="flex justify-center py-6">
                <Loader className="h-6 w-6 text-red-600 animate-spin" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableCourses
                    .filter(course => {
                      const userCourses = users.find(u => u.id === selectedUser)?.enrolledCourses || [];
                      return !userCourses.includes(course.title);
                    })
                    .map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          handleEnrollUser(selectedUser, course.id);
                          setShowEnrollModal(false);
                          setSelectedUser(null);
                        }}
                        className="w-full text-left px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <div className="font-medium">{course.title}</div>
                        <div className="text-xs text-gray-500">
                          {course.category} • {course.level} • KSh {Number(course.price).toLocaleString()}
                        </div>
                      </button>
                    ))}
                  
                  {availableCourses.filter(course => {
                    const userCourses = users.find(u => u.id === selectedUser)?.enrolledCourses || [];
                    return !userCourses.includes(course.title);
                  }).length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      This user is already enrolled in all available courses
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setShowEnrollModal(false);
                      setSelectedUser(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};