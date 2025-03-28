import React, { useEffect } from 'react';
import { projects } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      {project && (
        <motion.div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 z-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="project-detail-content">
              <div className="h-72 md:h-96 w-full overflow-hidden mb-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-800 opacity-70"></div>
              </div>
              
              <div className="px-8 py-10 -mt-16 relative">
                <span className="inline-block px-4 py-1 bg-primary text-white rounded-full text-sm font-medium shadow-md mb-4">
                  {project.category}
                </span>
                
                <h2 className="font-display text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                  {project.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm border border-gray-200 dark:border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                      <span className="bg-primary/10 text-primary p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Project Overview
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10">
                      {project.details.overview}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                      <span className="bg-primary/10 text-primary p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </span>
                      Technical Details
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10">
                      {project.details.technical}
                    </p>
                    
                    <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg mt-6 overflow-x-auto shadow-inner border border-gray-200 dark:border-gray-700">
                      <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono"><code>{project.details.codeSnippet}</code></pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                      <span className="bg-primary/10 text-primary p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                      Results & Impact
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10">
                      {project.details.impact}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      className="py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      className="py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  {!project.liveUrl && !project.githubUrl && (
                    <span className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Private Project
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
