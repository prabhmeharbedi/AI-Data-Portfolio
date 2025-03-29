/**
 * Cross-platform build script
 * This replaces build.sh with a Node.js solution that works on Windows, macOS, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log utilities
const log = {
  info: (msg) => console.log(`${colors.bright}${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.bright}${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.bright}${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.bright}${colors.red}[ERROR]${colors.reset} ${msg}`),
};

// Detect if we're running on Render
const isRender = process.env.RENDER === 'true';

// Execute a command with proper error handling
function exec(command, options = {}) {
  try {
    log.info(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    if (options.ignoreError) {
      log.warning(`Command failed, but continuing: ${command}`);
      log.warning(`Error: ${error.message}`);
      return false;
    }
    log.error(`Command failed: ${command}`);
    log.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Make directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    log.info(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy file or directory
function copy(src, dest) {
  try {
    if (fs.statSync(src).isDirectory()) {
      ensureDir(dest);
      fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        copy(srcFile, destFile);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
    return true;
  } catch (error) {
    log.error(`Failed to copy from ${src} to ${dest}`);
    log.error(`Error: ${error.message}`);
    return false;
  }
}

// Main build process
async function build() {
  log.info('Starting build process...');
  
  // Skip prebuild checks if on Render
  if (isRender) {
    log.warning('Running on Render: skipping prebuild checks');
  } else {
    // Run prebuild checks
    log.info('Running prebuild checks...');
    exec('npm run prebuild');
    log.success('Prebuild checks completed');
  }
  
  // Clean previous build
  log.info('Cleaning previous build...');
  try {
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
  } catch (error) {
    log.warning(`Failed to clean dist directory: ${error.message}`);
  }
  ensureDir('dist');
  
  // Build client
  log.info('Building client...');
  exec('npx vite build --outDir dist/client');
  
  // Build server
  log.info('Building server...');
  // Use direct path to esbuild on Render for better reliability
  const esbuildCommand = isRender 
    ? 'node_modules/.bin/esbuild' 
    : 'npx esbuild';
  
  exec(`${esbuildCommand} server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server`);
  
  // Copy server files to dist
  log.info('Copying server files to dist directory...');
  ensureDir('dist');
  fs.copyFileSync('dist/server/index.js', 'dist/index.js');
  
  // Copy public files to client directory if needed
  if (fs.existsSync('public') && fs.readdirSync('public').length > 0) {
    log.info('Copying public files to client directory...');
    exec('cp -r public/* dist/client', { ignoreError: true });
  }
  
  // Verify build
  log.info('Verifying build...');
  const requiredPaths = [
    'dist/client/index.html',
    'dist/server/index.js',
    'dist/index.js'
  ];
  
  let buildValid = true;
  for (const p of requiredPaths) {
    if (!fs.existsSync(p)) {
      log.error(`Missing required file: ${p}`);
      buildValid = false;
    }
  }
  
  if (buildValid) {
    log.success('Build completed successfully!');
    log.info('You can start the server with: npm start');
  } else {
    log.error('Build verification failed!');
    process.exit(1);
  }
}

// Run the build
build().catch(error => {
  log.error(`Build failed: ${error.message}`);
  process.exit(1);
}); 