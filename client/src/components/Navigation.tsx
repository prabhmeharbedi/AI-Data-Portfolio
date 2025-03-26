import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

interface NavigationProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ theme, toggleTheme }) => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full py-4 px-6 md:px-12 backdrop-blur-lg z-40 transition-all duration-300",
        "bg-light/80 dark:bg-dark/80",
        isScrolled && "shadow-md py-3"
      )}>
        <div className="flex justify-between items-center">
          <Link href="/" className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-primary rounded-full"></span>
            PurplePlanet
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "font-medium transition-colors",
                  location === link.href ? "text-primary" : "hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            
            <button 
              id="chatToggle" 
              onClick={() => document.dispatchEvent(new CustomEvent('toggleChat'))}
              className="flex items-center gap-2 py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-full transition-all shadow-lg hover:shadow-xl"
              aria-label="Open AI assistant"
            >
              <i className="ph-robot text-xl"></i>
              <span className="hidden md:inline">AI Assistant</span>
            </button>
            
            <button 
              className="md:hidden p-2" 
              aria-label="Open mobile menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <i className="ph-list text-2xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile navigation menu */}
      <div className={cn(
        "fixed inset-0 bg-dark/95 z-50 flex flex-col items-center justify-center gap-8 text-white text-xl transition-all duration-300",
        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        <button 
          className="absolute top-6 right-6"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <i className="ph-x text-2xl"></i>
        </button>
        {navLinks.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className="hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navigation;
