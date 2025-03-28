import React from 'react';
import { Link } from 'wouter';
import { userProfile } from '@/lib/utils';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-dark text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <Link href="/" className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-8 h-8 bg-primary rounded-full"></span>
              Prabhmehar
            </Link>
            <p className="text-gray-400 mt-2">Data Science & AI Portfolio</p>
          </div>
          
          <div className="flex gap-8 flex-wrap justify-center">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link>
            <Link href="/ai-tools" className="text-gray-400 hover:text-white transition-colors">AI Tools</Link>
            <Link href="/resume" className="text-gray-400 hover:text-white transition-colors">Resume</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="flex gap-4">
            <a href={userProfile.social.github} className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary flex items-center justify-center transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <i className="ph-github-logo"></i>
            </a>
            <a href={userProfile.social.linkedin} className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary flex items-center justify-center transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="ph-linkedin-logo"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Prabhmehar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
