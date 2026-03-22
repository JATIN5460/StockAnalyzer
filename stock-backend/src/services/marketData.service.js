// src/services/marketData.service.js
// Uses yahoo-finance2 npm package — free, no API key, handles auth internally
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
const cache        = require("../utils/cache");

// ── Real-time Quote ────────────────────────────────────────────────
const getQuote = async (ticker) => {
  const cacheKey = `quote:${ticker}`;
  const cached   = cache.get(cacheKey);
  if (cached) return cached;

  const data = await yahooFinance.quote(ticker);

  if (!data) {
    const err = new Error(`Ticker "${ticker}" not found.`);
    err.statusCode = 404;
    throw err;
  }

  const quote = {
    ticker:        data.symbol,
    price:         parseFloat(data.regularMarketPrice?.toFixed(2)),
    open:          parseFloat(data.regularMarketOpen?.toFixed(2)),
    high:          parseFloat(data.regularMarketDayHigh?.toFixed(2)),
    low:           parseFloat(data.regularMarketDayLow?.toFixed(2)),
    volume:        data.regularMarketVolume,
    change:        parseFloat(data.regularMarketChange?.toFixed(2)),
    changePercent: `${data.regularMarketChangePercent?.toFixed(2)}%`,
    prevClose:     parseFloat(data.regularMarketPreviousClose?.toFixed(2)),
    latestDay:     new Date().toISOString().split("T")[0],
  };

  cache.set(cacheKey, quote, 60);
  return quote;
};

// ── Daily Price History ────────────────────────────────────────────
const getHistory = async (ticker) => {
  const cacheKey = `history:${ticker}`;
  const cached   = cache.get(cacheKey);
  if (cached) return cached;

  const endDate   = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const data = await yahooFinance.chart(ticker, {
    period1:  startDate.toISOString().split("T")[0],
    period2:  endDate.toISOString().split("T")[0],
    interval: "1d",
  });

  if (!data?.quotes?.length) {
    const err = new Error(`No history for "${ticker}".`);
    err.statusCode = 404;
    throw err;
  }

  const history = data.quotes
    .filter(d => d.close !== null)
    .map(d => ({
      date:   new Date(d.date).toISOString().split("T")[0],
      open:   parseFloat(d.open?.toFixed(2)  || 0),
      high:   parseFloat(d.high?.toFixed(2)  || 0),
      low:    parseFloat(d.low?.toFixed(2)   || 0),
      close:  parseFloat(d.close?.toFixed(2) || 0),
      volume: d.volume || 0,
    }));

  cache.set(cacheKey, history, 300);
  return history;
};

// ── Company Overview ───────────────────────────────────────────────
const getOverview = async (ticker) => {
  const cacheKey = `overview:${ticker}`;
  const cached   = cache.get(cacheKey);
  if (cached) return cached;

  const data = await yahooFinance.quoteSummary(ticker, {
    modules: ["summaryProfile", "defaultKeyStatistics", "financialData", "summaryDetail"],
  });

  if (!data) {
    const err = new Error(`No overview for "${ticker}".`);
    err.statusCode = 404;
    throw err;
  }

  const profile   = data.summaryProfile      || {};
  const stats     = data.defaultKeyStatistics || {};
  const financial = data.financialData        || {};
  const summary   = data.summaryDetail        || {};

  const overview = {
    name:             ticker,
    sector:           profile.sector                       || "—",
    industry:         profile.industry                     || "—",
    marketCap:        summary.marketCap                    || 0,
    pe:               summary.trailingPE?.toFixed(2)       || "—",
    eps:              stats.trailingEps?.toFixed(2)        || "—",
    dividend:         summary.dividendYield ? `${(summary.dividendYield * 100).toFixed(2)}%` : "—",
    fiftyTwoWeekHigh: summary.fiftyTwoWeekHigh?.toFixed(2) || "—",
    fiftyTwoWeekLow:  summary.fiftyTwoWeekLow?.toFixed(2)  || "—",
    analystTarget:    financial.targetMeanPrice?.toFixed(2) || "—",
    description:      profile.longBusinessSummary          || "—",
  };

  cache.set(cacheKey, overview, 3600);
  return overview;
};

module.exports = { getQuote, getHistory, getOverview };