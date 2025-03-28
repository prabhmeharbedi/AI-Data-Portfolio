import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "ws";
import colors from "picocolors";

export const log = (...args: any[]) => {
  console.log(colors.green("[server]"), ...args);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_BUILD_PATH = path.resolve(__dirname, "..", "dist", "client");

// Setup Vite dev server for development
export async function setupVite(app: express.Express, server: ReturnType<typeof createServer>) {
  if (process.env.NODE_ENV === "production") {
    log("Running in production mode, skipping Vite setup");
    return;
  }

  log("Setting up Vite dev server for development");
  const { createServer: createViteServer } = await import("vite");

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
  const wss = new Server({ server });
  wss.on("connection", (ws) => {
    log("Client connected to websocket");
    ws.on("message", (message) => {
      log("received: %s", message);
    });
  });
}

// Serve static files in production
export function serveStatic(app: express.Express) {
  log("Setting up static file serving for production");
  
  // Check if the build directory exists
  if (!fs.existsSync(CLIENT_BUILD_PATH)) {
    log(`Warning: Build directory ${CLIENT_BUILD_PATH} does not exist. Make sure to run 'npm run build' before starting in production mode.`);
  } else {
    log(`Serving static files from ${CLIENT_BUILD_PATH}`);
  }

  // Serve static files
  app.use(express.static(CLIENT_BUILD_PATH));

  // Serve index.html for all routes not starting with /api
  app.use("*", (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api")) {
      return next();
    }

    // Try to serve the index.html file
    const indexPath = path.join(CLIENT_BUILD_PATH, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      log(`Warning: ${indexPath} does not exist`);
      res.status(404).send("Not found");
    }
  });
}
