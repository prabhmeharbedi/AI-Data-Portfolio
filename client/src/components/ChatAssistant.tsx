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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-4 w-full max-w-sm overflow-hidden origin-bottom-right border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="ph-robot"></i>
                </div>
                <h3 className="font-display font-bold">AI Assistant</h3>
              </div>
              <button 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <i className="ph-x"></i>
              </button>
            </div>
            
            <div className="h-80 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex items-start gap-3",
                      msg.isUser && "justify-end"
                    )}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                        <i className="ph-robot"></i>
                      </div>
                    )}
                    
                    <div className={cn(
                      "p-3 rounded-lg max-w-[80%]",
                      msg.isUser 
                        ? "chat-bubble-user bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600" 
                        : "chat-bubble-ai bg-primary/10 dark:bg-primary/20 border border-primary/10 dark:border-primary/30"
                    )}>
                      <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    
                    {msg.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0">
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
                    <div className="chat-bubble-ai bg-primary/10 dark:bg-primary/20 p-3 rounded-lg border border-primary/10 dark:border-primary/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <form className="mt-auto flex gap-2" onSubmit={sendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-white text-sm"
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
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <i className={`text-xl ${isOpen ? 'ph-x' : 'ph-chats'}`}></i>
      </motion.button>
    </div>
  );
};

export default ChatAssistant;
