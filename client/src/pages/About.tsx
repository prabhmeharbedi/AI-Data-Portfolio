import React from 'react';
import TimelineItem from '@/components/TimelineItem';
import { timelineItems } from '@/lib/utils';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 min-h-screen pt-32 relative overflow-hidden bg-gray-50/20 dark:bg-gray-900/20">
      {/* Animated background elements - more subtle */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-60 dark:opacity-30">
        <div className="stars-container absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb), 0.6)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        {/* Constellation lines - more minimal */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M100,200 C150,150 200,250 300,200 C400,150 500,250 600,200"
            stroke="rgba(var(--primary-rgb), 0.15)"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '18s' }}
          />
          <path
            d="M200,400 C250,350 350,450 400,400 C500,350 550,450 700,400"
            stroke="rgba(var(--primary-rgb), 0.1)"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '24s' }}
          />
        </svg>
        
        {/* Gradient orbs - more subtle */}
        <div 
          className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[150px] animate-float" 
          style={{ 
            background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.12), rgba(var(--gradient-purple-rgb), 0.08))',
            animationDuration: '35s' 
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full blur-[150px] animate-float-reverse" 
          style={{ 
            background: 'radial-gradient(circle, rgba(var(--gradient-blue-rgb), 0.1), rgba(var(--primary-rgb), 0.06))',
            animationDuration: '30s' 
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-3 py-1 bg-primary/8 text-primary-dark dark:text-primary-light text-xs rounded-full mb-4 font-medium shadow-sm border border-primary/10">
            My Story
          </span>
          
          <motion.h2 
            className="font-display text-4xl md:text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, var(--primary), var(--gradient-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            My Journey
          </motion.h2>
          
          <motion.p
            className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore the milestones that have shaped my career and expertise in data science and AI
          </motion.p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Timeline axis decoration - more subtle */}
          <div className="hidden md:block absolute left-1/4 top-0 w-[1px] h-full transform -translate-x-1/2">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-primary/15 to-transparent opacity-40" />
          </div>
          
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
          
          {/* End decoration - more subtle */}
          <motion.div 
            className="hidden md:flex w-16 h-16 mx-auto rounded-full bg-white/60 dark:bg-dark-lighter/40 backdrop-blur-sm border border-primary/15 items-center justify-center text-primary-dark dark:text-primary-light shadow-sm"
            initial={{ scale: 0.9, opacity: 0.7 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
