import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      message: "Hi there! I'm Prabhmehar's AI assistant, powered by GPT-4o. I can answer questions specifically about Prabhmehar's resume, work experience, skills, and projects. Feel free to ask me anything about his professional background!",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => nanoid());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for toggle chat events from other components
    const handleToggleChat = () => setIsOpen(prev => !prev);
    document.addEventListener('toggleChat', handleToggleChat);
    
    return () => {
      document.removeEventListener('toggleChat', handleToggleChat);
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (!message) return;
    
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-full max-w-md overflow-hidden origin-bottom-right rounded-2xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(145deg, rgba(22, 16, 48, 0.8), rgba(45, 20, 107, 0.9))',
              boxShadow: '0 10px 40px rgba(108, 99, 255, 0.3)'
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="p-5 flex justify-between items-center relative z-10 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <i className="ph-robot text-white"></i>
                  </div>
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-white text-xl">AI Assistant</h3>
                  <p className="text-xs text-white/70">Powered by Prabhmehar's Brain!!</p>
                </div>
              </div>
              <button 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex items-center justify-center"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat assistant"
              >
                <i className="ph-x"></i>
              </button>
            </div>
            
            <div className="h-[calc(70vh-150px)] max-h-[500px] flex flex-col p-5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-purple-900/10 pointer-events-none"></div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-indigo-700/30 scrollbar-track-transparent relative z-10">
                {messages.map(msg => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-start gap-3",
                      msg.isUser && "justify-end"
                    )}
                  >
                    {!msg.isUser && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                        <i className="ph-robot"></i>
                      </div>
                    )}
                    
                    <div className={cn(
                      "p-3.5 rounded-2xl max-w-[85%] shadow-lg",
                      msg.isUser 
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white" 
                        : "bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-white/10 text-white"
                    )}>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                    
                    {msg.isUser && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-400/20">
                        <i className="ph-user"></i>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                      <i className="ph-robot"></i>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-white/10 text-white shadow-lg">
                      <div className="flex gap-1.5">
                        <motion.div 
                          animate={{ 
                            y: [0, -6, 0] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1,
                            ease: "easeInOut",
                            delay: 0 
                          }}
                          className="w-2.5 h-2.5 rounded-full bg-indigo-400"
                        ></motion.div>
                        <motion.div 
                          animate={{ 
                            y: [0, -6, 0] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1,
                            ease: "easeInOut",
                            delay: 0.2
                          }}
                          className="w-2.5 h-2.5 rounded-full bg-purple-400"
                        ></motion.div>
                        <motion.div 
                          animate={{ 
                            y: [0, -6, 0] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1,
                            ease: "easeInOut",
                            delay: 0.4
                          }}
                          className="w-2.5 h-2.5 rounded-full bg-pink-400"
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <form className="mt-5 flex gap-2 relative z-10 pt-3 border-t border-white/10" onSubmit={sendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-5 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 bg-white/5 text-white placeholder-white/50 shadow-inner backdrop-blur-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Send message"
                >
                  <i className="ph-paper-plane-right text-lg"></i>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(108, 99, 255, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Toggle chat assistant"
      >
        <i className={`text-xl ${isOpen ? 'ph-x' : 'ph-chats'}`}></i>
      </motion.button>
    </div>
  );
};

export default ChatAssistant;
