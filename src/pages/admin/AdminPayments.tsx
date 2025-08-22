import React, { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Payment as SupabasePayment } from '../../types/CourseTypes';

interface PaymentWithDetails extends SupabasePayment {
  user_name?: string;
  user_email?: string;
  course_title?: string;
  phone_number?: string;
}

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    async function fetchPayments() {
      try {
        setIsLoading(true);
        
        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('Payments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (paymentsError) {
          throw paymentsError;
        }
        
        if (!paymentsData || paymentsData.length === 0) {
          setPayments([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch additional details for each payment
        const paymentsWithDetails = await Promise.all(paymentsData.map(async (payment) => {
          // Get user details
          const { data: userData } = await supabase
            .from('Profiles')
            .select('name, email, phone_number')
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
            user_email: userData?.email || 'No email',
            phone_number: userData?.phone_number || 'No phone',
            course_title: courseData ? courseData["Course Title"] as string : 'Unknown Course'
          };
        }));
        
        setPayments(paymentsWithDetails);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payment data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      (payment.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (payment.transaction_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (payment.course_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (payment.user_email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-900">Payment Management</h2>
        <p className="text-red-600">Monitor and manage all payment transactions</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="ml-3 text-red-600">Loading payment data...</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-sm font-medium text-red-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">KSh {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-sm font-medium text-red-600">Pending Payments</h3>
              <p className="text-2xl font-bold text-yellow-600">KSh {pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
              <h3 className="text-sm font-medium text-red-600">Total Transactions</h3>
              <p className="text-2xl font-bold text-red-900">{payments.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by user, transaction ID, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              {filteredPayments.length === 0 ? (
                <div className="text-center p-10">
                  <p className="text-red-500">No payments found matching your filters</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-red-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Course
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-red-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-red-900">
                              {payment.transaction_id || `TRX-${payment.id.slice(0, 8)}`}
                            </div>
                            <div className="text-sm text-red-500">
                              {payment.payment_method || 'M-Pesa'}: {payment.phone_number || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          <div>
                            <div>{payment.user_name || 'Unknown User'}</div>
                            <div className="text-xs text-red-500">{payment.user_email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          {payment.course_title || 'Unknown Course'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                          KSh {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
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