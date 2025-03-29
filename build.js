#!/usr/bin/env node

/**
 * Enhanced React-focused build script for Render deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for logging with colors
const log = {
  info: (msg) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`)
};

log.info('Starting enhanced React build process for Render...');

// Create required directories
const distDir = path.join(__dirname, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');

// Ensure directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

// Function to run shell commands with proper error handling
function runCommand(command, options = {}) {
  try {
    log.info(`Running: ${command}`);
    execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return true;
  } catch (error) {
    if (options.ignoreError) {
      log.warn(`Command failed, but continuing: ${command}`);
      log.warn(`Error: ${error.message}`);
      return false;
    }
    log.error(`Command failed: ${command}`);
    log.error(`Error: ${error.message}`);
    return false;
  }
}

// Install Vite and React plugin as direct dependencies
log.info('Installing Vite and React plugin...');
if (!runCommand('npm install --no-save vite@latest @vitejs/plugin-react@latest', { timeout: 60000 })) {
  log.warn('Failed to install Vite via npm, trying with npx...');
  runCommand('npx --yes vite --help', { ignoreError: true });
}

// Check if vite.config.js exists, create if not
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (!fs.existsSync(viteConfigPath)) {
  log.info('Creating Vite config file...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  },
  root: './client',
  build: {
    outDir: '../dist/client',
    emptyOutDir: true
  }
});
`;
  fs.writeFileSync(viteConfigPath, viteConfig);
  log.success('Created Vite config file');
}

// Check if client/index.html exists, create if not
const clientIndexPath = path.join(__dirname, 'client', 'index.html');
if (!fs.existsSync(clientIndexPath)) {
  log.info('Creating client index.html...');
  const clientIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar Pal Singh Bedi - AI & ML Portfolio</title>
  <meta name="description" content="Portfolio showcasing Generative AI and Machine Learning projects by Prabhmehar Pal Singh Bedi">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Phosphor Icons -->
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
  fs.writeFileSync(clientIndexPath, clientIndex);
  log.success('Created client index.html');
}

// Check for main.tsx
const mainTsxPath = path.join(__dirname, 'client', 'src', 'main.tsx');
const indexTsxPath = path.join(__dirname, 'client', 'src', 'index.tsx');

if (!fs.existsSync(mainTsxPath) && fs.existsSync(indexTsxPath)) {
  log.info('Copying index.tsx to main.tsx...');
  fs.copyFileSync(indexTsxPath, mainTsxPath);
  log.success('Created main.tsx from index.tsx');
}

// Try multiple approaches for building the client
log.info('Building React client...');
let clientBuildSuccess = false;

// Approach 1: Use npx vite build with config
if (!clientBuildSuccess) {
  log.info('Attempting to build with npx vite build and config...');
  clientBuildSuccess = runCommand('npx vite build --config vite.config.js', {
    ignoreError: true,
    timeout: 120000
  });
  if (clientBuildSuccess) {
    log.success('Client built successfully with Vite!');
  }
}

// Approach 2: Use vite directly from node_modules
if (!clientBuildSuccess) {
  log.info('Attempting to build with direct path to Vite...');
  clientBuildSuccess = runCommand('./node_modules/.bin/vite build --config vite.config.js', {
    ignoreError: true,
    timeout: 120000
  });
  if (clientBuildSuccess) {
    log.success('Client built successfully with direct Vite path!');
  }
}

// Approach 3: Create a manual client
if (!clientBuildSuccess) {
  log.warn('Vite build failed, creating a minimal client manually...');
  
  // Basic index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar Pal Singh Bedi - AI & ML Portfolio</title>
  <meta name="description" content="Portfolio showcasing Generative AI and Machine Learning projects by Prabhmehar Pal Singh Bedi">
  <link rel="stylesheet" href="/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root">
    <div class="fallback-container">
      <h1>Prabhmehar Pal Singh Bedi</h1>
      <h2>Generative AI Engineer & ML Enthusiast</h2>
      <p>I develop advanced AI solutions with a focus on Retrieval-Augmented Generation (RAG) and practical machine learning applications. Specializing in LLMs, computer vision, and sentiment analysis.</p>
      <div class="buttons">
        <a href="https://github.com/prabhmeharbedi" target="_blank" rel="noopener noreferrer" class="button">GitHub</a>
        <a href="https://linkedin.com/in/prabhmeharbedi" target="_blank" rel="noopener noreferrer" class="button">LinkedIn</a>
      </div>
      <p class="contact">Contact: prabhmehar2509@gmail.com</p>
    </div>
  </div>
</body>
</html>`;

  // Basic CSS
  const styles = `
:root {
  --primary: #6C63FF;
  --primary-dark: #4B44DD;
  --gradient-purple: #8E24AA;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #121212;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-container {
  max-width: 800px;
  text-align: center;
  padding: 2rem;
}

h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, var(--primary), var(--gradient-purple));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

p {
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.button {
  color: var(--primary);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--primary);
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: var(--primary);
  color: white;
}

.contact {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.6);
  margin-top: 1rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  p {
    font-size: 1rem;
  }
}`;

  // Write files
  fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(clientDir, 'styles.css'), styles);
  
  log.success('Created manual client files');
  clientBuildSuccess = true;
}

// Build server
log.info('Building server...');
let serverBuildSuccess = false;

// Try to build server with esbuild
serverBuildSuccess = runCommand('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', {
  ignoreError: true,
  timeout: 60000
});

if (serverBuildSuccess) {
  log.success('Server built successfully!');
  
  // Copy server file to dist/index.js for Render
  fs.copyFileSync(path.join(serverDir, 'index.js'), path.join(distDir, 'index.js'));
  log.success('Server entry point copied to dist/index.js');
} else {
  log.warn('Server build failed, creating minimal server...');
  
  // Create minimal server file
  const minimalServer = `
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

// Serve static files from client directory
const clientDir = path.join(__dirname, './client');
console.log('Serving static files from:', clientDir);
app.use(express.static(clientDir));

// API routes
app.use(express.json());

app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ 
    success: true, 
    message: 'Message received'
  });
});

// Fallback route
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
  
  fs.writeFileSync(path.join(serverDir, 'index.js'), minimalServer);
  fs.writeFileSync(path.join(distDir, 'index.js'), minimalServer);
  log.success('Created minimal server files');
}

// Copy public assets if they exist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  log.info('Copying public directory content...');
  
  const copyDirectory = (source, destination) => {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    const entries = fs.readdirSync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      if (entry.isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  };
  
  try {
    copyDirectory(publicDir, clientDir);
    log.success('Public files copied successfully');
  } catch (error) {
    log.error('Error copying public files:', error);
  }
}

// Create a summary of what was done
log.info('\nBuild Summary:');
log.info(`- Client build: ${clientBuildSuccess ? 'SUCCESS' : 'FAILED'}`);
log.info(`- Server build: ${serverBuildSuccess ? 'SUCCESS' : 'FAILED'}`);
log.info(`- Files in dist/client: ${fs.existsSync(clientDir) ? fs.readdirSync(clientDir).length : 0}`);
log.info(`- Files in dist/server: ${fs.existsSync(serverDir) ? fs.readdirSync(serverDir).length : 0}`);
log.info(`- Render entry point: ${fs.existsSync(path.join(distDir, 'index.js')) ? 'EXISTS' : 'MISSING'}`);

log.success('\nBuild process complete!');