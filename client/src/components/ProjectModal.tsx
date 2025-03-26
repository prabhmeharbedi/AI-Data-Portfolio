import React, { useEffect } from 'react';
import { projects } from '@/lib/utils';

interface ProjectModalProps {
  projectId: number | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ projectId, onClose }) => {
  const project = projectId !== null ? projects.find(p => p.id === projectId) : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    
    // Prevent body scrolling when modal is open
    if (projectId !== null) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [projectId, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-dark-lighter rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button 
          className="absolute top-4 right-4 text-2xl z-10 bg-white/10 backdrop-blur-sm p-2 rounded-full"
          onClick={onClose}
        >
          <i className="ph-x"></i>
        </button>
        
        <div className="project-detail-content p-8">
          <div className="h-64 md:h-80 w-full overflow-hidden rounded-xl mb-8">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="font-display text-3xl font-bold mb-4 text-primary">{project.title}</h2>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {tech}
              </span>
            ))}
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {project.category}
            </span>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3">Project Overview</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {project.details.overview}
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3">Technical Details</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {project.details.technical}
            </p>
            
            <div className="bg-gray-100 dark:bg-dark p-4 rounded-lg mt-4 overflow-x-auto">
              <pre className="text-sm"><code>{project.details.codeSnippet}</code></pre>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3">Results & Impact</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {project.details.impact}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <a 
              href={project.liveUrl} 
              className="py-2 px-6 bg-primary hover:bg-primary-dark text-white rounded-full transition-all flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ph-globe"></i> Live Demo
            </a>
            <a 
              href={project.githubUrl} 
              className="py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ph-github-logo"></i> View Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
