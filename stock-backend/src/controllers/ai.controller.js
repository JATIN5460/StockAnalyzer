// src/controllers/ai.controller.js
const aiService  = require("../services/ai.service");
const marketData = require("../services/marketData.service");

// POST /api/ai/analyze
// Body: { ticker: "AAPL" }
const analyze = async (req, res) => {
  const { ticker } = req.body;

  if (!ticker) {
    return res.status(400).json({ success: false, error: "ticker is required" });
  }

  const t = ticker.toUpperCase();

  // Fetch all market data in parallel before calling AI
  const [quote, overview, history] = await Promise.all([
    marketData.getQuote(t),
    marketData.getOverview(t),
    marketData.getHistory(t),
  ]);

  const analysis = await aiService.analyzeStock(t, quote, overview, history);

  res.json({ success: true, data: { analysis, quote } });
};

// POST /api/ai/chat
// Body: { ticker: "AAPL", messages: [{ role: "user", content: "..." }] }
const chat = async (req, res) => {
  const { ticker, messages } = req.body;

  if (!ticker || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      success: false,
      error: "ticker and messages[] are required",
    });
  }

  const t     = ticker.toUpperCase();
  const quote = await marketData.getQuote(t);
  const reply = await aiService.chatAboutStock(t, quote, messages);

  res.json({ success: true, data: { reply } });
};

module.exports = { analyze, chat };