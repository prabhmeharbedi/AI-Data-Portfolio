/**
 * Production server startup script
 * This ensures the server starts with the correct environment variables
 * and from the correct directory structure
 */

// Force production mode
process.env.NODE_ENV = 'production';
// Force Render mode
process.env.RENDER = 'true';

const fs = require('fs');
const path = require('path');

console.log('STARTUP: Beginning server startup process');
console.log('STARTUP: Current directory:', process.cwd());
console.log('STARTUP: Looking for server entry point...');

// Find the server file
let serverFile = '';
const possibleServerPaths = [
  // Preferred path (from our build-render script)
  path.join(process.cwd(), 'dist', 'index.js'),
  
  // Alternative paths
  path.join(process.cwd(), 'dist', 'server', 'index.js'),
  path.join(process.cwd(), 'server', 'index.js'),
];

// List all files in the dist directory for debugging
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('STARTUP: Files in dist directory:');
  try {
    const distFiles = fs.readdirSync(distPath);
    distFiles.forEach(file => {
      console.log(`STARTUP: - ${file}`);
      // Check subdirectories
      const filePath = path.join(distPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        try {
          const subFiles = fs.readdirSync(filePath);
          subFiles.forEach(subFile => {
            console.log(`STARTUP:   - ${file}/${subFile}`);
          });
        } catch (err) {
          console.log(`STARTUP:   (error reading subdirectory: ${err.message})`);
        }
      }
    });
  } catch (err) {
    console.log(`STARTUP: Error reading dist directory: ${err.message}`);
  }
} else {
  console.log('STARTUP: dist directory not found');
}

// Find the first path that exists
for (const filePath of possibleServerPaths) {
  try {
    if (fs.existsSync(filePath)) {
      serverFile = filePath;
      console.log(`STARTUP: Found server file at ${serverFile}`);
      break;
    }
  } catch (err) {
    console.log(`STARTUP: Error checking ${filePath}: ${err.message}`);
  }
}

if (!serverFile) {
  console.error('STARTUP ERROR: Could not find server file to start!');
  console.error('STARTUP ERROR: Searched in:');
  possibleServerPaths.forEach(p => console.error(`STARTUP ERROR: - ${p}`));
  process.exit(1);
}

// Log environment info
console.log('STARTUP: Starting server with:');
console.log(`STARTUP: NODE_ENV=${process.env.NODE_ENV}`);
console.log(`STARTUP: RENDER=${process.env.RENDER}`);
console.log(`STARTUP: PORT=${process.env.PORT || '(default)'}`);

// Start the server
console.log(`STARTUP: Executing: node ${serverFile}`);
try {
  require(serverFile);
  console.log('STARTUP: Server started successfully');
} catch (err) {
  console.error(`STARTUP ERROR: Failed to start server: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
} 