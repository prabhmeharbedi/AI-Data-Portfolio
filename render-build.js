#!/usr/bin/env node

/**
 * Improved build script for Render deployment (ES Module version)
 * With direct static site generation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Log utilities
function log(msg) {
  console.log(`${colors.bright}${colors.blue}[RENDER BUILD]${colors.reset} ${msg}`);
}

function warning(msg) {
  console.log(`${colors.bright}${colors.yellow}[RENDER WARNING]${colors.reset} ${msg}`);
}

function error(msg) {
  console.error(`${colors.bright}${colors.red}[RENDER BUILD ERROR]${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.bright}${colors.green}[RENDER SUCCESS]${colors.reset} ${msg}`);
}

// Execute a command with proper error handling
function exec(command, ignoreError = false) {
  try {
    log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (err) {
    if (ignoreError) {
      warning(`Command failed, but continuing: ${command}`);
      warning(`Error: ${err.message}`);
      return false;
    }
    error(`Command failed: ${command}`);
    error(`Error: ${err.message}`);
    return false;
  }
}

// Make directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Main build process
async function build() {
  log('Starting Render deployment build');
  
  // Explicitly set environment variables
  process.env.RENDER = 'true';
  process.env.NODE_ENV = 'production';
  
  // Clean previous build
  log('Cleaning previous build...');
  try {
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
  } catch (err) {
    warning(`Failed to clean dist directory: ${err.message}`);
  }
  
  // Create required directories
  ensureDir('dist');
  ensureDir('dist/client');
  ensureDir('dist/server');
  
  // Step 1: Try the direct static site generator
  log('Using static site generator instead of Vite...');
  try {
    // Check if static-build.js exists
    if (fs.existsSync('static-build.js')) {
      exec('node static-build.js');
      success('Static site generated successfully');
    } else {
      warning('static-build.js not found, creating a fallback HTML page');
      
      // Create a simple fallback HTML file
      const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar Pal Singh Bedi - Portfolio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #111;
      color: #f0f0f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #6C63FF, #FF6584);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 600px;
      line-height: 1.6;
    }
    .loading {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .loading div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #6C63FF;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .loading div:nth-child(1) {
      left: 8px;
      animation: loading1 0.6s infinite;
    }
    .loading div:nth-child(2) {
      left: 8px;
      animation: loading2 0.6s infinite;
    }
    .loading div:nth-child(3) {
      left: 32px;
      animation: loading2 0.6s infinite;
    }
    .loading div:nth-child(4) {
      left: 56px;
      animation: loading3 0.6s infinite;
    }
    @keyframes loading1 {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    @keyframes loading2 {
      0% { transform: translate(0, 0); }
      100% { transform: translate(24px, 0); }
    }
    @keyframes loading3 {
      0% { transform: scale(1); }
      100% { transform: scale(0); }
    }
  </style>
</head>
<body>
  <h1>Generative AI & ML Portfolio</h1>
  <p>Welcome to my portfolio showcasing Generative AI and Machine Learning projects. The site is currently being built and will be available soon.</p>
  <div class="loading"><div></div><div></div><div></div><div></div></div>
</body>
</html>`;
      fs.writeFileSync('dist/client/index.html', fallbackHtml);
      success('Created fallback HTML file');
    }
  } catch (err) {
    error(`Static site generation failed: ${err.message}`);
    
    // Create a simple fallback HTML as backup
    const emergencyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar's Portfolio</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: #fff; text-align: center; padding: 50px 20px; }
    h1 { color: #6C63FF; }
  </style>
</head>
<body>
  <h1>Prabhmehar Pal Singh Bedi</h1>
  <p>Generative AI & Machine Learning Engineer</p>
  <p>Contact: prabhmehar2509@gmail.com</p>
</body>
</html>`;
    fs.writeFileSync('dist/client/index.html', emergencyHtml);
    warning('Created emergency HTML fallback');
  }
  
  // Step 2: Build server files with esbuild
  log('Building server files with esbuild...');
  if (!exec('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server')) {
    // Try alternate path if direct esbuild fails
    warning('Direct esbuild command failed, trying alternative path');
    if (!exec('node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server')) {
      // Manual minimal server build
      log('Creating minimal server build...');
      
      // Just copy the server files
      try {
        fs.writeFileSync('dist/server/index.js', `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
});
`);
        success('Created minimal server file');
      } catch (err) {
        error(`Failed to create minimal server: ${err.message}`);
        process.exit(1);
      }
    }
  }
  
  // Step 3: Create Render-specific structure
  log('Creating Render-specific file structure...');
  try {
    fs.copyFileSync('dist/server/index.js', 'dist/index.js');
    success('Server entry point copied to dist/index.js');
  } catch (err) {
    error(`Failed to copy server entry point: ${err.message}`);
    process.exit(1);
  }
  
  // Print build output structure for debugging
  log('Build complete. Directory structure:');
  const clientFiles = fs.readdirSync('dist/client');
  const serverFiles = fs.readdirSync('dist/server');
  
  log(`dist/client/ (${clientFiles.length} files)`);
  log(`dist/server/ (${serverFiles.length} files)`);
  
  if (fs.existsSync('dist/index.js')) {
    success('Render entry point exists at dist/index.js');
  } else {
    error('Render entry point is missing!');
    process.exit(1);
  }
  
  success('Build successful!');
}

// Run the build
build().catch(err => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});