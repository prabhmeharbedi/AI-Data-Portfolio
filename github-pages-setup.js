// build-gh-pages.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building for GitHub Pages...');

// Ensure the build directory exists
const buildDir = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a special Vite config for GitHub Pages
const ghPagesViteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub Pages uses a subfolder based on repo name
// Change this to match your repository name or use "." for a user site
const BASE_PATH = "/AI-Data-Portfolio/";

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH, // This is crucial for GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "build"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
  // Customize for GitHub Pages
  define: {
    // Make API URLs relative or point to a deployed backend
    'process.env.API_BASE_URL': '""',
    'process.env.IS_GITHUB_PAGES': 'true',
  },
});
`;

// Write the GitHub Pages specific Vite config
fs.writeFileSync('vite.github-pages.js', ghPagesViteConfig);

// Create a modified frontend for GitHub Pages
function createGitHubPagesEntrypoint() {
  console.log('Creating GitHub Pages entrypoint...');
  
  // Create a special GitHub Pages index file in the client directory
  const clientDir = path.resolve(__dirname, 'client');
  const mainJsPath = path.resolve(clientDir, 'src', 'github-pages-main.jsx');
  
  // Create a GitHub Pages-specific entry file
  const mainJsContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// GitHub Pages specific setup
console.log('Running in GitHub Pages mode');

// Setup mock API responses for GitHub Pages
window.mockAPIResponses = {
  // Add mock responses for your API endpoints here
  '/api/chat': {
    success: true,
    message: "Hello! This is a mock response since GitHub Pages doesn't support backend APIs. In the actual application, this would connect to GPT-4o."
  },
  '/api/health': {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
};

// Mock fetch for GitHub Pages
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (url.toString().startsWith('/api/')) {
    console.log('Mocking API call to:', url);
    const endpoint = url.toString().split('?')[0]; // Remove query params
    
    // Return mock response if available
    if (window.mockAPIResponses[endpoint]) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            status: 200,
            json: async () => window.mockAPIResponses[endpoint],
          });
        }, 500); // Simulate network delay
      });
    }
  }
  
  // Pass through to original fetch for non-API calls
  return originalFetch(url, options);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  `;
  
  fs.writeFileSync(mainJsPath, mainJsContent);
  
  // Create a GitHub Pages specific index.html
  const ghPagesIndexPath = path.resolve(clientDir, 'github-pages-index.html');
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI & ML Portfolio - Prabhmehar</title>
    <meta name="description" content="Portfolio showcasing Generative AI and Machine Learning projects by Prabhmehar Pal Singh Bedi" />
    <!-- GitHub Pages doesn't support server-side redirects, so we add a base tag -->
    <base href="/AI-Data-Portfolio/" />
    <!-- Add any additional meta tags or analytics here -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/github-pages-main.jsx"></script>
  </body>
</html>
  `;
  
  fs.writeFileSync(ghPagesIndexPath, indexHtmlContent);
}

// Create GitHub Pages specific files
createGitHubPagesEntrypoint();

// Create a GitHub Pages workflow file for GitHub Actions
const workflowsDir = path.resolve(__dirname, '.github', 'workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for GitHub Pages
        run: npm run build:gh-pages
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'
  
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

fs.writeFileSync(path.join(workflowsDir, 'gh-pages.yml'), workflowContent);

// Create a .nojekyll file to prevent GitHub Pages from using Jekyll
fs.writeFileSync(path.resolve(__dirname, 'build', '.nojekyll'), '');

// Add npm scripts for GitHub Pages
try {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add GitHub Pages specific scripts
  packageJson.scripts['build:gh-pages'] = 'node build-gh-pages.js && vite build --config vite.github-pages.js';
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with GitHub Pages scripts');
} catch (error) {
  console.error('Error updating package.json:', error);
}

console.log('GitHub Pages setup complete!');
console.log('To deploy:');
console.log('1. Push this code to your GitHub repository');
console.log('2. Run: npm run build:gh-pages');
console.log('3. Enable GitHub Pages in your repository settings');
console.log('4. Or use the GitHub Actions workflow we created');
