#!/usr/bin/env node

/**
 * React-focused build script for Render deployment
 * Designed to ensure your React application builds properly
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting React-focused build process for Render...');

// Create required directories
const distDir = path.join(__dirname, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');

// Ensure directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

// Install specific versions of required dependencies
console.log('Installing required build dependencies...');
try {
  execSync('npm install --no-save vite@latest @vitejs/plugin-react@latest', { 
    stdio: 'inherit',
    timeout: 60000 // 1 minute timeout
  });
  console.log('Build dependencies installed successfully');
} catch (error) {
  console.error('Failed to install build dependencies:', error.message);
  process.exit(1);
}

// Build client with direct Vite CLI command
console.log('Building React client application...');
try {
  execSync('npx vite build --config vite.config.js', {
    stdio: 'inherit',
    timeout: 120000 // 2 minute timeout
  });
  console.log('React client build successful!');
} catch (error) {
  console.error('Error building React client:', error.message);
  process.exit(1);
}

// Build server with esbuild
console.log('Building server files...');
try {
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
  process.exit(1);
}

// Copy any static files from public to client directory if they exist
if (fs.existsSync('public')) {
  console.log('Copying public directory content to client directory...');
  
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
    copyDirectory('public', clientDir);
    console.log('Public files copied successfully');
  } catch (error) {
    console.error('Error copying public files:', error);
  }
}

console.log('Build process complete!');