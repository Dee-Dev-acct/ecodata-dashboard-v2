import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { useMSSQL, mssqlClient } from "./db";
import { initializeMSSQLDatabase } from "./mssql-helper";
import { seedAllData } from "./seed-data";

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
  // Initialize MSSQL database if MSSQL is enabled
  if (useMSSQL) {
    try {
      log('Initializing MSSQL database connection...');
      // Give more time for the connection to be established
      setTimeout(async () => {
        try {
          if (mssqlClient) {
            log('MSSQL client connected, initializing database...');
            await initializeMSSQLDatabase();
            log('MSSQL database initialized successfully');
          } else {
            // If not connected yet, try connecting directly
            log('MSSQL client not initialized yet. Falling back to PostgreSQL.');
          }
        } catch (err) {
          log(`Error during MSSQL initialization: ${err}`);
          log('Falling back to PostgreSQL or in-memory storage.');
        }
      }, 5000); // 5 second delay
    } catch (error) {
      log(`Error in MSSQL setup: ${error}`);
    }
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Seed initial data for the database
    seedAllData().catch(err => {
      log(`Error seeding data: ${err}`);
    });
  });
})();
