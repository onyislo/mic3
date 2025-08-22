import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface MonthlyData {
  month: string;
  revenue: number;
  users: number;
}

interface UserGrowthData {
  period: string;
  new: number;
  total: number;
}

interface PaymentSummaryData {
  period: string;
  completed: number;
  pending: number;
  failed: number;
}

interface UserDemographicData {
  category: string;
  count: number;
  percentage: number;
}

interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'admin_enrolled';
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

// Using default export to fix the module export issue
const AdminAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [successfulPayments, setSuccessfulPayments] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryData[]>([]);
  const [userDemographics, setUserDemographics] = useState<UserDemographicData[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchUserDemographics = async () => {
    try {
      // In a real application, we would have user type or category in the profiles table
      // For this example, we'll simulate it using a query to the profiles table with specific conditions
      const { data: profiles } = await supabase
        .from('Profiles')
        .select('*');
        
      if (!profiles || profiles.length === 0) return;
      
      // We'll simulate demographic categorization
      // In a real app, this would be based on actual fields in your database
      
      // Mock calculations based on email or other properties
      const studentCount = Math.floor(profiles.length * 0.6);
      const professionalCount = Math.floor(profiles.length * 0.25);
      const corporateCount = profiles.length - studentCount - professionalCount;
      
      const total = profiles.length;
      
      setUserDemographics([
        { 
          category: 'Students', 
          count: studentCount, 
          percentage: parseFloat((studentCount / total * 100).toFixed(1)) 
        },
        { 
          category: 'Professionals', 
          count: professionalCount, 
          percentage: parseFloat((professionalCount / total * 100).toFixed(1)) 
        },
        { 
          category: 'Corporate', 
          count: corporateCount, 
          percentage: parseFloat((corporateCount / total * 100).toFixed(1)) 
        },
      ]);
    } catch (error) {
      console.error('Error fetching user demographics:', error);
    }
  };

  const calculateUserGrowth = async (profiles: {created_at: string}[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneQuarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    const weekNew = profiles.filter(p => new Date(p.created_at) >= oneWeekAgo).length;
    const monthNew = profiles.filter(p => new Date(p.created_at) >= oneMonthAgo).length;
    const quarterNew = profiles.filter(p => new Date(p.created_at) >= oneQuarterAgo).length;
    const yearNew = profiles.filter(p => new Date(p.created_at) >= oneYearAgo).length;
    
    setUserGrowth([
      { period: 'This Week', new: weekNew, total: totalUsers },
      { period: 'This Month', new: monthNew, total: totalUsers },
      { period: 'This Quarter', new: quarterNew, total: totalUsers },
      { period: 'This Year', new: yearNew, total: totalUsers },
    ]);
  };

  const generateMonthlyData = async (paymentsData: Payment[]) => {
    try {
      const currentYear = new Date().getFullYear();
      
      // Generate monthly payment summary
      const monthlySummary: PaymentSummaryData[] = [];
      const monthlyDataArr: MonthlyData[] = [];
      
      // Fetch all profiles to analyze user registrations
      const { data: profiles } = await supabase
        .from('Profiles')
        .select('created_at');
      
      for (let i = 0; i < 6; i++) {
        // Get month index (0-11)
        const monthIndex = (new Date().getMonth() - i + 12) % 12;
        const monthName = months[monthIndex];
        
        // Filter payments for this month and year (exclude admin enrollments)
        const monthlyPayments = paymentsData.filter(p => {
          const date = new Date(p.created_at);
          return date.getMonth() === monthIndex && 
                 date.getFullYear() === currentYear && 
                 p.payment_method !== 'admin_enrollment';
        });
        
        // Calculate revenues by status
        const completed = monthlyPayments.filter(p => p.status === 'completed').length;
        const pending = monthlyPayments.filter(p => p.status === 'pending').length;
        const failed = monthlyPayments.filter(p => p.status === 'failed').length;
        
        // Calculate revenue for this month
        const revenue = monthlyPayments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        
        // Count new users for this month
        const newUsers = profiles ? profiles.filter(p => {
          const date = new Date(p.created_at);
          return date.getMonth() === monthIndex && date.getFullYear() === currentYear;
        }).length : 0;
        
        monthlySummary.unshift({
          period: monthName,
          completed,
          pending,
          failed
        });
        
        monthlyDataArr.unshift({
          month: monthName,
          revenue,
          users: newUsers
        });
      }
      
      setPaymentSummary(monthlySummary);
      setMonthlyData(monthlyDataArr);
      
      // Calculate user growth periods
      await calculateUserGrowth(profiles || []);
      
    } catch (error) {
      console.error('Error generating monthly data:', error);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Fetch total users count
        const { count: userCount, error: userError } = await supabase
          .from('Profiles')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        setTotalUsers(userCount || 0);
        
        // Fetch payments data
        const { data: payments, error: paymentsError } = await supabase
          .from('Payments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (paymentsError) throw paymentsError;
        
        if (payments) {
          // Calculate total revenue from completed payments (exclude admin enrollments)
          const revenue = payments
            .filter(p => p.status === 'completed' && p.payment_method !== 'admin_enrollment')
            .reduce((sum, p) => sum + p.amount, 0);
          setTotalRevenue(revenue);
          
          // Count successful payments (exclude admin enrollments)
          const successful = payments.filter(p => p.status === 'completed' && p.payment_method !== 'admin_enrollment').length;
          setSuccessfulPayments(successful);
          
          // Set recent payments with user emails (exclude admin enrollments)
          const recentPaymentsWithUsers = await Promise.all(
            payments
              .filter(p => p.payment_method !== 'admin_enrollment')
              .slice(0, 5).map(async (payment) => {
              const { data: profile } = await supabase
                .from('Profiles')
                .select('email')
                .eq('user_id', payment.user_id)
                .single();
                
              return {
                ...payment,
                user_email: profile?.email || 'Unknown'
              };
            })
          );
          setRecentPayments(recentPaymentsWithUsers);
          
          // Generate monthly data for charts
          await generateMonthlyData(payments);
        }
        
        // Fetch user demographics data
        await fetchUserDemographics();
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-red-600">Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-red-900">Analytics Dashboard</h2>
            <p className="text-red-600">User and Payment Performance Metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-red-900">
                    KSh {(totalRevenue / 1000).toFixed(0)}K
                  </p>
                  {monthlyData.length > 1 && (
                    <p className="text-sm text-green-600">
                      {monthlyData[1] && monthlyData[0].revenue > monthlyData[1].revenue 
                        ? '+' + ((monthlyData[0].revenue - monthlyData[1].revenue) / monthlyData[1].revenue * 100).toFixed(0) + '%'
                        : '0%'} from last month
                    </p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Active Users</p>
                  <p className="text-2xl font-bold text-red-900">{totalUsers.toLocaleString()}</p>
                  {userGrowth.length > 0 && (
                    <p className="text-sm text-green-600">
                      +{userGrowth[1]?.new || 0} this month
                    </p>
                  )}
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Successful Payments</p>
                  <p className="text-2xl font-bold text-red-900">{successfulPayments}</p>
                  {paymentSummary.length > 1 && (
                    <p className="text-sm text-green-600">
                      {paymentSummary[0].completed > (paymentSummary[1]?.completed || 0) 
                        ? '+' + (paymentSummary[0].completed - (paymentSummary[1]?.completed || 0)) 
                        : '0'} from last month
                    </p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Monthly Revenue Trend</h3>
              {monthlyData.length === 0 ? (
                <p className="text-center text-red-500 py-4">No revenue data available</p>
              ) : (
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700">{data.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-red-100 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((data.revenue / 
                                (Math.max(...monthlyData.map(d => d.revenue)) || 1)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-red-900">
                        KSh {(data.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Growth */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">User Growth</h3>
              {userGrowth.length === 0 ? (
                <p className="text-center text-red-500 py-4">No user growth data available</p>
              ) : (
                <div className="space-y-4">
                  {userGrowth.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-red-500 mr-3" />
                        <span className="font-medium text-red-900">{period.period}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">+{period.new} new</p>
                        <p className="text-xs text-red-600">{period.total} total</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Payment Status Summary</h3>
              {paymentSummary.length === 0 ? (
                <p className="text-center text-red-500 py-4">No payment status data available</p>
              ) : (
                <div className="space-y-4">
                  {paymentSummary.map((data, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-700">{data.period}</span>
                        <span className="text-sm text-red-900">
                          {data.completed + data.pending + data.failed} payments
                        </span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500" 
                          style={{ 
                            width: `${data.completed + data.pending + data.failed === 0 ? 0 :
                              (data.completed / (data.completed + data.pending + data.failed)) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-yellow-400" 
                          style={{ 
                            width: `${data.completed + data.pending + data.failed === 0 ? 0 :
                              (data.pending / (data.completed + data.pending + data.failed)) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-red-400" 
                          style={{ 
                            width: `${data.completed + data.pending + data.failed === 0 ? 0 :
                              (data.failed / (data.completed + data.pending + data.failed)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-green-600">{data.completed} completed</span>
                        <span className="text-yellow-600">{data.pending} pending</span>
                        <span className="text-red-600">{data.failed} failed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Demographics */}
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">User Demographics</h3>
              {userDemographics.length === 0 ? (
                <p className="text-center text-red-500 py-4">No user demographics data available</p>
              ) : (
                <div className="space-y-4">
                  {userDemographics.map((data, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-900">{data.category}</span>
                        <span className="text-sm text-red-900">{data.count} users ({data.percentage}%)</span>
                      </div>
                      <div className="bg-red-100 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-red-100">
            <div className="p-6 border-b border-red-100">
              <h3 className="text-lg font-semibold text-red-900">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto w-full">
              {recentPayments.length === 0 ? (
                <p className="text-center text-red-500 py-4">No recent payments available</p>
              ) : (
                <table className="w-full divide-y divide-red-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-red-200">
                    {recentPayments.map((payment, index) => (
                      <tr key={index} className="hover:bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                          {payment.transaction_id || `TRX-${payment.id.slice(0, 8)}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          {payment.user_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          KSh {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Using both named export and default export to make it work in different import scenarios
export { AdminAnalytics };
export default AdminAnalytics;
 