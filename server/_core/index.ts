import "dotenv/config";
import "./tracing";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import fs from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleStripeWebhook } from "../stripe/webhook";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export async function createApp() {
  const app = express();
  
  // Stripe webhook must be registered BEFORE body parser for signature verification
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Static access to the bundled Codex core assets
  const codexAssetsPath = path.resolve(process.cwd(), "synthsara-codex-core");
  if (fs.existsSync(codexAssetsPath)) {
    app.use(
      "/codex-core",
      express.static(codexAssetsPath, {
        maxAge: process.env.NODE_ENV === "development" ? 0 : "12h",
      })
    );
  } else {
    console.warn("[codex] synthsara-codex-core not found at", codexAssetsPath);
  }
  // Static access to Synthsara.org reference assets
  const synthsaraOrgPath = path.resolve(process.cwd(), "synthsara-org");
  if (fs.existsSync(synthsaraOrgPath)) {
    app.use(
      "/synthsara-org",
      express.static(synthsaraOrgPath, {
        maxAge: process.env.NODE_ENV === "development" ? 0 : "12h",
      })
    );
  } else {
    console.warn("[codex] synthsara-org not found at", synthsaraOrgPath);
  }
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Serve static files in production (or Vercel environment)
  serveStatic(app);

  return app;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Stripe webhook must be registered BEFORE body parser for signature verification
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Static access to the bundled Codex core assets
  const codexAssetsPath = path.resolve(process.cwd(), "synthsara-codex-core");
  if (fs.existsSync(codexAssetsPath)) {
    app.use(
      "/codex-core",
      express.static(codexAssetsPath, {
        maxAge: process.env.NODE_ENV === "development" ? 0 : "12h",
      })
    );
  } else {
    console.warn("[codex] synthsara-codex-core not found at", codexAssetsPath);
  }
  // Static access to Synthsara.org reference assets
  const synthsaraOrgPath = path.resolve(process.cwd(), "synthsara-org");
  if (fs.existsSync(synthsaraOrgPath)) {
    app.use(
      "/synthsara-org",
      express.static(synthsaraOrgPath, {
        maxAge: process.env.NODE_ENV === "development" ? 0 : "12h",
      })
    );
  } else {
    console.warn("[codex] synthsara-org not found at", synthsaraOrgPath);
  }
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// Only start server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}
