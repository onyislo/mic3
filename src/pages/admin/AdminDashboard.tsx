import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, PlusCircle, FileText, UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { getUsers, enrollUserInCourse, deleteUser } from '../../services/supabaseService';

interface PaymentWithDetails {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'admin_enrolled';
  payment_method?: string;
  date?: string;
  user_name?: string;
  course_title?: string;
  created_at?: string;
}

interface SimpleCourse {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  joinDate: string;
  status: 'active' | 'inactive';
}

interface DashboardStat {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEnrollUserModal, setShowEnrollUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '' });
  
  // Dashboard data states
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [courses, setCourses] = useState<SimpleCourse[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch user count and profiles
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Fetch all users with getUsers service
        try {
          const usersData = await getUsers();
          setUsers(usersData);
        } catch (userErr) {
          console.error('Error fetching users:', userErr);
        }
        
        // Fetch total active courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('Courses')
          .select('id, "Course Title"');
          
        if (coursesError) throw coursesError;
        
        // Calculate total revenue - only from real completed payments (not admin enrollments)
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('Payments')
          .select('amount, id, user_id, course_id, status, created_at, payment_method')
          .eq('status', 'completed')
          .neq('payment_method', 'admin_enrollment'); // Exclude admin enrollments
          
        if (paymentsError) throw paymentsError;
        
        const totalRevenue = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        
        // Set simple stats
        setStats([
          {
            title: 'Total Users',
            value: userCount?.toLocaleString() || '0',
            icon: Users,
          },
          {
            title: 'Available Courses',
            value: (coursesData?.length || 0).toString(),
            icon: BookOpen,
          },
          {
            title: 'Total Revenue',
            value: `KSh ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
          },
        ]);

        // Set courses list
        if (coursesData) {
          setCourses(coursesData.map(course => ({
            id: course.id,
            title: course["Course Title"] as string
          })));
        }
        
        // Fetch recent payment details
        if (paymentsData && paymentsData.length > 0) {
          // Get the 5 most recent real payments (exclude admin enrollments)
          const recentPaymentsData = paymentsData
            .filter(p => p.payment_method !== 'admin_enrollment')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
            
          // Fetch additional details for each payment
          const detailedPayments = await Promise.all(recentPaymentsData.map(async (payment) => {
            // Get user details
            const { data: userData } = await supabase
              .from('profiles')
              .select('name')
              .eq('user_id', payment.user_id)
              .single();
              
            // Get course details
            const { data: courseData } = await supabase
              .from('Courses')
              .select('"Course Title"')
              .eq('id', payment.course_id)
              .single();
              
            return {
              ...payment,
              user_name: userData?.name || 'Unknown User',
              course_title: courseData ? (courseData["Course Title"] as string) : 'Unknown Course'
            };
          }));
          
          setPayments(detailedPayments);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle adding new user
  const handleAddUser = async () => {
    try {
      setProcessing(true);
      
      // First create auth user using signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            name: newUserData.name
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Then create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name: newUserData.name,
          email: newUserData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        throw profileError;
      }
      
      alert('User created successfully');
      setNewUserData({ name: '', email: '', password: '' });
      setShowAddUserModal(false);
      
      // Refresh data
      // Refresh dashboard data to include the new user
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error adding user:', err);
      alert(`Failed to add user: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle enrolling user in course
  const handleEnrollUser = async () => {
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Find selected course
      const courseSelect = document.getElementById('course-select') as HTMLSelectElement;
      const selectedCourseId = courseSelect.value;
      
      if (!selectedCourseId) {
        alert('Please select a course');
        return;
      }
      
      await enrollUserInCourse(selectedUser, selectedCourseId);
      
      alert('User enrolled successfully');
      setShowEnrollUserModal(false);
      setSelectedUser(null);
      
      // Refresh dashboard data
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error enrolling user:', err);
      alert(`Failed to enroll user: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle deleting user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setProcessing(true);
        await deleteUser(userId);
        alert('User deleted successfully');
        
        // Refresh dashboard data
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(`Failed to delete user: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setProcessing(false);
      }
    }
  };
  
  // Add a refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Update useEffect dependency to include refreshTrigger
  useEffect(() => {
    // ... existing fetchDashboardData function
  }, [refreshTrigger]);
  


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Dashboard Overview</h2>
        <p className="text-red-600">Welcome to the MIC3 Solution Group admin panel</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="ml-3 text-red-600">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-red-900">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-red-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100">
              <div className="p-6 border-b border-red-100">
                <h3 className="text-lg font-semibold text-red-900">Recent Payments</h3>
              </div>
              <div className="p-6">
                {payments.length === 0 ? (
                  <p className="text-center text-red-500 py-4">No recent payments found</p>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">{payment.user_name}</p>
                          <p className="text-sm text-red-600">{payment.course_title}</p>
                          <p className="text-xs text-red-500">{formatDate(payment.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-900">KSh {payment.amount.toLocaleString()}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100">
              <div className="p-6 border-b border-red-100">
                <h3 className="text-lg font-semibold text-red-900">Available Courses</h3>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-center text-red-500 py-4">No courses found</p>
                ) : (
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <div key={course.id} className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-red-900">{course.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100">
              <div className="p-6 border-b border-red-100">
                <h3 className="text-lg font-semibold text-red-900">Quick Tips</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-900">Welcome to MIC3 Dashboard</p>
                    <p className="text-sm text-red-600 mt-2">
                      Use this dashboard to monitor key metrics for your business.
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-900">Need Help?</p>
                    <p className="text-sm text-red-600 mt-2">
                      Contact the administrator if you need assistance with the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/admin/courses', { state: { showAddForm: true } })}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Course
              </button>
              <button 
                onClick={() => {
                  setIsGeneratingReport(true);
                  try {
                    // Create CSV content directly from real data
                    const csvContent = [
                      "Report Date,Total Users,Total Revenue,Available Courses",
                      `${new Date().toLocaleDateString()},${stats.find(s => s.title === 'Total Users')?.value || '0'},${stats.find(s => s.title === 'Total Revenue')?.value || '0'},${stats.find(s => s.title === 'Available Courses')?.value || '0'}`
                    ].join("\n");
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', `mic3_report_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  } catch (err) {
                    console.error('Error generating report:', err);
                    alert('Failed to generate report. Please try again.');
                  } finally {
                    setIsGeneratingReport(false);
                  }
                }}
                disabled={isGeneratingReport}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                {isGeneratingReport ? 'Generating...' : 'Download Report'}
              </button>
              
              <button 
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </button>
              
              <button 
                onClick={() => navigate('/admin/users')}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Users
              </button>
            </div>
          </div>
          
          {/* User Management Section */}
          <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Recent Users</h3>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-red-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-red-200">
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id} className="hover:bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{user.joinDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user.id);
                                setShowEnrollUserModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              disabled={processing}
                            >
                              <UserPlus className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={processing}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-red-500 py-4">No users found</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate('/admin/users')}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                View All Users →
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Add New User</h3>
            {processing ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <>
                <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Create a strong password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Enroll User in Course Modal */}
      {showEnrollUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Enroll User in Course</h3>
            {processing ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <>
                <form onSubmit={(e) => { e.preventDefault(); handleEnrollUser(); }}>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Select Course</label>
                    <select
                      id="course-select"
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    >
                      <option value="">-- Select a course --</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEnrollUserModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                      Enroll User
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};