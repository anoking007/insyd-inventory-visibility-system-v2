const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Note: run `npm install` in any folder that contains a package.json.
// - If your project has a package.json at the repository root: run `npm install` in the root.
// - If backend/frontend are separate with their own package.json, run `cd backend && npm install` and `cd frontend && npm install`.
// - Start the backend from the folder containing its start script: `npm run dev` or `npm start`.

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger to verify requests arrive
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Load routes with graceful fallback if files are missing
try {
  const inventoryRoutes = require("./routes/inventoryRoutes");
  app.use("/inventory", inventoryRoutes);
} catch (err) {
  console.error("Failed to load ./routes/inventoryRoutes:", err.message);
  // handle all methods so POST/PUT/DELETE won't hang or return Express default HTML
  app.all("/inventory", (req, res) =>
    res.status(500).json({ error: "Inventory routes not available", detail: err.message })
  );
}

try {
  const alertRoutes = require("./routes/alertRoutes");
  app.use("/alerts", alertRoutes);
} catch (err) {
  console.error("Failed to load ./routes/alertRoutes:", err.message);
  app.all("/alerts", (req, res) =>
    res.status(500).json({ error: "Alert routes not available", detail: err.message })
  );
}

app.get("/", (req, res) => {
  res.send("Inventory API running");
});

// register global handlers before starting server so exceptions/errors are caught
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // optional: exit process on uncaught exceptions in production
  // process.exit(1);
});

// start server with port-fallback on EADDRINUSE
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_TRIES = 5;

function startServer(port = DEFAULT_PORT, triesLeft = MAX_PORT_TRIES) {
  const server = app.listen(port);

  server.on("listening", () => {
    console.log(`Server running on port ${port}`);
    // set a socket timeout to avoid indefinitely hanging requests
    server.setTimeout(10 * 1000);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
      server.close();
      if (triesLeft > 1) {
        const nextPort = port + 1;
        console.log(`Trying next port: ${nextPort} (tries left: ${triesLeft - 1})`);
        // small delay to avoid tight loop
        setTimeout(() => startServer(nextPort, triesLeft - 1), 200);
      } else {
        console.error(
          `All ${MAX_PORT_TRIES} port attempts failed. Please free a port or set PORT in .env.`
        );
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

  return server;
}

// use the starter
startServer();

// final 404 handler (returns JSON instead of default HTML)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Add JSON error handler so next(err) returns a response
app.use((err, req, res, next) => {
  console.error("Express error handler:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// export app for tests/tools (optional)
module.exports = app;
