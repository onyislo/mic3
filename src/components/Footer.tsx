import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const courseCategories = [
    { name: 'Frontend Development', path: '/courses?category=Frontend' },
    { name: 'Backend Development', path: '/courses?category=Backend' },
    { name: 'Mobile Development', path: '/courses?category=Mobile' },
    { name: 'UI/UX Design', path: '/courses?category=Design' },
    { name: 'DevOps', path: '/courses?category=DevOps' },
    { name: 'Data Science', path: '/courses?category=Data' },
  ];

  const contactInfo = [
    { icon: MapPin, text: 'Karen, Nairobi, Kenya' },
    { icon: Phone, text: '+254 712 345 678' },
    { icon: Mail, text: 'info@mic3solutions.com' },
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, url: 'https://youtube.com', label: 'YouTube' },
    { icon: Github, url: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <footer className="bg-bg-dark-light text-text-light pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">MIC3 Solutions Group</h3>
            <p className="text-text-muted mb-6">
              Empowering individuals and businesses through innovative technology solutions and comprehensive learning experiences.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-bg-dark rounded-full hover:bg-primary/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6">Course Categories</h3>
            <ul className="space-y-3">
              {courseCategories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className="h-5 w-5 text-primary mr-3 mt-1" />
                  <span className="text-text-muted">{item.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 px-3 bg-bg-dark border border-primary/20 rounded-l-lg flex-grow text-text-light focus:outline-none focus:border-primary"
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-text-muted">
                &copy; {currentYear} MIC3 Solutions Group. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-text-muted hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-text-muted hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-text-muted hover:text-primary transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
