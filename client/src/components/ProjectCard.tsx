import React from 'react';
import { cn } from '@/lib/utils';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  githubUrl: string | null;
  onViewDetails: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  image,
  category,
  technologies,
  githubUrl,
  onViewDetails
}) => {
  const { elementRef, isVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div 
      ref={elementRef}
      className={cn(
        "project-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full flex flex-col transform opacity-0 translate-y-10 transition-all duration-700 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="h-52 overflow-hidden relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/30"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-md backdrop-blur-sm shadow-lg border border-white/20">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-bold mb-3 text-primary dark:text-primary-light">
          {title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-md border border-gray-200 dark:border-gray-600 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          {githubUrl ? (
            <a 
              href={githubUrl} 
              className="text-primary dark:text-primary-light hover:underline flex items-center gap-1 text-sm font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ph-github-logo text-lg"></i> View Code
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
              <i className="ph-lock text-lg"></i> Private Repository
            </span>
          )}
          <button 
            onClick={() => onViewDetails(id)}
            className="view-project-details text-sm px-4 py-2 bg-primary text-white rounded-md transition-colors hover:bg-primary-dark shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
