import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { userProfile, projects, skills } from '@/lib/utils';

const Home: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeSkillCategory, setActiveSkillCategory] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Featured projects (first 3)
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants}>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    Data Science & AI
                  </span>
                </motion.div>
                
                <motion.h1 
                  variants={itemVariants}
                  className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
                >
                  {userProfile.name}
                </motion.h1>
                
                <motion.h2 
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium"
                >
                  {userProfile.title}
                </motion.h2>
                
                <motion.p 
                  variants={itemVariants}
                  className="max-w-2xl text-lg leading-relaxed text-gray-800 dark:text-gray-100 font-medium"
                >
                  {userProfile.intro}
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/projects')}
                    className="py-3 px-8 bg-primary hover:bg-primary-dark text-white rounded-full transition-all shadow-md hover:shadow-xl"
                  >
                    View Projects
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="py-3 px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white dark:text-white rounded-full transition-all"
                  >
                    Get in Touch
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex gap-6 pt-4">
                  <a 
                    href={userProfile.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" 
                    aria-label="GitHub"
                  >
                    <i className="ph-github-logo"></i>
                  </a>
                  <a 
                    href={userProfile.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" 
                    aria-label="LinkedIn"
                  >
                    <i className="ph-linkedin-logo"></i>
                  </a>
                  <a 
                    href={userProfile.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" 
                    aria-label="Twitter"
                  >
                    <i className="ph-twitter-logo"></i>
                  </a>
                  <a 
                    href={userProfile.social.medium} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" 
                    aria-label="Medium"
                  >
                    <i className="ph-medium-logo"></i>
                  </a>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <motion.div 
                className="w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary via-primary/60 to-purple-300 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: "0 0 100px rgba(108, 99, 255, 0.5)"
                }}
                transition={{ duration: 1 }}
              >
                <motion.div 
                  className="absolute inset-2 rounded-full bg-light dark:bg-dark"
                  animate={{ 
                    boxShadow: ["inset 0 0 20px rgba(108, 99, 255, 0.3)", "inset 0 0 60px rgba(108, 99, 255, 0.6)", "inset 0 0 20px rgba(108, 99, 255, 0.3)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -inset-4 rounded-full border-2 border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -inset-12 rounded-full border border-primary/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <button 
            onClick={() => {
              const projectsSection = document.getElementById('featured-projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="block text-gray-700 dark:text-gray-300"
            aria-label="Scroll to Projects section"
          >
            <i className="ph-arrow-down text-2xl"></i>
          </button>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured-projects" className="py-20 bg-light-darker/30 dark:bg-dark-lighter/30">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium max-w-3xl mx-auto">
              Explore some of my recent data science and AI projects that showcase my skills and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-lighter/80 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                onClick={() => navigate(`/projects?id=${project.id}`)}
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="p-6">
                  <span className="text-xs font-semibold text-primary py-1 px-2 rounded-full bg-primary/10 mb-4 inline-block">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="text-xs font-medium bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button 
              onClick={() => navigate('/projects')}
              className="py-3 px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white dark:text-white rounded-full transition-all"
            >
              View All Projects
            </button>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Skills & Expertise</h2>
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and areas of expertise.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(skills).map((category) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`px-4 py-2 rounded-full font-medium shadow-sm ${
                  activeSkillCategory === category 
                    ? 'bg-primary text-white border-2 border-primary/50' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setActiveSkillCategory(
                  activeSkillCategory === category ? null : category
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>

          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {Object.entries(skills).map(([category, categorySkills]) => (
              (activeSkillCategory === null || activeSkillCategory === category) && 
              categorySkills.map((skill, index) => (
                <motion.div
                  key={`${category}-${index}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                  className="bg-gray-200 dark:bg-gray-900 rounded-lg shadow p-4 text-center border border-gray-300 dark:border-gray-700 flex items-center justify-center"
                >
                  <span className="text-gray-800 dark:text-gray-100 font-medium">{skill}</span>
                </motion.div>
              ))
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to collaborate?</h2>
            <p className="text-lg mb-8 text-white/80">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white text-primary hover:bg-white/90 py-3 px-8 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
