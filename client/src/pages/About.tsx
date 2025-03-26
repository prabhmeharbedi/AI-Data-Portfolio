import React from 'react';
import TimelineItem from '@/components/TimelineItem';
import { timelineItems } from '@/lib/utils';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Journey
        </motion.h2>
        
        <div className="max-w-5xl mx-auto">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={index}
              year={item.year}
              title={item.title}
              organization={item.organization}
              description={item.description}
              skills={item.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
