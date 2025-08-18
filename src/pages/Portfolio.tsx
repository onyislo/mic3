import React from 'react';
import { Code, Database, Shield, ArrowRight, ExternalLink, BookOpen, Award, Users } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Grant Writing',
      description: 'Professional grant writing services to help secure funding for research projects, non-profits, and business initiatives.',
      features: ['Research Grant Proposals', 'Non-profit Funding Applications', 'Government Grant Writing', 'Corporate Sponsorship Proposals'],
    },
    {
      icon: Award,
      title: 'Proofreading & Editing',
      description: 'Expert editing and proofreading services for academic papers, business documents, and professional publications.',
      features: ['Academic Paper Editing', 'Thesis & Dissertation Review', 'Business Document Editing', 'Publication Preparation'],
    },
    {
      icon: Users,
      title: 'Service Automation',
      description: 'Intelligent automation solutions using AI agents and custom software to streamline business operations.',
      features: ['AI Agent Development', 'Process Automation', 'Workflow Optimization', 'Custom Bot Solutions'],
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications and digital platforms tailored to your specific business needs.',
      features: ['Custom Web Applications', 'Learning Management Systems', 'Business Portals', 'API Development'],
    },
    {
      icon: Database,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and database solutions for modern businesses.',
      features: ['Cloud Migration', 'Database Design', 'Server Management', 'Backup Solutions'],
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Protect your business with comprehensive security solutions and best practices.',
      features: ['Security Audits', 'Penetration Testing', 'Data Protection', 'Compliance Solutions'],
    },
  ];

  const portfolioProjects = [
    {
      title: 'Research Grant Proposal',
      category: 'Grant Writing',
      description: 'Secured $500K research funding for university climate change study through comprehensive grant proposal.',
      image: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['Research Analysis', 'Budget Planning', 'Compliance Review', 'Stakeholder Coordination'],
      link: '#',
    },
    {
      title: 'AI Customer Service Bot',
      category: 'Service Automation',
      description: 'Automated customer service system reducing response time by 80% and improving satisfaction.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['Python', 'OpenAI API', 'Natural Language Processing', 'Integration APIs'],
      link: '#',
    },
    {
      title: 'Academic Thesis Editing',
      category: 'Proofreading & Editing',
      description: 'Comprehensive editing of 200+ page doctoral thesis in environmental science with publication preparation.',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['Academic Writing', 'Citation Management', 'Style Guide Compliance', 'Publication Standards'],
      link: '#',
    },
    {
      title: 'Learning Management System',
      category: 'Web Development',
      description: 'Custom LMS platform with course management, progress tracking, and M-Pesa payment integration.',
      image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['React', 'Node.js', 'MongoDB', 'M-Pesa API'],
      link: '#',
    },
    {
      title: 'Non-Profit Funding Success',
      category: 'Grant Writing',
      description: 'Secured multiple grants totaling $1.2M for education non-profit organization over 18 months.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['Grant Research', 'Proposal Writing', 'Budget Development', 'Impact Assessment'],
      link: '#',
    },
    {
      title: 'Business Process Automation',
      category: 'Service Automation',
      description: 'Automated invoice processing and client communication system saving 20 hours per week.',
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600',
      technologies: ['Python', 'Zapier', 'Email Automation', 'Document Processing'],
      link: '#',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Kenya',
      role: 'CEO',
      content: 'MIC3 Solution Group delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
      rating: 5,
    },
    {
      name: 'David Mwangi',
      company: 'EduTech Solutions',
      role: 'CTO',
      content: 'The learning management system they built for us has transformed how we deliver education. Professional, reliable, and innovative team.',
      rating: 5,
    },
    {
      name: 'Grace Wanjiku',
      company: 'FinServe Ltd',
      role: 'Product Manager',
      content: 'Our mobile banking app has received excellent user feedback. MIC3 Solution Group understood our requirements perfectly and delivered on time.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-bg-dark text-text-light">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Our Portfolio
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-3xl mx-auto">
            Discover the innovative solutions we've crafted for businesses across various industries. 
            From web applications to mobile apps, we deliver excellence in every project.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              We provide comprehensive digital solutions to help your business thrive in the modern world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-bg-dark p-8 rounded-xl hover:bg-primary/10 transition-all duration-300 border border-primary/20 group"
              >
                <service.icon className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-text-muted mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-text-muted">
                      <ArrowRight className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Projects */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Take a look at some of our recent work and success stories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div
                key={index}
                className="bg-bg-dark-light rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-primary/20"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary font-medium">{project.category}</span>
                    <ExternalLink className="h-4 w-4 text-text-muted hover:text-primary cursor-pointer" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-text-muted mb-4 text-sm">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-bg-dark p-8 rounded-xl border border-primary/20"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                  ))}
                </div>
                <p className="text-text-muted mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-text-muted mb-8">
            Let's discuss how we can help bring your vision to life with our expertise and innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-6 w-6" />
            </button>
            <button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              View All Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};