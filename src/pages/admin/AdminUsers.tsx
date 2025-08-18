import React, { useState } from 'react';
import { Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  joinDate: string;
  status: 'active' | 'inactive';
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      enrolledCourses: ['React Masterclass', 'Node.js Backend'],
      joinDate: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      enrolledCourses: ['Mobile Development'],
      joinDate: '2024-01-10',
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      enrolledCourses: ['UI/UX Design'],
      joinDate: '2024-01-05',
      status: 'inactive',
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const availableCourses = [
    'React Masterclass',
    'Node.js Backend Development',
    'Mobile App Development',
    'UI/UX Design Fundamentals',
  ];

  const handleEnrollUser = (userId: string, courseName: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, enrolledCourses: [...user.enrolledCourses, courseName] }
        : user
    ));
  };

  const handleUnenrollUser = (userId: string, courseName: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, enrolledCourses: user.enrolledCourses.filter(course => course !== courseName) }
        : user
    ));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-900">User Management</h2>
          <p className="text-red-600">Manage users and their course enrollments</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
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
                      <div className="text-sm font-medium text-red-900">{user.name}</div>
                      <div className="text-sm text-red-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.enrolledCourses.map((course, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {course}
                          <button
                            onClick={() => handleUnenrollUser(user.id, course)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <UserMinus className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
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
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* Enroll Modal */}
      {showEnrollModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Enroll User in Course</h3>
            <div className="space-y-2">
              {availableCourses
                .filter(course => !users.find(u => u.id === selectedUser)?.enrolledCourses.includes(course))
                .map((course) => (
                  <button
                    key={course}
                    onClick={() => {
                      handleEnrollUser(selectedUser, course);
                      setShowEnrollModal(false);
                      setSelectedUser(null);
                    }}
                    className="w-full text-left px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {course}
                  </button>
                ))}
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
          </div>
        </div>
      )}
    </div>
  );
};