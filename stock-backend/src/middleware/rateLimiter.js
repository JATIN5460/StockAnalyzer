// src/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

// General API — 100 requests per 15 minutes
const rateLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: "Too many requests. Please try again later." },
});

// AI endpoints — stricter: 20 requests per 15 minutes
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { error: "AI request limit reached. Please wait before retrying." },
});

module.exports = { rateLimiter, aiRateLimiter };