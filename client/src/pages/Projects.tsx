import React, { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { projects } from '@/lib/utils';
import { motion } from 'framer-motion';

const Projects: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleViewDetails = (id: number) => {
    setSelectedProjectId(id);
  };

  const handleCloseModal = () => {
    setSelectedProjectId(null);
  };

  const handleViewMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, projects.length));
  };

  return (
    <section id="projects" className="py-20 bg-light-darker dark:bg-dark relative min-h-screen pt-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-1/4 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-light text-sm rounded-full mb-4 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            My Work
          </motion.span>
          
          <motion.h2 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore some of my recent Generative AI and machine learning projects that showcase my skills and expertise.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {projects.slice(0, visibleCount).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                category={project.category}
                technologies={project.technologies}
                githubUrl={project.githubUrl}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
          
        {/* Show more projects button */}
        {visibleCount < projects.length && (
          <div className="text-center mt-16">
            <motion.button 
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 font-medium"
              onClick={handleViewMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View More Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
      
      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default Projects;
