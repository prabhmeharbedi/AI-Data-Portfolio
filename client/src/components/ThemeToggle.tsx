import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="p-2 rounded-full bg-light-darker dark:bg-dark-lighter" 
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
    >
      <i className={`ph-sun-dim ${theme === 'dark' ? 'inline-block' : 'hidden'} text-xl`}></i>
      <i className={`ph-moon ${theme === 'light' ? 'inline-block' : 'hidden'} text-xl`}></i>
    </button>
  );
};

export default ThemeToggle;
