import React from 'react';
import ToolCard from '@/components/ToolCard';
import { aiTools } from '@/lib/utils';
import { motion } from 'framer-motion';

const AITools: React.FC = () => {
  return (
    <section id="ai-tools" className="py-20 min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI Tools & Experiments
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {aiTools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              category={tool.category}
              technologies={tool.technologies}
              docUrl={tool.docUrl}
              details={tool.details}
            >
              {index === 0 ? (
                // TextVision Analyzer Demo
                <div className="bg-white dark:bg-dark-lighter p-4 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <i className="ph-upload-simple text-2xl text-primary"></i>
                    </div>
                    <div>
                      <p className="font-medium">Upload an image with text</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: JPG, PNG, PDF</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <i className="ph-image text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
                    <p className="text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
                  </div>
                </div>
              ) : (
                // TimeSeries Forecaster Demo
                <div className="bg-white dark:bg-dark-lighter p-4 rounded-xl h-48 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-32 px-4 flex items-end justify-between">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                        <div key={month} className="h-full flex flex-col justify-end items-center gap-2">
                          <motion.div 
                            className="w-2 bg-primary rounded-t-full"
                            initial={{ height: '0%' }}
                            animate={{ height: `${[40, 65, 50, 75, 85, 60][i]}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                          <div className="text-xs text-gray-500 dark:text-gray-400">{month}</div>
                        </div>
                      ))}
                      
                      {/* Predictions with different color */}
                      {['Jul', 'Aug'].map((month, i) => (
                        <div key={month} className="h-full flex flex-col justify-end items-center gap-2">
                          <motion.div 
                            className="w-2 bg-secondary rounded-t-full"
                            initial={{ height: '0%' }}
                            animate={{ height: `${[70, 80][i]}%` }}
                            transition={{ duration: 1, delay: (i + 6) * 0.1 }}
                          />
                          <div className="text-xs text-gray-500 dark:text-gray-400">{month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ToolCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AITools;
