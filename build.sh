#!/bin/bash
set -e

echo "=== Starting build process ==="

# Install dependencies if needed
if [ "$CI" = "true" ] || [ "$RENDER" = "true" ]; then
  echo "=== Installing dependencies ==="
  npm ci || npm install
else
  echo "=== Checking dependencies ==="
  npm install
fi

# Run prebuild checks (skip on Render to avoid tsx issues)
if [ "$RENDER" != "true" ]; then
  echo "=== Running prebuild checks ==="
  npm run prebuild
else
  echo "=== Skipping prebuild checks on Render ==="
fi

# Build client files
echo "=== Building client files ==="
npx vite build --outDir dist/client

# Build server files
echo "=== Building server files ==="
if [ "$RENDER" = "true" ]; then
  # On Render, use node_modules/.bin directly
  echo "Using direct path to esbuild on Render"
  mkdir -p dist/server
  node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server
else
  npx tsx scripts/build.ts
fi

# Ensure dist structure is correct
echo "=== Verifying build structure ==="
mkdir -p dist/client

# Check if any of the files are missing
if [ ! -f "dist/client/index.html" ]; then
  echo "Warning: dist/client/index.html is missing"
  
  # Check if files are in a different location
  if [ -f "dist/public/index.html" ]; then
    echo "Found files in dist/public, copying to dist/client"
    cp -r dist/public/* dist/client/
  fi
fi

# Make sure server files exist
if [ ! -f "dist/server/index.js" ]; then
  echo "Error: Server files not built correctly"
  exit 1
fi

# Create a simpler structure for Render if needed
echo "=== Creating Render-friendly file structure ==="
# Copy server/index.js to dist/index.js for Render
cp dist/server/index.js dist/index.js

# Print build info
echo "=== Build complete ==="
echo "Client files:"
ls -la dist/client
echo "Server files:"
ls -la dist/server
echo "Render-ready entrypoint:"
ls -la dist/index.js

echo "=== Build successful ===" 