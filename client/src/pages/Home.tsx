import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { userProfile, projects, skills } from '@/lib/utils';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';

const Home: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeSkillCategory, setActiveSkillCategory] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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

  const handleViewDetails = (id: number) => {
    setSelectedProjectId(id);
  };

  const handleCloseModal = () => {
    setSelectedProjectId(null);
  };

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
                    Generative AI & ML
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
                {/* Profile Image with faded edges */}
                <div 
                  className="absolute inset-2 rounded-full overflow-hidden z-10"
                  style={{
                    maskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)'
                  }}
                >
                  <img 
                    src="/images/me.jpg" 
                    alt={`${userProfile.name} - ${userProfile.title}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                <motion.div 
                  className="absolute inset-0 rounded-full bg-light dark:bg-dark z-5"
                  animate={{ 
                    boxShadow: ["inset 0 0 20px rgba(108, 99, 255, 0.3)", "inset 0 0 60px rgba(108, 99, 255, 0.6)", "inset 0 0 20px rgba(108, 99, 255, 0.3)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -inset-4 rounded-full border-2 border-primary/20 z-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -inset-12 rounded-full border border-primary/10 z-20"
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
      <section id="featured-projects" className="py-20 bg-light-darker/30 dark:bg-dark-lighter/30 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-1/4 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-light text-sm rounded-full mb-4 font-medium">
              My Work
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto">
              Explore some of my recent Generative AI and machine learning projects that showcase my skills and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  category={project.category}
                  technologies={project.technologies}
                  githubUrl={project.githubUrl}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <button 
              onClick={() => navigate('/projects')}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 font-medium"
            >
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </div>
        
        <ProjectModal 
          projectId={selectedProjectId} 
          onClose={handleCloseModal} 
        />
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
                  key={`${category}-${index}`