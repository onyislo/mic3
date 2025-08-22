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
    { name: 'Terms', path: '/terms' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const courseCategories = [
    { name: 'Frontend Development', path: '/courses?category=Frontend' },
    { name: 'Backend Development', path: '/courses?category=Backend' },
    { name: 'Mobile Development', path: '/courses?category=Mobile' },
    { name: 'AI Basics', path: '/courses?category=AI_Basics' },
    { name: 'Grant Writing', path: '/courses?category=Grant_Writing' },
    { name: 'AI Agents', path: '/courses?category=AI_Agents' },
    { name: 'UI/UX Design', path: '/courses?category=Design' },
    { name: 'DevOps', path: '/courses?category=DevOps' },
    { name: 'Data Science', path: '/courses?category=Data' },
  ];

  const contactInfo = [
    { icon: MapPin, text: 'Karen, Nairobi, Kenya', url: 'https://maps.google.com/?q=Karen,Nairobi,Kenya', type: 'map' },
    { icon: Phone, text: '+254 712 345 678', url: 'tel:+254712345678', type: 'phone' },
    { icon: Mail, text: 'info@mic3solutiongroup.com', url: 'mailto:info@mic3solutiongroup.com', type: 'email' },
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
    <footer className="bg-bg-dark-light text-text-light pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-3">MIC3 Solutions Group</h3>
            <p className="text-text-muted text-sm mb-3">
              Empowering individuals and businesses through innovative technology solutions.
            </p>
            <div className="flex space-x-2">
              {socialLinks.slice(0, 4).map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-bg-dark rounded-full hover:bg-primary/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-sm">
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
            <h3 className="text-lg font-bold mb-3">Course Categories</h3>
            <ul className="grid grid-cols-1 gap-y-1.5 text-sm">
              {courseCategories.slice(0, 6).map((category, index) => (
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
            <h3 className="text-lg font-bold mb-3">Contact Us</h3>
            <ul className="space-y-1.5 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <a 
                    href={item.url}
                    target={item.type === 'map' ? '_blank' : undefined}
                    rel={item.type === 'map' ? 'noopener noreferrer' : undefined}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="mt-3">
              <form onSubmit={(e) => {
                e.preventDefault();
                // Here you would typically call a function to handle the subscription
                const email = (e.target as HTMLFormElement).email.value;
                if (email) {
                  alert(`Thank you for subscribing with ${email}! You will receive our newsletters soon.`);
                  (e.target as HTMLFormElement).reset();
                }
              }}>
                <div className="flex">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="p-1.5 px-2 text-xs bg-bg-dark border border-primary/20 rounded-l-lg flex-grow text-text-light focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 text-xs rounded-r-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <p className="text-text-muted text-xs">
                &copy; {currentYear} MIC3 Solutions Group. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4 text-xs">
              <Link to="/privacy-policy" className="text-text-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-text-muted hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy#cookies" className="text-text-muted hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
