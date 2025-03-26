import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { skills } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
}

const Resume: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      message: "Hi! I'm Sarah's digital assistant. You can ask me about her experience, skills, projects, or anything else you'd like to know. How can I help you today?",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => nanoid());

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (!message || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: nanoid(),
      message,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        sessionId
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiMessage: ChatMessage = {
          id: nanoid(),
          message: data.message,
          isUser: false
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: nanoid(),
        message: "I'm having trouble connecting right now. Please try again later.",
        isUser: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="resume" className="py-20 bg-light-darker dark:bg-dark relative min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Resume & Experience
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Resume Download */}
          <motion.div 
            className="bg-white dark:bg-dark-lighter p-8 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display text-2xl font-bold mb-6 text-primary">Download Resume</h3>
            
            <p className="mb-8 text-gray-700 dark:text-gray-300">
              Get a comprehensive overview of my skills, experience, and education in a traditional resume format.
            </p>
            
            <a href="#" className="inline-flex items-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-full transition-all shadow-md hover:shadow-lg">
              <i className="ph-file-pdf text-xl"></i>
              Download PDF Resume
            </a>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-bold mb-4">Core Skills & Technologies</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-primary mb-2">Languages</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {skills.languages.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="ph-check-circle text-primary"></i>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-primary mb-2">ML/AI</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {skills.mlai.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="ph-check-circle text-primary"></i>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-primary mb-2">Data</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {skills.data.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="ph-check-circle text-primary"></i>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-primary mb-2">Web/Cloud</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {skills.webcloud.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="ph-check-circle text-primary"></i>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* AI Resume Assistant */}
          <motion.div 
            className="bg-white dark:bg-dark-lighter rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6 bg-primary text-white">
              <h3 className="font-display text-2xl font-bold mb-2">Ask About My Experience</h3>
              <p className="text-white/80">
                My GPT-4 powered assistant can answer questions about my skills, experience, and background.
              </p>
            </div>
            
            <div className="p-6 h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : ''}`}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                        <i className="ph-robot"></i>
                      </div>
                    )}
                    
                    <div className={`${msg.isUser ? 'chat-bubble-user bg-gray-100 dark:bg-dark' : 'chat-bubble-ai bg-primary/10'} p-3 rounded-lg max-w-[80%]`}>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    
                    {msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-lighter flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                        <i className="ph-user"></i>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                      <i className="ph-robot"></i>
                    </div>
                    <div className="chat-bubble-ai bg-primary/10 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form className="mt-auto" onSubmit={handleChatSubmit}>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask me anything about my experience..." 
                    className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary dark:bg-dark-lighter dark:text-white text-sm"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <i className="ph-paper-plane-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
