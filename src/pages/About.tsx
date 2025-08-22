import React from 'react';
import { Linkedin, Twitter, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Hillary Lihanda',
      role: 'CEO & Founder',
      bio: 'Over 15 years of technology innovation experience. Computer science and business administration background with proven success leading tech initiatives and startups.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', // Professional African male in suit
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      name: 'Sarah Mwangi',
      role: 'Chief Technology Officer',
      bio: 'Cloud architecture and enterprise solutions expert. Her innovative approach to technology challenges drives our product development success.',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', // Professional African female
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      name: 'David Ochieng',
      role: 'Head of Development',
      bio: 'Oversees development teams and ensures quality code standards. Technical leadership that shapes our development practices and client solutions.',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', // Different professional African male image
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
  ];

  // Company values
  const values = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions that address complex challenges.',
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all our business dealings and client relationships.',
    },
    {
      title: 'Excellence',
      description: 'We strive for exceptional quality in everything we do, from code to customer service.',
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and partnership to achieve remarkable results.',
    },
  ];

  return (
    <div className="bg-bg-dark text-text-light">
      {/* Company Story Section with Hero Content */}
      <section className="py-12 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                About MIC3 Solution Group
              </h1>
              <p className="text-xl text-text-muted mb-6 leading-relaxed">
                We're a passionate team of experts dedicated to building innovative digital solutions 
                that empower businesses to thrive in the digital era.
              </p>
              <p className="text-text-muted mb-5 leading-relaxed">
                Founded in 2020 by Hillary Lihanda, MIC3 Solution Group bridges the technology gap for 
                African businesses with personalized digital services. We began as a small consultancy 
                and have evolved into a comprehensive solutions provider serving clients across East Africa 
                and beyond.
              </p>
              <p className="text-text-muted leading-relaxed">
                Our talented team of professionals has helped dozens of organizations transform operations, 
                expand customer reach, and achieve business objectives through tailored technology solutions 
                that address unique market challenges.
              </p>
            </div>
            <div className="relative">
              <div className="bg-primary/10 p-1 rounded-lg">
                <img 
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Team working together" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-4 rounded-lg text-white">
                <p className="text-2xl font-bold">5+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Our Values</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Core principles that drive our commitment to excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-bg-dark-light p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                <p className="text-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-4 bg-bg-dark-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Our Leadership Team</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              The talent behind MIC3 Solution Group's vision and success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-bg-dark rounded-xl overflow-hidden border border-primary/20 group hover:border-primary/40 transition-all duration-300"
              >
                <div className="h-56 overflow-hidden flex justify-center items-center bg-bg-dark-light">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="h-full w-auto max-w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-text-muted text-sm mb-3">{member.bio}</p>
                  
                  <div className="flex space-x-3">
                    <a href={member.social.linkedin} className="text-text-muted hover:text-primary transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href={member.social.twitter} className="text-text-muted hover:text-primary transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-bg-dark-light p-8 rounded-xl border border-primary/20">
              <p className="text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-text-muted">Clients Served</p>
            </div>
            <div className="bg-bg-dark-light p-8 rounded-xl border border-primary/20">
              <p className="text-4xl font-bold text-primary mb-2">100+</p>
              <p className="text-text-muted">Projects Completed</p>
            </div>
            <div className="bg-bg-dark-light p-8 rounded-xl border border-primary/20">
              <p className="text-4xl font-bold text-primary mb-2">15+</p>
              <p className="text-text-muted">Team Members</p>
            </div>
            <div className="bg-bg-dark-light p-8 rounded-xl border border-primary/20">
              <p className="text-4xl font-bold text-primary mb-2">4</p>
              <p className="text-text-muted">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-bg-dark border-t border-b border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-xl text-text-muted mb-6">
            Let's discuss how we can help your business thrive digitally.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
            Contact Our Team
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
