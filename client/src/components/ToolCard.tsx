import React, { useState } from 'react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
        "tool-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl transform opacity-0 translate-y-10 transition-all duration-700 border border-gray-200 dark:border-gray-700",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h3>
            <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full shadow-sm self-start md:self-auto">
              {category}
            </span>
          </div>
          
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Interactive demo element or custom content */}
        <div className="px-6 mb-6 flex-grow">
          {children}
        </div>
        
        <div className="px-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-md border border-gray-200 dark:border-gray-600 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="px-6 pt-4 pb-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center mt-auto">
          <a 
            href={docUrl} 
            className="text-primary dark:text-primary-light hover:underline transition-colors font-medium flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentation
          </a>
          <motion.button 
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showDetails ? 'Hide Details' : 'Learn More'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>

        {/* Tool details */}
        <div className={cn(
          "px-6 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-500",
          showDetails ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 py-0 overflow-hidden"
        )}>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
