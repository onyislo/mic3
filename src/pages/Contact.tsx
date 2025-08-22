import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { api } from '../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This will send the message to info@mic3solutiongroup.com
      await api.submitContact(formData);
      
      // Clear form and show success message
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setError('Failed to send message. Please try again or reach out to us directly through our contact information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Have a question about our courses or need help with your learning journey? 
            We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-6">
                Thank you for your message! We've received your inquiry and will get back to you soon.
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-bg-dark-light border border-primary/20 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@mic3solutiongroup.com" className="text-text-muted hover:text-primary transition-colors block">info@mic3solutiongroup.com</a>
                  <a href="mailto:customercare@mic3solutiongroup.com" className="text-text-muted hover:text-primary transition-colors block">customercare@mic3solutiongroup.com</a>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+254712345678" className="text-text-muted hover:text-primary transition-colors block">+254 712 345 678</a>
                  <a href="tel:+254700000000" className="text-text-muted hover:text-primary transition-colors block">+254 700 000 000</a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <a 
                    href="https://maps.google.com/?q=Karen,Nairobi,Kenya" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors block"
                  >
                    Karen, Nairobi, Kenya<br />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-bg-dark-light p-6 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2 text-text-muted">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="bg-bg-dark-light p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How do I access my purchased courses?</h4>
                  <p className="text-text-muted text-sm">
                    Once you complete your purchase, you can access your courses from your dashboard.
                  </p>
                </div>
                <div className="bg-bg-dark-light p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Can I get a refund?</h4>
                  <p className="text-text-muted text-sm">
                    Yes, we offer a 30-day money-back guarantee on all our courses.
                  </p>
                </div>
                <div className="bg-bg-dark-light p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Do you offer payment plans?</h4>
                  <p className="text-text-muted text-sm">
                    Currently, we support one-time payments via M-Pesa. Payment plans are coming soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};