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
  githubUrl: string;
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
        "project-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col transform opacity-0 translate-y-10 transition-all duration-700 border border-gray-200 dark:border-gray-700",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-bold mb-2 text-primary">
          {title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded border border-gray-200 dark:border-gray-600 font-medium">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <a 
            href={githubUrl} 
            className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="ph-github-logo"></i> View Code
          </a>
          <button 
            onClick={() => onViewDetails(id)}
            className="view-project-details text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
