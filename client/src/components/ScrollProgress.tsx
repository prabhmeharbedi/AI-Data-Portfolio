import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / windowHeight) * 100;
      
      setScrollPercentage(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="h-[3px] bg-gradient-to-r from-primary to-accent fixed top-0 left-0 z-50 transition-all duration-150"
      style={{ width: `${scrollPercentage}%` }}
    ></div>
  );
};

export default ScrollProgress;
