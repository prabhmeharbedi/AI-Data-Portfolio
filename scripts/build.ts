/**
 * Production build script for server code
 * This script bundles the server-side TypeScript code for production
 */

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { runChecks } from './prebuild-check.js';

// Check for common errors before building
async function prebuildChecks() {
  console.log('Running prebuild checks...');
  
  try {
    // Run our comprehensive checks
    const checksPass = await runChecks();
    if (!checksPass) {
      console.error('Syntax checks failed. Please fix the issues before building.');
      return false;
    }
    
    console.log('Prebuild checks completed successfully.');
    return true;
  } catch (error) {
    console.error('Prebuild checks failed:', error);
    return false;
  }
}

async function buildServer() {
  console.log('Building server code...');

  try {
    // Ensure output directory exists
    const serverOutDir = path.resolve('dist', 'server');
    if (!fs.existsSync(serverOutDir)) {
      fs.mkdirSync(serverOutDir, { recursive: true });
    }

    // Build server code
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'dist/server',
      external: [
        // External dependencies that should not be bundled
        'express', 
        'vite', 
        'ws',
        'picocolors',
        '@neondatabase/serverless',
        'openai',
        'dotenv',
        // Add other packages as needed
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      logLevel: 'info',
    });

    console.log('Server build completed successfully!');
    return true;
  } catch (error) {
    console.error('Error building server:', error);
    return false;
  }
}

// Run the build process
(async () => {
  const prebuildSuccess = await prebuildChecks();
  if (!prebuildSuccess) {
    console.error('Prebuild checks failed. Aborting build.');
    process.exit(1);
  }
  
  const buildSuccess = await buildServer();
  if (!buildSuccess) {
    console.error('Server build failed. Exiting with error code.');
    process.exit(1);
  }
  
  console.log('Build process completed successfully!');
})(); 