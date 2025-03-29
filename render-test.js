/**
 * Script to test if our application will work on Render
 * This simulates the Render environment locally
 */

// Set environment variables to mimic Render
process.env.NODE_ENV = 'production';
process.env.RENDER = 'true';
process.env.PORT = '10000';

// Output current directory and file structure
const fs = require('fs');
const path = require('path');

console.log('=== Simulating Render Environment ===');
console.log('Current directory:', process.cwd());

// Check if dist directory exists
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('Dist directory exists');
  
  // List contents of dist directory
  console.log('Contents of dist directory:');
  fs.readdirSync(distPath).forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
  });
  
  // Check for dist/client
  const clientPath = path.join(distPath, 'client');
  if (fs.existsSync(clientPath)) {
    console.log('Client directory exists');
    
    // Check for index.html
    const indexPath = path.join(clientPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('index.html exists in client directory');
    } else {
      console.log('WARNING: index.html not found in client directory');
    }
  } else {
    console.log('WARNING: Client directory not found');
  }
  
  // Check for dist/server
  const serverPath = path.join(distPath, 'server');
  if (fs.existsSync(serverPath)) {
    console.log('Server directory exists');
    
    // Check for index.js
    const indexPath = path.join(serverPath, 'index.js');
    if (fs.existsSync(indexPath)) {
      console.log('index.js exists in server directory');
    } else {
      console.log('WARNING: index.js not found in server directory');
    }
  } else {
    console.log('WARNING: Server directory not found');
  }
  
  // Check for dist/index.js (Render's expected location)
  const renderIndexPath = path.join(distPath, 'index.js');
  if (fs.existsSync(renderIndexPath)) {
    console.log('index.js exists in dist directory (Render expected location)');
  } else {
    console.log('WARNING: index.js not found in dist directory (Render expected location)');
  }
} else {
  console.log('WARNING: Dist directory not found. Run npm run build first.');
}

console.log('\n=== Starting server using Render settings ===');
console.log('Loading start.js...');

// Try to start the server
try {
  require('./start.js');
} catch (error) {
  console.error('Error starting server:', error);
} 