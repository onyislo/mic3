import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, Award, PlusCircle, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Active Courses',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
    },
    {
      title: 'Monthly Revenue',
      value: 'KSh 450,000',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Course Completions',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: Award,
    },
  ];

  const recentPayments = [
    { id: '1', user: 'John Doe', course: 'React Masterclass', amount: 2500, status: 'completed', date: '2024-01-15' },
    { id: '2', user: 'Jane Smith', course: 'Node.js Backend', amount: 3000, status: 'completed', date: '2024-01-14' },
    { id: '3', user: 'Mike Johnson', course: 'Mobile Development', amount: 3500, status: 'pending', date: '2024-01-14' },
    { id: '4', user: 'Sarah Wilson', course: 'UI/UX Design', amount: 2000, status: 'completed', date: '2024-01-13' },
  ];

  const popularCourses = [
    { name: 'React Masterclass', students: 1200, revenue: 'KSh 3,000,000' },
    { name: 'Node.js Backend', students: 850, revenue: 'KSh 2,550,000' },
    { name: 'Mobile Development', students: 650, revenue: 'KSh 2,275,000' },
    { name: 'UI/UX Design', students: 950, revenue: 'KSh 1,900,000' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Dashboard Overview</h2>
        <p className="text-red-600">Welcome to the MIC3 Solution Group admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">{stat.title}</p>
                <p className="text-2xl font-bold text-red-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
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
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">{payment.user}</p>
                    <p className="text-sm text-red-600">{payment.course}</p>
                    <p className="text-xs text-red-500">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-900">KSh {payment.amount.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-red-100">
          <div className="p-6 border-b border-red-100">
            <h3 className="text-lg font-semibold text-red-900">Popular Courses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">{course.name}</p>
                    <p className="text-sm text-red-600">{course.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-900">{course.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/courses', { state: { showAddForm: true } })}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Course
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            View All Users
          </button>
          <button 
            onClick={() => {
              setIsGeneratingReport(true);
              // Simulate report generation
              setTimeout(() => {
                setIsGeneratingReport(false);
                alert('Report generated successfully!');
              }, 1500);
            }}
            disabled={isGeneratingReport}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
};