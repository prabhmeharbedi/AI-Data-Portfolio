import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create custom CSS variables for our theme colors
document.documentElement.style.setProperty('--primary', '#6C63FF');
document.documentElement.style.setProperty('--primary-light', '#8A84FF');
document.documentElement.style.setProperty('--primary-dark', '#4B44DD');  // Darker for better contrast
document.documentElement.style.setProperty('--primary-rgb', '108, 99, 255'); // RGB version for opacity
document.documentElement.style.setProperty('--secondary', '#39D0D8');
document.documentElement.style.setProperty('--secondary-dark', '#36B5C5');

// Gradient colors
document.documentElement.style.setProperty('--gradient-purple', '#8E24AA');  // Slightly darker purple
document.documentElement.style.setProperty('--gradient-purple-rgb', '142, 36, 170');
document.documentElement.style.setProperty('--gradient-blue', '#3B82F6');
document.documentElement.style.setProperty('--gradient-blue-rgb', '59, 130, 246');

// Set other theme variables
document.documentElement.style.setProperty('--light-bg', '#F8F9FA');
document.documentElement.style.setProperty('--light-darker', '#EDF0F5');
document.documentElement.style.setProperty('--dark-bg', '#121212');
document.documentElement.style.setProperty('--dark-lighter', '#1E1E1E');

createRoot(document.getElementById("root")!).render(<App />);
