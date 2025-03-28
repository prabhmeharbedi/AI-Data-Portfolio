import { Router } from "express";

export const healthRouter = Router();

/**
 * Health check endpoint for monitoring
 * Used by Render and other services to verify the application is running
 */
healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
}); 