import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-bg-dark-light shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/IMG-20250814-WA0003.jpg" 
                alt="MIC3 Solution Group Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-text-light">MIC3 Solution Group</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/portfolio"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/portfolio')
                  ? 'text-primary bg-primary/10'
                  : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
              }`}
            >
              Portfolio
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-dark hover:bg-primary/20 text-text-muted hover:text-text-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary bg-primary/10'
                      : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-text-muted">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-text-muted hover:text-text-light transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-text-muted hover:text-text-light transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-muted hover:text-text-light"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/portfolio"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/portfolio')
                  ? 'text-primary bg-primary/10'
                  : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Portfolio
            </Link>

            {/* Theme Toggle Button - Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-light hover:bg-bg-dark transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 mr-3" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-3" />
                  Switch to Dark Mode
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary bg-primary/10'
                      : 'text-text-muted hover:text-text-light hover:bg-bg-dark'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-text-muted text-sm">
                  Logged in as {user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-light transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-light transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};