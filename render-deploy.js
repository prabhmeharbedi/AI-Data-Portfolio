#!/usr/bin/env node

/**
 * Improved build script for Render deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Render deployment build process...');

// Create required directories
const distDir = path.join(__dirname, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');

// Ensure directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

// Run the Vite build for the client
console.log('Building client with Vite...');
try {
  // Use Vite to build the client
  execSync('npx vite build --outDir dist/client', {
    stdio: 'inherit'
  });
  
  console.log('Client build successful!');
} catch (error) {
  console.error('Error building client with Vite:', error);
  process.exit(1);
}

// Build server code with esbuild
console.log('Building server files with esbuild...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', {
    stdio: 'inherit'
  });
  
  console.log('Server build successful!');
  
  // Copy server entry point to dist/index.js for Render
  fs.copyFileSync(path.join(serverDir, 'index.js'), path.join(distDir, 'index.js'));
  console.log('Server entry point copied to dist/index.js');
} catch (error) {
  console.error('Error building server:', error);
  process.exit(1);
}

// Copy any static files from public to client directory
if (fs.existsSync('public')) {
  console.log('Copying public directory content to client directory...');
  
  const copyDirectory = (source, destination) => {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    // Read all entries in the source directory
    const entries = fs.readdirSync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      if (entry.isDirectory()) {
        // If it's a directory, recursively copy it
        copyDirectory(sourcePath, destPath);
      } else {
        // If it's a file, copy it
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  };
  
  try {
    copyDirectory('public', clientDir);
    console.log('Public files copied successfully.');
  } catch (error) {
    console.error('Error copying public files:', error);
  }
}

console.log('Build process complete!');