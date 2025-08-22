import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, PlusCircle, FileText } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface PaymentWithDetails {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date?: string;
  user_name?: string;
  course_title?: string;
  created_at?: string;
}

interface SimpleCourse {
  id: string;
  title: string;
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
  
  // Dashboard data states
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [courses, setCourses] = useState<SimpleCourse[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('Profiles')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Fetch total active courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('Courses')
          .select('"Course Title", id');
          
        if (coursesError) throw coursesError;
        
        // Calculate total revenue
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('Payments')
          .select('amount, id, user_id, course_id, status, created_at')
          .eq('status', 'completed');
          
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
          // Get the 5 most recent payments
          const recentPaymentsData = paymentsData
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
            
          // Fetch additional details for each payment
          const detailedPayments = await Promise.all(recentPaymentsData.map(async (payment) => {
            // Get user details
            const { data: userData } = await supabase
              .from('Profiles')
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="p-6">
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
                  // Generate report from real data
                  setTimeout(() => {
                    // Create CSV content
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
                    
                    setIsGeneratingReport(false);
                    alert('Report downloaded successfully!');
                  }, 1500);
                }}
                disabled={isGeneratingReport}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                {isGeneratingReport ? 'Generating...' : 'Download Report'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};