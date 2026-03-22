// src/server.js

require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");

const { rateLimiter }  = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const stockRoutes      = require("./routes/stock.routes");
const aiRoutes         = require("./routes/ai.routes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(rateLimiter);

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/stocks", stockRoutes);
app.use("/api/ai",     aiRoutes);

// ── Health Check ───────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    uptime:    process.uptime().toFixed(2) + "s",
  });
});

// ── Error Handler (must be last) ───────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n  Server      →  http://localhost:${PORT}`);
  console.log(`\n   Health      →  http://localhost:${PORT}/health`);
  console.log(`\n Stock API   →  http://localhost:${PORT}/api/stocks/AAPL/full`);
  console.log(`\n  AI Analyze  →  POST http://localhost:${PORT}/api/ai/analyze\n`);
});

module.exports = app;