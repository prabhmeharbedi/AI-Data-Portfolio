/**
 * Minimal server for Render deployment
 * This is a simplified server that can be used as a last resort
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Express app
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

// Determine client directory path
const clientDir = path.join(__dirname, 'dist', 'client');
const altClientDir = path.join(__dirname, 'client');

// Choose the first directory that exists
let staticDir = null;
if (fs.existsSync(clientDir)) {
  staticDir = clientDir;
  console.log(`Serving static files from: ${clientDir}`);
} else if (fs.existsSync(altClientDir)) {
  staticDir = altClientDir;
  console.log(`Serving static files from alternative path: ${altClientDir}`);
} else {
  console.log('No client directory found, creating fallback content');
  // Create a minimal client directory with index.html
  fs.mkdirSync(clientDir, { recursive: true });
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI & ML Portfolio</title>
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
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #6C63FF, #FF6584); 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.2rem;
      max-width: 600px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>Generative AI & ML Portfolio</h1>
  <p>Welcome to my portfolio showcasing Machine Learning and AI projects. The full site is coming soon.</p>
  <p>In the meantime, you can contact me at: <a href="mailto:prabhmehar2509@gmail.com" style="color:#6C63FF">prabhmehar2509@gmail.com</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);
  staticDir = clientDir;
}

// Serve static files
app.use(express.static(staticDir));

// Fallback route to index.html (for SPA routing)
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html for client-side routing
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Keep the process running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise rejection:', reason);
  // Keep the process running
});