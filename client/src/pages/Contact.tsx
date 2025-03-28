import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { userProfile } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/contact', data);
      
      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        reset();
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 min-h-screen pt-32 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-1/4 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div className="absolute top-40 left-10 w-20 h-20 border-2 border-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-32 h-32 border border-primary/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      <motion.div 
        className="absolute top-1/3 left-1/4 w-3 h-3 bg-primary rounded-full"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.2, 1, 0.2]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-secondary rounded-full"
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.1, 0.8, 0.1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-light text-sm rounded-full mb-4 font-medium">
            Say Hello
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to collaborate.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-5 relative">
              {/* Geometric pattern overlay for left panel */}
              <div className="absolute inset-0 lg:right-3/5 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full"></div>
                <div className="absolute bottom-0 -right-10 w-60 h-60 bg-secondary/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl"></div>
              </div>
              
              {/* Contact info sidebar */}
              <div className="lg:col-span-2 bg-gradient-to-br from-primary to-purple-700 text-white p-10 relative overflow-hidden">
                {/* Animated light effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_60%)]"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-display text-2xl font-bold mb-8 relative">
                    Contact Information
                    <span className="block w-20 h-1 bg-white/30 mt-3 rounded-full"></span>
                  </h3>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <i className="ph-envelope text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Email</h4>
                        <a href={`mailto:${userProfile.email}`} className="text-white/80 hover:text-white transition-colors">
                          {userProfile.email}
                        </a>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <i className="ph-map-pin text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Location</h4>
                        <p className="text-white/80">{userProfile.location}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <i className="ph-calendar text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Availability</h4>
                        <p className="text-white/80">{userProfile.availability}</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="mt-12">
                    <h4 className="font-bold mb-4 text-lg relative">
                      Connect
                      <span className="block w-12 h-1 bg-white/30 mt-2 rounded-full"></span>
                    </h4>
                    <div className="flex gap-4">
                      <motion.a 
                        href={userProfile.social.github}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/30 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-glow" 
                        aria-label="GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
                      >
                        <i className="ph-github-logo text-xl"></i>
                      </motion.a>
                      <motion.a 
                        href={userProfile.social.linkedin}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/30 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-glow" 
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
                      >
                        <i className="ph-linkedin-logo text-xl"></i>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Contact form */}
              <div className="lg:col-span-3 p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="font-display text-2xl font-bold mb-6 text-primary relative">
                    Send Me a Message
                    <span className="block w-20 h-1 bg-primary/30 mt-2 rounded-full"></span>
                  </h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Name</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="name" 
                            className="w-full px-5 py-3 rounded-xl border border-gray-200/80 dark:border-gray-600/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-gray-100 transition-all" 
                            placeholder="Your name"
                            {...register('name')}
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="ph-user"></i>
                          </div>
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Email</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full px-5 py-3 rounded-xl border border-gray-200/80 dark:border-gray-600/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-gray-100 transition-all" 
                            placeholder="Your email"
                            {...register('email')}
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="ph-envelope"></i>
                          </div>
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Subject</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="subject" 
                          className="w-full px-5 py-3 rounded-xl border border-gray-200/80 dark:border-gray-600/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-gray-100 transition-all" 
                          placeholder="What's this about?"
                          {...register('subject')}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <i className="ph-chat-text"></i>
                        </div>
                      </div>
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.subject.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-8">
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Message</label>
                      <div className="relative">
                        <textarea 
                          id="message" 
                          rows={5} 
                          className="w-full px-5 py-3 rounded-xl border border-gray-200/80 dark:border-gray-600/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-gray-100 transition-all" 
                          placeholder="Your message"
                          {...register('message')}
                        />
                        <div className="absolute right-4 top-6 text-gray-400">
                          <i className="ph-text-align-left"></i>
                        </div>
                      </div>
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden group"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 w-9/12 mx-auto h-full bg-white/20 skew-x-[-20deg] transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                      
                      <span className="relative flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <i className="ph-paper-plane-right text-lg"></i>
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
