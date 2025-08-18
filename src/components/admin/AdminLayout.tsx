import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  Briefcase, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:h-auto min-h-screen flex flex-col overflow-y-auto`}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-dark sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-secondary" />
            <span className="text-secondary font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-red-200 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-red-800 text-white border-r-4 border-red-400'
                  : 'text-red-200 hover:bg-red-800 hover:text-white'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
          {/* Spacer to ensure sidebar content fills available space */}
          <div className="flex-grow"></div>
        </nav>

        <div className="w-full p-6 bg-red-900">
          <div className="bg-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-200 text-sm">Logged in as:</p>
            <p className="text-white font-medium">{admin?.name}</p>
            <p className="text-red-300 text-xs">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-200 hover:text-white hover:bg-red-800 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-red-100 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-red-600 hover:text-red-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-red-900">
              MIC3 Solution Group - Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-red-600">Welcome, {admin?.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 flex-grow overflow-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};