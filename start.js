/**
 * Simple start script for Render
 * This script starts the server with the correct environment variables
 */

// Force production mode
process.env.NODE_ENV = 'production';
// Force Render mode
process.env.RENDER = 'true';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting server...');
console.log('Current directory:', process.cwd());

// Find the server file
let serverFile = '';
const possibleServerPaths = [
  path.join(process.cwd(), 'dist', 'index.js'),
  path.join(process.cwd(), 'dist', 'server', 'index.js'),
  path.join(process.cwd(), 'server', 'index.js'),
];

// Find the first path that exists
for (const filePath of possibleServerPaths) {
  try {
    if (fs.existsSync(filePath)) {
      serverFile = filePath;
      console.log(`Found server file at ${serverFile}`);
      break;
    }
  } catch (err) {
    console.log(`Error checking ${filePath}: ${err.message}`);
  }
}

// Create emergency server if none found
if (!serverFile) {
  console.log('No server file found, creating emergency server');
  
  const emergencyServerPath = path.join(process.cwd(), 'dist', 'index.js');
  const clientDir = path.join(process.cwd(), 'dist', 'client');
  
  // Ensure directories exist
  if (!fs.existsSync(path.dirname(emergencyServerPath))) {
    fs.mkdirSync(path.dirname(emergencyServerPath), { recursive: true });
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
  <title>Prabhmehar Pal Singh Bedi - Portfolio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #121212;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #6C63FF, #8E24AA);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      max-width: 600px;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    a {
      color: #6C63FF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>Prabhmehar Pal Singh Bedi</h1>
  <p>Generative AI Engineer & ML Enthusiast</p>
  <p>My portfolio website is being prepared. Please check back soon!</p>
  <p>Contact: <a href="mailto:prabhmehar2509@gmail.com">prabhmehar2509@gmail.com</a></p>
</body>
</html>`);
  }
  
  // Create an emergency server file
  fs.writeFileSync(emergencyServerPath, `
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

// Serve static files
const clientDir = path.join(__dirname, 'client');
console.log('Serving static files from:', clientDir);
app.use(express.static(clientDir));

// Fallback route
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Emergency server running on port \${PORT}\`);
});
`);
  
  serverFile = emergencyServerPath;
  console.log('Created emergency server file at', serverFile);
}

// Start the server
console.log(`Starting server from: ${serverFile}`);
try {
  // Use dynamic import for ESM modules
  import(serverFile)
    .catch(err => {
      console.error(`Failed to import server file: ${err.message}`);
      console.error(err.stack);
      process.exit(1);
    });
    
  console.log('Server import initiated');
} catch (err) {
  console.error(`Failed to start server: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}