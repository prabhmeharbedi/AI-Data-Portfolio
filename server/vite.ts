import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import WebSocket from "ws";
import colors from "picocolors";

export const log = (...args: any[]) => {
  console.log(colors.green("[server]"), ...args);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Fix the path to correctly locate client files in production mode
const CLIENT_BUILD_PATH = path.resolve(__dirname, "..", "client");

// Determine if we're running on Render
const isRender = process.env.RENDER === 'true';

// Setup Vite dev server for development
export async function setupVite(app: express.Express, server: ReturnType<typeof createServer>) {
  // Be more strict about production mode detection
  const isProduction = process.env.NODE_ENV === "production" || isRender;
  
  if (isProduction) {
    log(`Running in production mode (${isRender ? 'Render' : 'local'}), skipping Vite setup`);
    return;
  }

  log("Setting up Vite dev server for development");
  const { createServer: createViteServer } = await import("vite");

  try {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    // Serve index.html for all routes not starting with /api
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api")) {
        return next();
      }

      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, "..", "client", "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.message);
      }
    });

    // Set up websocket support
    const wss = new WebSocket.Server({ server });
    wss.on("connection", (ws) => {
      log("Client connected to websocket");
      ws.on("message", (message) => {
        log("received: %s", message);
      });
    });
  } catch (error) {
    log("Error setting up Vite development server. Falling back to static file serving.");
    console.error(error);
    // Fallback to static serving if Vite fails
    serveStatic(app);
  }
}

// Serve static files in production
export function serveStatic(app: express.Express) {
  log("Setting up static file serving for production");
  
  // Support both local and Render environments
  const buildPath = isRender ? 
    path.resolve(process.cwd(), "dist", "client") : 
    CLIENT_BUILD_PATH;
  
  log(`Attempting to serve static files from: ${buildPath}`);
  
  // Check if the build directory exists
  if (!fs.existsSync(buildPath)) {
    log(`Warning: Build directory ${buildPath} does not exist. Make sure to run 'npm run build' before starting in production mode.`);
    // Fall back to checking alternative locations
    const altPaths = [
      path.resolve(process.cwd(), "dist", "client"),
      path.resolve(process.cwd(), "client", "dist"),
      path.resolve(process.cwd(), "dist", "public"),
      path.resolve(__dirname, "..", "..", "client"),
      path.resolve(__dirname, "..", "dist", "client")
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        log(`Found alternative build directory at ${altPath}`);
        // Serve static files from the alternative path
        app.use(express.static(altPath));
        
        // Set up fallback to index.html
        setupFallbackRoutes(app, altPath);
        return;
      }
    }
    
    // If no build directory was found, log an error
    log("Error: No build directory found. The application may not work correctly.");
  } else {
    log(`Serving static files from ${buildPath}`);
    // Serve static files
    app.use(express.static(buildPath));
    
    // Set up fallback to index.html
    setupFallbackRoutes(app, buildPath);
  }
}

// Helper function to set up fallback routes to index.html
function setupFallbackRoutes(app: express.Express, buildPath: string) {
  // Serve index.html for all routes not starting with /api
  app.use("*", (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api")) {
      return next();
    }

    // Try to serve the index.html file
    const indexPath = path.join(buildPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      log(`Warning: ${indexPath} does not exist`);
      res.status(404).send("Not found");
    }
  });
}
