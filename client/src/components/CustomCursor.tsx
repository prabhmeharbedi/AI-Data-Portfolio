import { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };
    
    // Check initial screen size
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Only setup custom cursor on large screens
    if (window.innerWidth > 1024) {
      const updatePosition = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };
      
      const handleMouseEnter = () => setIsVisible(true);
      const handleMouseLeave = () => setIsVisible(false);
      
      document.addEventListener('mousemove', updatePosition);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', checkScreenSize);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!isLargeScreen) return null;

  return (
    <div 
      className="custom-cursor fixed w-8 h-8 rounded-full bg-primary z-50 pointer-events-none mix-blend-difference transition-opacity duration-300"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        opacity: isVisible ? 1 : 0
      }}
    />
  );
};

export default CustomCursor;
