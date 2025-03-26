import React, { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { projects } from '@/lib/utils';
import { motion } from 'framer-motion';

const Projects: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

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
    <section id="projects" className="py-20 bg-light-darker dark:bg-dark relative min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, visibleCount).map(project => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              category={project.category}
              technologies={project.technologies}
              githubUrl={project.githubUrl}
              onViewDetails={handleViewDetails}
            />
          ))}
          
          {/* Show more projects button */}
          {visibleCount < projects.length && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-12">
              <motion.button 
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all shadow-md hover:shadow-lg"
                onClick={handleViewMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View More Projects
              </motion.button>
            </div>
          )}
        </div>
      </div>
      
      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default Projects;
