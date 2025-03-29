#!/usr/bin/env node

/**
 * Static site generator for Render deployment
 * This creates a complete static website without needing Vite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Static site generator for Render deployment');

// Make sure the output directory exists
const clientDir = path.join(process.cwd(), 'dist', 'client');
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

// Create a simple but more professional HTML file
const createHtml = () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar Pal Singh Bedi - AI & ML Portfolio</title>
  <meta name="description" content="Portfolio showcasing Generative AI and Machine Learning projects by Prabhmehar Pal Singh Bedi">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6C63FF;
      --primary-dark: #5a52d5;
      --secondary: #FF6584;
      --dark: #111827;
      --light: #F9FAFB;
      --gray: #4B5563;
      --gray-light: #9CA3AF;
      --radius: 12px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: var(--dark);
      color: var(--light);
      line-height: 1.6;
      overflow-x: hidden;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    header {
      padding: 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    nav ul {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    
    nav a {
      color: var(--light);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    nav a:hover {
      color: var(--primary);
    }
    
    .hero {
      padding: 6rem 0;
      text-align: center;
      position: relative;
    }
    
    .hero h1 {
      font-family: 'Poppins', sans-serif;
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto 2.5rem;
      color: var(--gray-light);
    }
    
    .button {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius);
      font-weight: 600;
      text-decoration: none;
      transition: background 0.3s;
    }
    
    .button:hover {
      background: var(--primary-dark);
    }
    
    .section {
      padding: 6rem 0;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    
    .section-header h2 {
      font-family: 'Poppins', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    
    .section-header p {
      color: var(--gray-light);
      max-width: 700px;
      margin: 0 auto;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius);
      padding: 2rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .card h3 {
      margin-bottom: 1rem;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }
    
    .badge {
      display: inline-block;
      background: rgba(108, 99, 255, 0.2);
      color: var(--primary);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.85rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    footer {
      padding: 4rem 0;
      text-align: center;
      color: var(--gray-light);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .gradient-text {
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .contact-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: calc(var(--radius) - 4px);
      color: var(--light);
      font-family: inherit;
    }
    
    textarea {
      min-height: 150px;
      resize: vertical;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }
      
      nav ul {
        gap: 1rem;
      }
      
      .section {
        padding: 4rem 0;
      }
    }
    
    /* Add the animation */
    .typewriter {
      overflow: hidden;
      border-right: .15em solid var(--primary);
      white-space: nowrap;
      margin: 0 auto;
      letter-spacing: .15em;
      animation: 
        typing 3.5s steps(30, end),
        blink-caret .75s step-end infinite;
    }

    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }

    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: var(--primary) }
    }
    
    /* Background animation */
    .bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.15;
    }
    
    .blob:nth-child(1) {
      background: var(--primary);
      width: 500px;
      height: 500px;
      top: -250px;
      left: -100px;
      animation: float 15s ease-in-out infinite alternate;
    }
    
    .blob:nth-child(2) {
      background: var(--secondary);
      width: 400px;
      height: 400px;
      top: 50%;
      right: -150px;
      animation: float 20s ease-in-out infinite alternate-reverse;
    }
    
    @keyframes float {
      0% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(50px, 50px) scale(1.1);
      }
      100% {
        transform: translate(-50px, 20px) scale(0.9);
      }
    }
  </style>
</head>
<body>
  <div class="bg-animation">
    <div class="blob"></div>
    <div class="blob"></div>
  </div>

  <header>
    <div class="logo">Prabhmehar</div>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#resume">Resume</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <h1>Generative AI & <span class="gradient-text">Machine Learning</span> Portfolio</h1>
      <p>I'm Prabhmehar Pal Singh Bedi, a Machine Learning Engineer and AI researcher specializing in natural language processing and deep learning solutions.</p>
      <a href="#contact" class="button">Get in touch</a>
    </div>
  </section>

  <section id="about" class="section">
    <div class="container">
      <div class="section-header">
        <h2>About <span class="gradient-text">Me</span></h2>
        <p>My journey in AI and Machine Learning</p>
      </div>
      <div class="grid">
        <div class="card">
          <h3>Education</h3>
          <p>Bachelor of Engineering in Electronics and Computer with Minor in Conversational AI by NVIDIA at Thapar Institute of Engineering and Technology, Patiala, India (2021-2025) with CGPA: 8.31</p>
        </div>
        <div class="card">
          <h3>Experience</h3>
          <p>Generative AI Intern at TerraByte Technologies, Bengaluru, India (Jan 2025-Present), where I implement and customize LLMs through prompt engineering and develop advanced RAG pipelines using LangChain.</p>
        </div>
        <div class="card">
          <h3>Skills</h3>
          <span class="badge">Python</span>
          <span class="badge">SQL</span>
          <span class="badge">C/C++</span>
          <span class="badge">NLP</span>
          <span class="badge">Deep Learning</span>
          <span class="badge">RAG</span>
          <span class="badge">PyTorch</span>
          <span class="badge">TensorFlow</span>
          <span class="badge">LangChain</span>
        </div>
      </div>
    </div>
  </section>

  <section id="projects" class="section">
    <div class="container">
      <div class="section-header">
        <h2>Featured <span class="gradient-text">Projects</span></h2>
        <p>A selection of my recent work in AI and Machine Learning</p>
      </div>
      <div class="grid">
        <div class="card">
          <h3>Fracture Detection</h3>
          <p>Developed a medical image analysis system using CNNs to detect bone fractures in X-ray images with 90% accuracy. Implemented web interface for seamless interaction between deep learning model and users.</p>
          <div class="badges">
            <span class="badge">CNN</span>
            <span class="badge">Medical AI</span>
            <span class="badge">Image Analysis</span>
          </div>
        </div>
        <div class="card">
          <h3>Real Time Motorcycle Helmet Rule Violation Detection</h3>
          <p>Developed real-time motorcyclist helmet rule violation detection system using YOLO v8 with 86.8% accuracy. Integrated model with Jetson Nano for real-time detection to enhance road safety measures.</p>
          <div class="badges">
            <span class="badge">YOLO v8</span>
            <span class="badge">Computer Vision</span>
            <span class="badge">Edge Computing</span>
          </div>
        </div>
        <div class="card">
          <h3>Article Sentiment Analysis</h3>
          <p>Engineered sentiment analysis system to extract emotional tones from articles with 86% accuracy. Implemented web scraping with Python and applied advanced NLP techniques for precise sentiment analysis.</p>
          <div class="badges">
            <span class="badge">NLP</span>
            <span class="badge">Sentiment Analysis</span>
            <span class="badge">Data Visualization</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="resume" class="section">
    <div class="container">
      <div class="section-header">
        <h2>My <span class="gradient-text">Resume</span></h2>
        <p>Professional experience and qualifications</p>
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <p>View my complete resume to learn more about my experience, education, and skills.</p>
        <a href="#" class="button" style="margin-top: 1rem;">Download Resume</a>
      </div>
    </div>
  </section>

  <section id="contact" class="section">
    <div class="container">
      <div class="section-header">
        <h2>Get in <span class="gradient-text">Touch</span></h2>
        <p>Interested in working together? Let's connect!</p>
      </div>
      <div class="contact-form">
        <form>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" class="button" style="width: 100%;">Send Message</button>
          <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: var(--gray-light);">
            Alternatively, you can reach me at: 
            <a href="mailto:prabhmehar2509@gmail.com" style="color: var(--primary); text-decoration: none;">prabhmehar2509@gmail.com</a>
          </p>
        </form>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2025 Prabhmehar Pal Singh Bedi. All rights reserved.</p>
      <p style="margin-top: 1rem;">
        <a href="https://linkedin.com/in/prabhmeharbedi" style="color: var(--gray-light); text-decoration: none; margin: 0 0.5rem;">LinkedIn</a> | 
        <a href="https://github.com/prabhmeharbedi" style="color: var(--gray-light); text-decoration: none; margin: 0 0.5rem;">GitHub</a>
      </p>
    </div>
  </footer>

  <script>
    // Simple form handling
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! This is a static version of the portfolio site. Please contact me directly at prabhmehar2509@gmail.com');
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(clientDir, 'index.html'), html);
  console.log('Created static HTML file with professional design');
};

// Create a simple API mocking file
const createApiMock = () => {
  const js = `
// Simple API mocking for static deployment
(function() {
  console.log('API Mocking initialized');
  
  // Mock data for API endpoints
  const mockData = {
    '/api/health': {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(Math.random() * 10000)
    },
    '/api/chat': {
      success: true,
      message: "I'm a static version of the AI assistant. The full version uses GPT-4o to answer questions about Prabhmehar's portfolio. Feel free to reach out via email for more information!"
    }
  };
  
  // Intercept fetch requests to API endpoints
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    const urlString = url.toString();
    
    // Check if this is an API call
    if (urlString.startsWith('/api/')) {
      console.log('Intercepted API call to:', urlString);
      const endpoint = urlString.split('?')[0]; // Remove query params
      
      if (mockData[endpoint]) {
        console.log('Returning mock data for:', endpoint);
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve(mockData[endpoint])
            });
          }, 500); // Simulate network delay
        });
      }
    }
    
    // Pass through to original fetch for non-mocked endpoints
    return originalFetch.apply(this, arguments);
  };
})();
`;

  fs.writeFileSync(path.join(clientDir, 'api-mock.js'), js);
  console.log('Created API mocking script');
};

// Create a static assets directory with CSS and JS
const createAssets = () => {
  const assetsDir = path.join(clientDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Create a simple styles.css file
  const css = `
/* Additional styles could be added here */
`;
  fs.writeFileSync(path.join(assetsDir, 'styles.css'), css);

  // Create a favicon 
  try {
    console.log('Attempting to create a simple favicon');
    const faviconData = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#111827"/>
  <text x="50" y="65" font-family="Arial" font-size="60" fill="#6C63FF" text-anchor="middle">P</text>
</svg>
`;
    fs.writeFileSync(path.join(clientDir, 'favicon.svg'), faviconData);
    
    // Try to convert the SVG to ICO using a simple approach
    try {
      // Create a minimal HTML file that will be our favicon
      const faviconHTML = `
<html>
<head>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body>
  <!-- This file exists only to define the favicon -->
</body>
</html>`;
      fs.writeFileSync(path.join(clientDir, 'favicon.html'), faviconHTML);
    } catch (err) {
      console.log('Could not create favicon file:', err.message);
    }
  } catch (err) {
    console.log('Could not create SVG favicon:', err.message);
  }
};

// Create a robots.txt file
const createRobotsTxt = () => {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://prabhmeharbedi.github.io/sitemap.xml
`;
  fs.writeFileSync(path.join(clientDir, 'robots.txt'), robotsTxt);
  console.log('Created robots.txt file');
};

// Create a simple sitemap
const createSitemap = () => {
  const date = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://prabhmeharbedi.github.io/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(clientDir, 'sitemap.xml'), sitemap);
  console.log('Created sitemap.xml file');
};

// Execute the static site generation
try {
  createHtml();
  createApiMock();
  createAssets();
  createRobotsTxt();
  createSitemap();
  
  console.log('Static site generation completed successfully');
} catch (error) {
  console.error('Error generating static site:', error.message);
  process.exit(1);
}
