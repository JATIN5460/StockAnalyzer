// src/routes/ai.routes.js
const express          = require("express");
const router           = express.Router();
const { asyncHandler } = require("../middleware/errorHandler");
const { aiRateLimiter }= require("../middleware/rateLimiter");
const aiController     = require("../controllers/ai.controller");

// POST /api/ai/analyze   body: { ticker }
router.post("/analyze", aiRateLimiter, asyncHandler(aiController.analyze));

// POST /api/ai/chat      body: { ticker, messages[] }
router.post("/chat",    aiRateLimiter, asyncHandler(aiController.chat));

module.exports = router;