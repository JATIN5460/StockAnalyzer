// src/controllers/stock.controller.js
const marketData = require("../services/marketData.service");

// GET /api/stocks/:ticker/quote
const getQuote = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const data   = await marketData.getQuote(ticker);
  res.json({ success: true, data });
};

// GET /api/stocks/:ticker/history?size=compact|full
const getHistory = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const size   = req.query.size || "compact";
  const data   = await marketData.getHistory(ticker, size);
  res.json({ success: true, data });
};

// GET /api/stocks/:ticker/overview
const getOverview = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const data   = await marketData.getOverview(ticker);
  res.json({ success: true, data });
};

// GET /api/stocks/:ticker/full  — all 3 fetched in parallel
const getFull = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const [quote, history, overview] = await Promise.all([
    marketData.getQuote(ticker),
    marketData.getHistory(ticker),
    marketData.getOverview(ticker),
  ]);
  res.json({ success: true, data: { quote, history, overview } });
};

module.exports = { getQuote, getHistory, getOverview, getFull };