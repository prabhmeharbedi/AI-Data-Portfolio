/**
 * Improved production server startup script (ES Module Version)
 * This ensures the server starts with the correct environment variables
 * and from the correct directory structure, with more robust error handling
 */

// Force production mode
process.env.NODE_ENV = 'production';
// Force Render mode
process.env.RENDER = 'true';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('STARTUP: Beginning server startup process');
console.log('STARTUP: Current directory:', process.cwd());
console.log('STARTUP: Looking for server entry point...');

// ANSI color codes for better logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(msg) {
  console.log(`${colors.cyan}STARTUP:${colors.reset} ${msg}`);
}

function error(msg) {
  console.error(`${colors.red}STARTUP ERROR:${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.green}STARTUP SUCCESS:${colors.reset} ${msg}`);
}

// Find the server file
let serverFile = '';
const possibleServerPaths = [
  // Preferred path (from our build script)
  path.join(process.cwd(), 'dist', 'index.js'),
  
  // Alternative paths
  path.join(process.cwd(), 'dist', 'server', 'index.js'),
  path.join(process.cwd(), 'server', 'index.js'),
];

// Create emergency fallback server if needed
function createEmergencyServer() {
  log('Creating emergency fallback server...');
  
  const fallbackPath = path.join(process.cwd(), 'dist', 'index.js');
  const clientDir = path.join(process.cwd(), 'dist', 'client');
  
  // Ensure directories exist
  if (!fs.existsSync(path.dirname(fallbackPath))) {
    fs.mkdirSync(path.dirname(fallbackPath), { recursive: true });
  }
  
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }
  
  // Create a simple index.html if it doesn't exist
  const indexHtmlPath = path.join(clientDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Website</title>
  <style>
    body { 
      font-family: system-ui, sans-serif; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      margin: 0; 
      background: #111; 
      color: #fff; 
      text-align: center; 
      padding: 20px;
    }
    h1 { 
      background: linear-gradient(90deg, #6C63FF, #FF6584); 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent;
    }
  </style>
</head>
<body>
  <h1>Generative AI & ML Portfolio</h1>
  <p>The portfolio is coming soon. Please check back later.</p>
</body>
</html>`);
  }
  
  // Create a simple server file
  fs.writeFileSync(fallbackPath, `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from client directory
const clientDir = path.join(__dirname, '../client');
app.use(express.static(clientDir));

// Fallback route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Emergency fallback server running on port \${PORT}\`);
});
`);
  
  return fallbackPath;
}

// List all files in the dist directory for debugging
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  log('Files in dist directory:');
  try {
    const distFiles = fs.readdirSync(distPath);
    distFiles.forEach(file => {
      log(`- ${file}`);
      // Check subdirectories
      const filePath = path.join(distPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        try {
          const subFiles = fs.readdirSync(filePath);
          subFiles.forEach(subFile => {
            log(`  - ${file}/${subFile}`);
          });
        } catch (err) {
          log(`  (error reading subdirectory: ${err.message})`);
        }
      }
    });
  } catch (err) {
    log(`Error reading dist directory: ${err.message}`);
  }
} else {
  log('dist directory not found, will create emergency server');
}

// Find the first path that exists
for (const filePath of possibleServerPaths) {
  try {
    if (fs.existsSync(filePath)) {
      serverFile = filePath;
      log(`Found server file at ${serverFile}`);
      break;
    }
  } catch (err) {
    log(`Error checking ${filePath}: ${err.message}`);
  }
}

// Create emergency server if none found
if (!serverFile) {
  log('No server file found, creating emergency fallback server');
  serverFile = createEmergencyServer();
  
  if (!serverFile) {
    error('Could not create emergency server!');
    process.exit(1);
  }
}

// Log environment info
log('Starting server with:');
log(`NODE_ENV=${process.env.NODE_ENV}`);
log(`RENDER=${process.env.RENDER}`);
log(`PORT=${process.env.PORT || '(default)'}`);

// Install missing dependencies if any
try {
  const requiredPackages = ['express', 'path', 'url'];
  log('Checking for required packages...');
  
  for (const pkg of requiredPackages) {
    try {
      // Try to import the package dynamically
      await import(pkg);
    } catch (err) {
      log(`Package ${pkg} not found, installing...`);
      execSync(`npm install --no-save ${pkg}`, { stdio: 'inherit' });
    }
  }
} catch (err) {
  log(`Error checking packages: ${err.message}`);
}

// Start the server
log(`Executing: node ${serverFile}`);
try {
  // Use dynamic import for either ESM or CommonJS modules
  import(serverFile)
    .catch(err => {
      error(`Failed to import server file: ${err.message}`);
      error(err.stack);
      
      // If dynamic import fails, try using the URL approach
      import(`file://${serverFile}`)
        .catch(finalErr => {
          error(`Both import methods failed: ${finalErr.message}`);
          createLastResortServer();
        });
    });
    
  success('Server import initiated');
} catch (err) {
  error(`Failed to start server: ${err.message}`);
  error(err.stack);
  createLastResortServer();
}

// Create and start a last resort emergency server
async function createLastResortServer() {
  error('Attempting last-resort inline server...');
  try {
    // Try to import express
    const expressModule = await import('express');
    const express = expressModule.default;
    
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    // Health check for Render
    app.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    
    // Serve static files if they exist
    const clientPath = path.join(process.cwd(), 'dist', 'client');
    if (fs.existsSync(clientPath)) {
      app.use(express.static(clientPath));
    }
    
    // Fallback response
    app.get('*', (req, res) => {
      if (fs.existsSync(path.join(clientPath, 'index.html'))) {
        res.sendFile(path.join(clientPath, 'index.html'));
      } else {
        res.send('Portfolio website coming soon. Please check back later.');
      }
    });
    
    app.listen(PORT, '0.0.0.0', () => {
      success(`Last-resort server running on port ${PORT}`);
    });
  } catch (finalErr) {
    error(`Last-resort server also failed: ${finalErr.message}`);
    process.exit(1);
  }
}