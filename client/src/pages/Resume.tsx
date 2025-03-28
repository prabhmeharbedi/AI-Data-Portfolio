import React from 'react';
import { motion } from 'framer-motion';

const Resume: React.FC = () => {
  return (
    <section id="resume" className="py-20 bg-light-darker dark:bg-dark relative min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Resume
        </motion.h2>
        
        {/* PDF embedded directly in the page */}
        <motion.div
          className="w-full h-[800px] rounded-lg overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <iframe 
            src="/files/resume.pdf" 
            className="w-full h-full border-0"
            title="Resume PDF"
          />
        </motion.div>
        
        {/* Floating download button */}
        <div className="fixed bottom-8 right-8 z-10">
          <a
            href="/files/resume.pdf"
            download
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            aria-label="Download Resume"
          >
            <i className="ph-file-pdf text-xl"></i>
            <span>Download Resume</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
