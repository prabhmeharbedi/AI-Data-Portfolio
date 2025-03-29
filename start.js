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

// Check if we're on Render (they use a specific directory structure)
const isRender = process.env.RENDER === 'true';

// Find the server file
let serverFile = '';
const possibleServerPaths = [
  // Main paths
  path.join(__dirname, 'dist', 'server', 'index.js'),
  path.join(__dirname, 'dist', 'index.js'),
  
  // Fallback paths in case of different build structures
  path.join(__dirname, 'server', 'index.js'),
  path.join(__dirname, 'build', 'server', 'index.js')
];

// Find the first path that exists
for (const filePath of possibleServerPaths) {
  if (fs.existsSync(filePath)) {
    serverFile = filePath;
    console.log(`Found server file at ${serverFile}`);
    break;
  }
}

if (!serverFile) {
  console.error('Could not find server file to start!');
  console.error('Searched in:');
  possibleServerPaths.forEach(p => console.error(` - ${p}`));
  process.exit(1);
}

// Log environment info
console.log('Starting server with:');
console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`RENDER=${process.env.RENDER}`);
console.log(`PORT=${process.env.PORT || '(default)'}`);

// Start the server
console.log(`Executing: node ${serverFile}`);
require(serverFile); 