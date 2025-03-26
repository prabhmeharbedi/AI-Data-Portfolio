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
    <section id="contact" className="py-20 min-h-screen pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          className="font-display text-3xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Contact info sidebar */}
              <div className="lg:col-span-2 bg-gradient-to-br from-primary to-secondary text-white p-8">
                <h3 className="font-display text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <i className="ph-envelope text-xl mt-1"></i>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <a href={`mailto:${userProfile.email}`} className="text-white/80 hover:text-white transition-colors">
                        {userProfile.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <i className="ph-map-pin text-xl mt-1"></i>
                    <div>
                      <h4 className="font-bold">Location</h4>
                      <p className="text-white/80">{userProfile.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <i className="ph-calendar text-xl mt-1"></i>
                    <div>
                      <h4 className="font-bold">Availability</h4>
                      <p className="text-white/80">{userProfile.availability}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h4 className="font-bold mb-4">Connect</h4>
                  <div className="flex gap-4">
                    <a 
                      href={userProfile.social.github}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" 
                      aria-label="GitHub"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="ph-github-logo"></i>
                    </a>
                    <a 
                      href={userProfile.social.linkedin}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" 
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="ph-linkedin-logo"></i>
                    </a>
                    <a 
                      href={userProfile.social.twitter}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" 
                      aria-label="Twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="ph-twitter-logo"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact form */}
              <div className="lg:col-span-3 p-8">
                <h3 className="font-display text-2xl font-bold mb-6 text-primary">Send Me a Message</h3>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-gray-100" 
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-gray-100" 
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-gray-100" 
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Message</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-gray-100" 
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="ph-paper-plane-right"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
