import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Determine if we're running on Render
const isRender = process.env.RENDER === 'true';

// Runtime configuration check
function checkRequiredConfig() {
  const requiredEnvVars = [
    // Add required environment variables here if needed
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
  
  log("Configuration validation passed");
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Check configuration before startup
  checkRequiredConfig();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Be very explicit about production mode detection
  // We want to prioritize NODE_ENV but also check for Render environment
  const isDevelopment = !(process.env.NODE_ENV === "production" || isRender);
  
  log(`Running in ${isDevelopment ? "development" : "production"} mode${isRender ? ' on Render' : ''}`);
  
  if (isDevelopment) {
    // Only use Vite in development mode
    await setupVite(app, server);
  } else {
    // Always use static file serving in production or on Render
    serveStatic(app);
  }

  // Use PORT from environment variables with fallback
  // Note: Render sets PORT automatically, so we respect that
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  // In production, allow binding to any available interface
  const host = process.env.NODE_ENV === "production" || isRender ? "0.0.0.0" : "localhost";
  
  // Try to start the server, with fallback to another port if needed
  const startServer = (attemptPort: number, maxRetries = 3, retryCount = 0) => {
    server.listen(attemptPort, host)
      .on('listening', () => {
        log(`Server running on http://${host}:${attemptPort}`);
      })
      .on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE' && retryCount < maxRetries) {
          // Port is in use, try another one
          const nextPort = attemptPort + 1;
          log(`Port ${attemptPort} is in use, trying port ${nextPort}...`);
          startServer(nextPort, maxRetries, retryCount + 1);
        } else {
          log(`Failed to start server: ${error.message}`);
          throw error;
        }
      });
  };
  
  startServer(port);
})();
