// src/services/api.js
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Stock Data ─────────────────────────────────────────────────────
export const fetchFull = (ticker) =>
  api.get(`/api/stocks/${ticker}/full`).then(r => r.data.data)

export const fetchQuote = (ticker) =>
  api.get(`/api/stocks/${ticker}/quote`).then(r => r.data.data)

export const fetchHistory = (ticker, size = 'compact') =>
  api.get(`/api/stocks/${ticker}/history`, { params: { size } }).then(r => r.data.data)

export const fetchOverview = (ticker) =>
  api.get(`/api/stocks/${ticker}/overview`).then(r => r.data.data)

// ── AI ─────────────────────────────────────────────────────────────
export const fetchAnalysis = (ticker) =>
  api.post('/api/ai/analyze', { ticker }).then(r => r.data.data)

export const fetchChatReply = (ticker, messages) =>
  api.post('/api/ai/chat', { ticker, messages }).then(r => r.data.data.reply)

// ── Health ─────────────────────────────────────────────────────────
export const checkHealth = () =>
  api.get('/health').then(r => r.data)