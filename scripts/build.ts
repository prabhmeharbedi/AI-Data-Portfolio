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
        'nodemailer', // Add nodemailer to external to avoid dynamic require issues
        'events',     // Add events module which is required by nodemailer
        'crypto',     // Add crypto module which might be required
        'stream',     // Add stream module which might be required
        'util',       // Add util module which might be required
        'fs',         // Add fs module which might be required
        'http',       // Add http module which might be required
        'https',      // Add https module which might be required
        'net',        // Add net module which might be required
        'tls',        // Add tls module which might be required
        'path',       // Add path module which might be required
        'zlib',       // Add zlib module which might be required
        'os',         // Add os module which might be required
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