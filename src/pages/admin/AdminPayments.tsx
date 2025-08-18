import React, { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  user: string;
  course: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'mpesa';
  phoneNumber: string;
  date: string;
}

export const AdminPayments: React.FC = () => {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      transactionId: 'MPX123456789',
      user: 'John Doe',
      course: 'React Masterclass',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'mpesa',
      phoneNumber: '254712345678',
      date: '2024-01-15 14:30',
    },
    {
      id: '2',
      transactionId: 'MPX123456790',
      user: 'Jane Smith',
      course: 'Node.js Backend Development',
      amount: 3000,
      status: 'completed',
      paymentMethod: 'mpesa',
      phoneNumber: '254723456789',
      date: '2024-01-14 10:15',
    },
    {
      id: '3',
      transactionId: 'MPX123456791',
      user: 'Mike Johnson',
      course: 'Mobile App Development',
      amount: 3500,
      status: 'pending',
      paymentMethod: 'mpesa',
      phoneNumber: '254734567890',
      date: '2024-01-14 16:45',
    },
    {
      id: '4',
      transactionId: 'MPX123456792',
      user: 'Sarah Wilson',
      course: 'UI/UX Design Fundamentals',
      amount: 2000,
      status: 'failed',
      paymentMethod: 'mpesa',
      phoneNumber: '254745678901',
      date: '2024-01-13 09:20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-900">Payment Management</h2>
        <p className="text-red-600">Monitor and manage all payment transactions</p>
      </div>

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
                      <div className="text-sm font-medium text-red-900">{payment.transactionId}</div>
                      <div className="text-sm text-red-500">M-Pesa: {payment.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {payment.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {payment.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                    KSh {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {payment.date}
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
        </div>
      </div>
    </div>
  );
};