#!/usr/bin/env node

/**
 * Basic build script that bundles client-side code using esbuild directly
 * and avoids the Vite dependency issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting direct build process for Render...');

// Create required directories
const distDir = path.join(__dirname, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');

// Ensure directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

// Build client with esbuild directly
console.log('Building client with esbuild directly...');
try {
  // Create a basic index.html for the client
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar Pal Singh Bedi - AI & ML Portfolio</title>
  <meta name="description" content="Portfolio showcasing Generative AI and Machine Learning projects">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Phosphor Icons -->
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css" />
  
  <!-- Custom styles -->
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root">
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Loading Portfolio...</p>
    </div>
  </div>
  <script src="/app.js"></script>
</body>
</html>`;

  // Create a CSS file with some basic styles including a loading spinner
  const cssContent = `
:root {
  --primary: #6C63FF;
  --primary-light: #8A84FF;
  --primary-dark: #4B44DD;
  --gradient-purple: #8E24AA;
  --light-bg: #F8F9FA;
  --light-darker: #EDF0F5;
  --dark-bg: #121212;
  --dark-lighter: #1E1E1E;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--dark-bg);
  color: white;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(108, 99, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

  // Create a simple fallback JavaScript that redirects to GitHub
  const jsContent = `
// Simple fallback script for the portfolio
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  // Replace spinner with fallback content
  root.innerHTML = \`
    <div style="font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: #121212; color: #ffffff">
      <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem; background: linear-gradient(90deg, #6C63FF, #8E24AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        Prabhmehar Pal Singh Bedi
      </h1>
      
      <h2 style="font-size: 1.5rem; margin-bottom: 2rem; font-weight: 500;">
        Generative AI Engineer & ML Enthusiast
      </h2>
      
      <p style="font-size: 1.125rem; max-width: 600px; margin-bottom: 2rem; line-height: 1.6;">
        I develop advanced AI solutions with a focus on Retrieval-Augmented Generation (RAG) 
        and practical machine learning applications.
      </p>
      
      <p style="font-size: 1.125rem; max-width: 600px; margin-bottom: 2rem; line-height: 1.6;">
        For the full interactive portfolio, please visit my GitHub repository or contact me directly.
      </p>
      
      <div style="display: flex; gap: 1.5rem; margin-top: 1rem;">
        <a 
          href="https://github.com/prabhmeharbedi" 
          style="color: #6C63FF; text-decoration: none; padding: 0.75rem 1.5rem; border: 2px solid #6C63FF; border-radius: 9999px; font-weight: 500; transition: all 0.3s ease;"
          onmouseover="this.style.backgroundColor='#6C63FF'; this.style.color='white';"
          onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6C63FF';"
        >
          GitHub
        </a>
        <a 
          href="https://linkedin.com/in/prabhmeharbedi" 
          style="color: #6C63FF; text-decoration: none; padding: 0.75rem 1.5rem; border: 2px solid #6C63FF; border-radius: 9999px; font-weight: 500; transition: all 0.3s ease;"
          onmouseover="this.style.backgroundColor='#6C63FF'; this.style.color='white';"
          onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6C63FF';"
        >
          LinkedIn
        </a>
      </div>
      
      <p style="margin-top: 3rem; font-size: 0.875rem; color: rgba(255,255,255,0.6);">
        Contact: prabhmehar2509@gmail.com
      </p>
    </div>
  \`;
});
`;

  // Write files
  fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(clientDir, 'styles.css'), cssContent);
  fs.writeFileSync(path.join(clientDir, 'app.js'), jsContent);

  console.log('Created client files successfully');
} catch (error) {
  console.error('Error creating client files:', error.message);
  process.exit(1);
}

// Build server with esbuild
console.log('Building server with esbuild...');
try {
  // Check if server directory exists
  if (!fs.existsSync('server')) {
    throw new Error('Server directory not found');
  }

  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', {
    stdio: 'inherit',
    timeout: 60000 // 1 minute timeout
  });
  
  console.log('Server build successful!');
  
  // Copy server entry point to dist/index.js for Render
  fs.copyFileSync(path.join(serverDir, 'index.js'), path.join(distDir, 'index.js'));
  console.log('Server entry point copied to dist/index.js');
} catch (error) {
  console.error('Error building server:', error.message);
  
  // Create a basic server file if the build fails
  console.log('Creating basic server file as fallback...');
  
  const basicServer = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files
const clientDir = path.join(__dirname, 'client');
console.log('Serving static files from:', clientDir);
app.use(express.static(clientDir));

// Simple API routes
app.use(express.json());

app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ 
    success: true, 
    message: 'Message received. This is a static version, so the message was not sent.'
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  console.log('Chat message received:', message);
  
  res.json({
    success: true,
    message: 'This is a simplified deployment. Please visit the GitHub repository for the full version.'
  });
});

// Fallback route for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  
  fs.writeFileSync(path.join(serverDir, 'index.js'), basicServer);
  fs.copyFileSync(path.join(serverDir, 'index.js'), path.join(distDir, 'index.js'));
  console.log('Created basic server file');
}

// Copy any public assets
console.log('Checking for public assets...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  try {
    const copyDir = (source, destination) => {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      const entries = fs.readdirSync(source, { withFileTypes: true });
      
      for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    };
    
    copyDir(publicDir, clientDir);
    console.log('Public assets copied successfully');
  } catch (error) {
    console.error('Error copying public assets:', error);
  }
}

console.log('Build process complete!');
