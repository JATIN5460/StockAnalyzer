// src/routes/stock.routes.js
const express          = require("express");
const router           = express.Router();
const { asyncHandler } = require("../middleware/errorHandler");
const stockController  = require("../controllers/stock.controller");

// GET /api/stocks/:ticker/quote      → real-time price & change
router.get("/:ticker/quote",    asyncHandler(stockController.getQuote));

// GET /api/stocks/:ticker/history    → 30-day OHLCV data
router.get("/:ticker/history",  asyncHandler(stockController.getHistory));

// GET /api/stocks/:ticker/overview   → fundamentals (P/E, market cap, etc.)
router.get("/:ticker/overview", asyncHandler(stockController.getOverview));

// GET /api/stocks/:ticker/full       → all 3 above in one call (use this in frontend)
router.get("/:ticker/full",     asyncHandler(stockController.getFull));

module.exports = router;