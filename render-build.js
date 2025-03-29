#!/usr/bin/env node

/**
 * Simplified build script for Render deployment (ES Module version)
 * This script avoids using any development tools that might not be available in the production environment
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
      log(`Command failed, but continuing: ${command}`);
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
    log(`Warning: Failed to clean dist directory: ${err.message}`);
  }
  
  // Create required directories
  ensureDir('dist');
  ensureDir('dist/client');
  ensureDir('dist/server');
  
  // Step 1: Build client files
  log('Building client files with Vite...');
  if (!exec('npx vite build --outDir dist/client')) {
    error('Client build failed');
    process.exit(1);
  }
  
  // Step 2: Build server files
  log('Building server files with esbuild...');
  if (!exec('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server')) {
    // Try alternate path if direct esbuild fails
    log('Trying alternate esbuild path...');
    if (!exec('node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server')) {
      error('Server build failed');
      process.exit(1);
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