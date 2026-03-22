require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const Groq = require("groq-sdk");

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.1-8b-instant";

const fmtCap = (n) => {
  const num = parseInt(n);
  if (!num) return "N/A";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9)  return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6)  return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
};

const analyzeStock = async (ticker, quote, overview, history) => {
  const first = history[0]?.close  || quote.price;
  const last  = history[history.length - 1]?.close || quote.price;
  const trend = (((last - first) / first) * 100).toFixed(2);

  const prompt = `You are a professional stock market analyst. Analyze ${ticker} with this data:

REAL-TIME:
- Price: $${quote.price}  |  Change: ${quote.change} (${quote.changePercent})
- Day Range: $${quote.low} – $${quote.high}
- Volume: ${quote.volume?.toLocaleString()}
- Prev Close: $${quote.prevClose}

FUNDAMENTALS:
- Company: ${overview.name}  |  Sector: ${overview.sector}
- Market Cap: ${fmtCap(overview.marketCap)}
- P/E: ${overview.pe}  |  EPS: $${overview.eps}
- 52W Range: $${overview.fiftyTwoWeekLow} – $${overview.fiftyTwoWeekHigh}
- Analyst Target: $${overview.analystTarget}

30-DAY TREND: ${trend >= 0 ? "+" : ""}${trend}%

Write a professional analysis (max 250 words) covering:
1. Current price action and momentum
2. Valuation context
3. 30-day trend and technical setup
4. Key risks and short-term outlook`;

  const response = await groq.chat.completions.create({
    model:      MODEL,
    max_tokens: 600,
    messages:   [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

const chatAboutStock = async (ticker, quote, messages) => {
  const system = `You are a knowledgeable stock market assistant.
The user is analyzing ${ticker} (price: $${quote.price}, change: ${quote.changePercent}).
Answer clearly and concisely. Keep responses under 150 words.`;

  const response = await groq.chat.completions.create({
    model:      MODEL,
    max_tokens: 400,
    messages:   [{ role: "system", content: system }, ...messages],
  });

  return response.choices[0].message.content;
};

module.exports = { analyzeStock, chatAboutStock };