# StockMind — Backend

## Quick Start

```bash
npm install
cp .env.example .env      # then fill in your API keys
npm run dev               # starts on http://localhost:5000
```

## Get Free API Keys

| Key | Where |
|-----|-------|
| `ALPHA_VANTAGE_API_KEY` | https://www.alphavantage.co/support/#api-key |
| `GROQ_API_KEY`          | https://console.groq.com |

## All Endpoints

### Stock Data (GET)
```
GET /health
GET /api/stocks/:ticker/quote
GET /api/stocks/:ticker/history
GET /api/stocks/:ticker/overview
GET /api/stocks/:ticker/full        ← use this in frontend
```

### AI (POST)
```
POST /api/ai/analyze    body: { "ticker": "AAPL" }
POST /api/ai/chat       body: { "ticker": "AAPL", "messages": [{"role":"user","content":"..."}] }
```

## Test in Browser

Open `test.html` directly in your browser — no Postman needed.

## Rate Limits

- General endpoints: 100 req / 15 min
- AI endpoints: 20 req / 15 min
- Alpha Vantage free tier: 25 req/day, 5 req/min


