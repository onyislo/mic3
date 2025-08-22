import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPortfolioItems } from '../services/portfolioService';
import { ArrowLeft, ExternalLink, Tag, Layers } from 'lucide-react';

interface PortfolioProject {
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  featured?: boolean;
}

export const ProjectDetail: React.FC = () => {
  const { projectTitle } = useParams<{ projectTitle: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!projectTitle) {
          setError('No project title provided');
          setLoading(false);
          return;
        }

        // Decode the title from URL
        const decodedTitle = decodeURIComponent(projectTitle);
        
        // Fetch all portfolio items
        const portfolioItems = await getPortfolioItems();
        
        // Convert from API format to UI format
        const uiProjects: PortfolioProject[] = portfolioItems.map(item => ({
          title: item["Project Title"],
          category: item["Category"],
          description: item["Description"],
          image: item["Image URL"],
          technologies: item["Technologies (comma-separated)"]?.split(',').map((t: string) => t.trim()) || [],
          featured: item.featured,
          link: '#'
        }));
        
        // Find the project that matches the title
        const foundProject = uiProjects.find(p => p.title === decodedTitle);
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Error loading project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectTitle]);

  // Function to go back to portfolio
  const handleGoBack = () => {
    navigate('/portfolio');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-light flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-light p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-text-muted mb-6">{error || 'Project not found'}</p>
          <button 
            onClick={handleGoBack}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-light py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Portfolio
          </button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center text-primary">
              <Tag className="h-5 w-5 mr-2" />
              <span>{project.category}</span>
            </div>
            {project.technologies && (
              <div className="flex items-center text-text-muted">
                <Layers className="h-5 w-5 mr-2" />
                <span>{project.technologies.length} Technologies</span>
              </div>
            )}
            {project.link && project.link !== '#' && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-text-muted hover:text-primary"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                <span>Visit Project</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Image */}
        <div className="mb-8 bg-primary/10 p-1 rounded-xl">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Project Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
          <p className="text-text-muted mb-6 text-lg leading-relaxed">
            {project.description}
          </p>
          
          {/* Expanded description (placeholder) */}
          <p className="text-text-muted mb-6 leading-relaxed">
            This project was designed to address specific challenges in {project.category}. 
            Our team worked closely with the client to understand their requirements and deliver 
            a solution that exceeded expectations. The implementation involved careful planning, 
            iterative development, and extensive testing to ensure a high-quality result.
          </p>
          <p className="text-text-muted leading-relaxed">
            The final solution has helped our client improve their operational efficiency, 
            reach a wider audience, and achieve their business objectives.
          </p>
        </div>

        {/* Technologies Used */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-bg-dark-light text-text-light rounded-lg border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Gallery - Placeholder */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-bg-dark-light p-1 rounded-lg">
                <div className="bg-bg-dark-light h-48 rounded-lg flex items-center justify-center">
                  <span className="text-text-muted">Gallery Image {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Projects CTA */}
        <div className="text-center py-8 border-t border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Interested in Similar Projects?</h2>
          <button 
            onClick={handleGoBack}
            className="bg-primary hover:bg-primary-dark text-white py-3 px-8 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            View More Projects
            <ArrowLeft className="ml-2 h-5 w-5 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
