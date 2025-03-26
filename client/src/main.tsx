import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create custom CSS variables for our theme colors
document.documentElement.style.setProperty('--primary', '#6C63FF');
document.documentElement.style.setProperty('--primary-light', '#8A84FF');
document.documentElement.style.setProperty('--primary-dark', '#5046E5');
document.documentElement.style.setProperty('--secondary', '#39D0D8');
document.documentElement.style.setProperty('--secondary-dark', '#36B5C5');
document.documentElement.style.setProperty('--accent', '#FF2A93');
document.documentElement.style.setProperty('--dark', '#1E1E2A');
document.documentElement.style.setProperty('--dark-lighter', '#2D2D3A');
document.documentElement.style.setProperty('--light', '#F5F5F7');
document.documentElement.style.setProperty('--light-darker', '#E5E5E7');

createRoot(document.getElementById("root")!).render(<App />);
