import React from 'react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  year: string;
  title: string;
  organization: string;
  description: string;
  skills: string[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  organization,
  description,
  skills
}) => {
  const { elementRef, isVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div 
      ref={elementRef}
      className={cn(
        "timeline-item flex flex-col md:flex-row gap-8 mb-24 opacity-0 transform translate-y-8 transition-all duration-700",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      {/* Year marker */}
      <div className="md:w-1/4 flex flex-col items-center md:items-end">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-display text-xl font-bold">
          {year}
        </div>
        <div className="hidden md:block h-full w-1 timeline-connector mt-4 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="md:w-3/4 bg-white dark:bg-dark-lighter p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
        <h3 className="font-display text-2xl font-bold mb-3 text-primary">{title}</h3>
        <h4 className="text-lg font-medium mb-4 text-gray-600 dark:text-gray-300">{organization}</h4>
        <p className="mb-6 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
