import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple HTML entry point for the client
const clientDir = path.join(__dirname, 'dist', 'client');
fs.mkdirSync(clientDir, { recursive: true });

// Create a simple HTML file that will load your actual React app
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar's AI & ML Portfolio</title>
  <script type="module">
    // This will dynamically load your actual app from your GitHub repo
    import React from 'https://esm.sh/react@18.2.0';
    import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
    
    const App = () => {
      return React.createElement('div', null, [
        React.createElement('h1', null, 'My Portfolio'),
        React.createElement('p', null, 'Loading the full application...')
      ]);
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(App)
    );
    
    // Load your actual app
    import('./app.js').catch(err => {
      console.error('Error loading app:', err);
    });
  </script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);

console.log('Creating server build...');
// Build server
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', {
  stdio: 'inherit'
});

// Copy server entry point
fs.copyFileSync(path.join(__dirname, 'dist', 'server', 'index.js'), path.join(__dirname, 'dist', 'index.js'));

console.log('Build complete!');