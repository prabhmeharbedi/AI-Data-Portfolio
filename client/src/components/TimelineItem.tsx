import React, { useState } from 'react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      ref={elementRef}
      className={cn(
        "timeline-item relative flex flex-col md:flex-row gap-8 mb-28 opacity-0 transform translate-y-8 transition-all duration-700",
        isVisible && "opacity-100 translate-y-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements - more subtle */}
      <div className="absolute -z-10 md:left-1/4 top-1/2 w-[25%] h-[250px] rounded-full opacity-20 blur-[100px] transition-all duration-500" 
        style={{
          background: `radial-gradient(circle, rgba(var(--primary-rgb), 0.2), rgba(var(--gradient-purple-rgb), 0.1))`,
          transform: isHovered ? 'scale(1.1) translateX(-8%)' : 'scale(1) translateX(0)',
        }}
      />
      
      {/* Year marker with animation - more elegant */}
      <div className="md:w-1/4 flex flex-col items-center md:items-end">
        <motion.div 
          className="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-display text-xl font-bold shadow-md"
          style={{
            background: `linear-gradient(135deg, var(--primary), var(--gradient-purple))`
          }}
          whileHover={{ scale: 1.05 }}
          animate={isHovered ? { 
            boxShadow: "0 0 15px rgba(var(--primary-rgb), 0.4)",
          } : {}}
        >
          {year}
          <div className="absolute w-full h-full rounded-full bg-primary/10 animate-ping" 
            style={{ animationDuration: '4s' }}
          />
        </motion.div>
        
        <div className="hidden md:block h-[180px] w-[1px] timeline-connector mt-4">
          <div className="h-full w-full bg-gradient-to-b from-primary/30 via-primary/20 to-transparent relative overflow-hidden">
            {isHovered && (
              <motion.div 
                className="absolute top-0 left-0 w-full h-full bg-white"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Content with more subtle styling and animations */}
      <motion.div 
        className="md:w-3/4 bg-white/80 dark:bg-[#202028]/85 backdrop-blur-sm p-7 rounded-xl shadow-sm overflow-hidden relative z-10 border border-gray-100/40 dark:border-gray-800/40"
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-primary/5 dark:bg-primary/3" />
        
        {/* Content */}
        <motion.h3 
          className="font-display text-2xl font-bold mb-2 relative z-10"
          style={{
            background: `linear-gradient(to right, var(--primary), var(--gradient-purple))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ x: 0 }}
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">{organization}</h4>
        
        <motion.p 
          className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0.95 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0.95 }}
        >
          {description}
        </motion.p>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.span 
              key={index} 
              className="px-3 py-1 bg-primary/8 dark:bg-primary/10 text-primary-dark dark:text-primary-light border border-primary/15 dark:border-primary/20 rounded-full text-xs font-medium"
              whileHover={{ 
                scale: 1.03, 
                backgroundColor: "rgba(var(--primary-rgb), 0.12)" 
              }}
              initial={{ y: 0 }}
              animate={isHovered ? { 
                y: [-0.5, 0.5, -0.5], 
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  delay: index * 0.08 
                } 
              } : {}}
            >
              {skill}
            </motion.span>
          ))}
        </div>
        
        {/* Subtle line decoration */}
        <div 
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-50"
        />
      </motion.div>
    </div>
  );
};

export default TimelineItem;
