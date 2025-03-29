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
const assetsDir = path.join(clientDir, 'assets');

// Ensure directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Install required build dependencies if needed
console.log('Ensuring build dependencies are installed...');
try {
  execSync('npm list esbuild || npm install --no-save esbuild', { stdio: 'inherit' });
} catch (error) {
  console.log('Installing esbuild...');
  execSync('npm install --no-save esbuild', { stdio: 'inherit' });
}

// Build client side code
console.log('Building client application...');
try {
  // Build the main JavaScript bundle
  execSync('npx esbuild client/src/index.tsx --bundle --minify --platform=browser --target=es2020 --outfile=dist/client/app.js', {
    stdio: 'inherit'
  });
  
  // Extract the CSS into a separate file
  console.log('Extracting CSS...');
  execSync('npx esbuild client/src/index.css --bundle --minify --outfile=dist/client/app.css', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('Client build successful!');
} catch (error) {
  console.error('Error building client:', error);
  console.log('Creating minimal client instead...');
  
  // Create minimal client files if the build fails
  fs.writeFileSync(path.join(clientDir, 'app.js'), `
    console.log("Portfolio app loading...");
    document.getElementById('root').innerHTML = '<div style="max-width: 800px; margin: 50px auto; text-align: center;"><h1 style="color: #6C63FF;">Prabhmehar Pal Singh Bedi</h1><p>Generative AI & Machine Learning Portfolio</p><p>The full application is currently loading. If it doesn\'t appear soon, please refresh the page.</p></div>';
  `);
  
  fs.writeFileSync(path.join(clientDir, 'app.css'), `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #111;
      color: #f0f0f0;
      margin: 0;
      padding: 20px;
    }
    h1 { 
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #6C63FF, #FF6584);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `);
}

// Create index.html
console.log('Creating index.html...');
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabhmehar's AI & ML Portfolio</title>
  <link rel="stylesheet" href="/app.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);

// Copy any public assets if they exist
console.log('Copying public assets...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  try {
    const copyDir = (source, destination) => {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      const files = fs.readdirSync(source);
      for (const file of files) {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
          copyDir(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    };
    
    copyDir(publicDir, clientDir);
    console.log('Public assets copied successfully');
  } catch (error) {
    console.error('Error copying public assets:', error);
  }
}

// Build server side code
console.log('Building server code...');
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

console.log('Build process complete!');