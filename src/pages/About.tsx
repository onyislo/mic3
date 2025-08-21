import React from 'react';
import { Linkedin, Twitter, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Hillary Lihand',
      role: 'CEO & Founder',
      bio: 'Hillary brings over 15 years of experience in technology innovation and business leadership. With a background in computer science and business administration, he has successfully led multiple tech initiatives and startups to success.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder image
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      name: 'Sarah Mwangi',
      role: 'Chief Technology Officer',
      bio: 'Sarah leads our technical team with expertise in cloud architecture and enterprise solutions. Her innovative approach to technology challenges has been instrumental in our product development.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg', // Placeholder image
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      }
    },
    {
      name: 'David Ochieng',
      role: 'Head of Development',
      bio: 'David oversees our development teams and ensures high-quality code standards across all projects. His technical leadership has shaped our development practices and client solutions.',
      image: 'https://randomuser.me/api/portraits/men/67.jpg', // Placeholder image
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
                MIC3 Solution Group was founded in 2020 with a mission to help businesses leverage technology 
                to solve complex problems and drive growth. What began as a small consultancy has grown into 
                a comprehensive digital solutions provider serving clients across East Africa and beyond.
              </p>
              <p className="text-text-muted mb-5 leading-relaxed">
                Our journey started when our founder, Hillary Lihand, identified a gap in the market for 
                high-quality, personalized technology services that truly understand the unique challenges 
                of African businesses. Since then, we've assembled a team of talented professionals who 
                share our passion for innovation and excellence.
              </p>
              <p className="text-text-muted leading-relaxed">
                Today, we're proud to have helped dozens of organizations transform their operations, 
                reach new customers, and achieve their business objectives through our tailored digital solutions.
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
              These core principles guide everything we do as we work to deliver exceptional solutions for our clients.
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
              Meet the talented individuals behind MIC3 Solution Group who drive our vision and success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-bg-dark rounded-xl overflow-hidden border border-primary/20 group hover:border-primary/40 transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-text-muted text-sm mb-4">{member.bio}</p>
                  
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
            Contact us today to discuss how MIC3 Solution Group can help your business thrive in the digital landscape.
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
