import React, { useState } from 'react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  docUrl: string;
  details: string;
  children?: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  category,
  technologies,
  docUrl,
  details,
  children
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { elementRef, isVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div 
      ref={elementRef}
      className={cn(
        "tool-card bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl transform opacity-0 translate-y-10 transition-all duration-700",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-display text-2xl font-bold text-primary">{title}</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
          {category}
        </span>
      </div>
      
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        {description}
      </p>
      
      {/* Interactive demo element or custom content */}
      <div className="mb-6">
        {children}
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {technologies.map((tech, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-dark text-xs rounded">
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <a 
          href={docUrl} 
          className="text-primary hover:text-primary-dark transition-colors font-medium flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ph-github-logo"></i> Documentation
        </a>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="tool-details-btn px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Learn More'}
        </button>
      </div>

      {/* Tool details */}
      <div className={cn(
        "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all",
        showDetails ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <p className="text-gray-700 dark:text-gray-300">
          {details}
        </p>
      </div>
    </div>
  );
};

export default ToolCard;
