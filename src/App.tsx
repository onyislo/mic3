import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { CourseContent } from './pages/CourseContent';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { Dashboard } from './pages/Dashboard';
import { Contact } from './pages/Contact';
import { Portfolio } from './pages/Portfolio';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AuthCallback from './pages/auth/Callback';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCourses } from './pages/admin/AdminCourses';
import { CourseContentManager } from './pages/admin/CourseContentManager';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/courses" element={<Layout><Courses /></Layout>} />
            <Route path="/courses/:courseId" element={<Layout><CourseDetail /></Layout>} />
            <Route path="/courses/:courseId/content" element={
              <ProtectedRoute>
                <CourseContent />
              </ProtectedRoute>
            } />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><Privacy /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminCourses /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/courses/:courseId/content" element={
              <AdminProtectedRoute>
                <AdminLayout><CourseContentManager /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminUsers /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminPayments /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/portfolio" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminPortfolio /></AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminAnalytics /></AdminLayout>
              </AdminProtectedRoute>
            } />
          </Routes>
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;