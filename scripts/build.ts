/**
 * Production build script for server code
 * This script bundles the server-side TypeScript code for production
 */

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

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
        // Add other packages as needed
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
    });

    console.log('Server build completed successfully!');
  } catch (error) {
    console.error('Error building server:', error);
    process.exit(1);
  }
}

// Run the build
buildServer(); 