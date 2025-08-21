import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Code } from 'lucide-react';

export const Home: React.FC = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Grant Writing',
      description: 'Professional grant writing services to secure funding for your projects and research.',
    },
    {
      icon: Award,
      title: 'Proofreading & Editing',
      description: 'Expert proofreading and editing services for academic papers, proposals, and business documents.',
    },
    {
      icon: Users,
      title: 'Service Automation',
      description: 'Intelligent automation solutions using AI agents to streamline your business processes.',
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications and digital solutions for modern businesses.',
    },
  ];

  const portfolioItems = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack online store with payment integration',
      image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Learning Management System',
      description: 'Educational platform with video streaming and assessments',
      image: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure financial application with M-Pesa integration',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="bg-bg-dark text-text-light">
      {/* Hero Section with Logo Background */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Logo Background - Semi-transparent and patterned */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-bg-dark opacity-90"></div>
          <div className="absolute inset-0 bg-repeat opacity-10" style={{ 
            backgroundImage: 'url("/IMG-20250814-WA0003.jpg")', 
            backgroundSize: '300px',
            transform: 'rotate(-5deg) scale(1.2)',
          }}></div>
        </div>
        
        {/* Large centered logo - moved up */}
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 z-0">
          <img 
            src="/IMG-20250814-WA0003.jpg" 
            alt="MIC3 Solutions Group" 
            className="w-[600px] h-auto rounded-full"
          />
        </div>
        
        {/* Animated subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-bg-dark/5 z-0"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 -mt-8">
          {/* Small visible logo at top - moved up */}
          <div className="flex justify-center mb-6">
            <img 
              src="/IMG-20250814-WA0003.jpg" 
              alt="MIC3 Solutions Group" 
              className="w-28 h-28 object-contain rounded-full border-4 border-primary"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-5 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Innovate. Create. Transform.
          </h1>
          <p className="text-xl text-text-muted mb-6 max-w-2xl mx-auto">
            MIC3 Solution Group delivers cutting-edge digital solutions that transform businesses.
            From web development to grant writing and automation services, we bring your vision to life.
            We also offer comprehensive courses for companies and individuals to learn these valuable skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="bg-primary hover:bg-primary-dark text-secondary px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              View Our Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border border-primary text-primary hover:bg-primary hover:text-secondary px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              to="/courses"
              className="bg-secondary text-bg-dark hover:bg-accent hover:text-bg-dark px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">100+</h3>
              <p className="text-text-muted">Projects Delivered</p>
            </div>
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">50+</h3>
              <p className="text-text-muted">Happy Clients</p>
            </div>
            <div>
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">5+</h3>
              <p className="text-text-muted">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              We provide comprehensive solutions to help your business thrive, along with courses 
              that enable both companies and individuals to master these essential skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-bg-dark-light p-8 rounded-xl hover:bg-primary/10 transition-colors border border-primary/20"
              >
                <service.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-secondary">{service.title}</h3>
                <p className="text-text-muted">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Check out some of our recent projects and success stories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className="bg-bg-dark rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business or Skills?</h2>
          <p className="text-xl text-text-muted mb-8">
            Let's discuss how we can help bring your vision to life with our innovative solutions, 
            or explore our courses to enhance your professional capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-primary hover:bg-primary-dark text-secondary px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
            <Link
              to="/courses"
              className="bg-secondary hover:bg-accent text-bg-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              to="/portfolio"
              className="border border-primary text-primary hover:bg-primary hover:text-secondary px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};