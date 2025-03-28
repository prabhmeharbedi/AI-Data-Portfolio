import React from 'react';
import ToolCard from '@/components/ToolCard';
import { aiTools } from '@/lib/utils';
import { motion } from 'framer-motion';

const AITools: React.FC = () => {
  return (
    <section id="ai-tools" className="py-20 min-h-screen pt-32 bg-light-darker dark:bg-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-1/4 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-light text-sm rounded-full mb-4 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            AI Innovations
          </motion.span>
          
          <motion.h2 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AI Tools & Experiments
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore my custom AI tools and experiments focused on practical applications of artificial intelligence.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {aiTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.4 }}
            >
              <ToolCard
                title={tool.title}
                description={tool.description}
                category={tool.category}
                technologies={tool.technologies}
                docUrl={tool.docUrl}
                details={tool.details}
              >
                {index === 0 ? (
                  // RAG Code Generation Demo
                  <div className="bg-code-pattern h-64 bg-cover bg-center relative rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-900/90"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="px-3 py-1 bg-primary text-white text-xs rounded-md w-fit backdrop-blur-sm">
                          Vector Search
                        </div>
                        <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-white text-xs">Ready for code generation</span>
                        </div>
                      </div>
                      
                      <div className="text-gray-300 text-sm font-mono opacity-90">
                        <div className="mb-1">
                          <span className="text-blue-400">const</span> <span className="text-green-400">findSimilarCode</span> = <span className="text-yellow-400">async</span>(<span className="text-orange-400">query</span>) =&gt; {'{'} 
                        </div>
                        <div className="mb-1 ml-4">
                          <span className="text-blue-400">const</span> results = <span className="text-blue-400">await</span> vectorDB.<span className="text-green-400">similaritySearch</span>(query);
                        </div>
                        <div className="mb-1 ml-4">
                          <span className="text-blue-400">return</span> results.<span className="text-green-400">map</span>(r =&gt; r.metadata);
                        </div>
                        <div>{'}'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // RAGAS Evaluation Framework Demo
                  <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md w-fit backdrop-blur-sm">
                          Evaluation Metrics
                        </div>
                        <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-white text-xs">Live monitoring</span>
                        </div>
                      </div>
                      
                      <div className="h-40 relative">
                        <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-between px-2">
                          {['Context', 'Faithfulness', 'Answer', 'Coherence'].map((metric, i) => (
                            <div key={metric} className="w-1/5 flex flex-col items-center gap-2">
                              <div className="relative w-full flex justify-center">
                                <motion.div 
                                  className={`w-10 rounded-t-lg ${['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'][i]}`}
                                  initial={{ height: 0 }}
                                  animate={{ height: [70, 85, 60, 78][i] }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                />
                                <div className="absolute -top-6 text-center text-white text-xs font-medium">
                                  {[87, 92, 76, 84][i]}%
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{metric}</div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Average score line */}
                        <div className="absolute left-0 right-0 h-[1px] bg-yellow-500 top-[30%] border-dashed border-t border-yellow-500 z-10 flex items-center">
                          <div className="bg-gray-900 text-yellow-500 text-xs px-2 absolute -right-2 rounded">
                            Target: 85%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ToolCard>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <motion.a 
            href="https://github.com/prabhmeharbedi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View More Projects on GitHub
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default AITools;
