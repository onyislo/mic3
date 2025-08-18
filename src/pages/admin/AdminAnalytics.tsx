import React from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Calendar, Target } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 120000, users: 45, courses: 3 },
    { month: 'Feb', revenue: 180000, users: 67, courses: 4 },
    { month: 'Mar', revenue: 250000, users: 89, courses: 5 },
    { month: 'Apr', revenue: 320000, users: 112, courses: 6 },
    { month: 'May', revenue: 450000, users: 156, courses: 8 },
    { month: 'Jun', revenue: 380000, users: 134, courses: 7 },
  ];

  const topCourses = [
    { name: 'React Masterclass', students: 1200, revenue: 3000000, completion: 89 },
    { name: 'Node.js Backend', students: 850, revenue: 2550000, completion: 76 },
    { name: 'Mobile Development', students: 650, revenue: 2275000, completion: 82 },
    { name: 'UI/UX Design', students: 950, revenue: 1900000, completion: 91 },
  ];

  const userGrowth = [
    { period: 'This Week', new: 23, total: 1234 },
    { period: 'This Month', new: 89, total: 1234 },
    { period: 'This Quarter', new: 267, total: 1234 },
    { period: 'This Year', new: 1045, total: 1234 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-900">Analytics Dashboard</h2>
        <p className="text-red-600">Comprehensive business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Revenue</p>
              <p className="text-2xl font-bold text-red-900">KSh 1.7M</p>
              <p className="text-sm text-green-600">+23% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Active Users</p>
              <p className="text-2xl font-bold text-red-900">1,234</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Course Enrollments</p>
              <p className="text-2xl font-bold text-red-900">3,650</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
            <BookOpen className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Completion Rate</p>
              <p className="text-2xl font-bold text-red-900">84.5%</p>
              <p className="text-sm text-green-600">+3% from last month</p>
            </div>
            <Target className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-red-100 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(data.revenue / 500000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-900">
                  KSh {(data.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">User Growth</h3>
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
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white rounded-lg shadow-sm border border-red-100">
        <div className="p-6 border-b border-red-100">
          <h3 className="text-lg font-semibold text-red-900">Top Performing Courses</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-900">{course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-red-900">{course.students}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    KSh {(course.revenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-red-100 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-red-900">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Excellent</span>
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