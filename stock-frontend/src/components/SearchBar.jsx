// src/components/SearchBar.jsx
import { useState } from 'react'
import { useStock } from '../context/StockContext'

const WATCHLIST = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX', 'RELIANCE.NS',
  'TCS.NS','INFY.NS','HDFCBANK.NS','ICICIBANK.NS','WIPRO.NS','TATAMOTORS.NS','SBIN.NS',]

export default function SearchBar() {
  const { loadStock, ticker, loading } = useStock()
  const [input, setInput] = useState('')

  const handleSearch = () => {
    const t = input.trim().toUpperCase()
    if (t) { loadStock(t); setInput('') }
  }

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Search input row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: 13, pointerEvents: 'none',
          }}>$</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="TICKER SYMBOL"
            maxLength={10}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '13px 16px 13px 28px',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              letterSpacing: 2,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !input}
          style={{
            background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            borderRadius: 10,
            padding: '13px 24px',
            color: loading ? 'var(--text-muted)' : '#000',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1.5,
            transition: 'all 0.2s',
            minWidth: 100,
          }}
        >
          {loading ? '...' : 'SEARCH'}
        </button>
      </div>

      {/* Quick watchlist */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {WATCHLIST.map(s => (
          <button
            key={s}
            onClick={() => loadStock(s)}
            style={{
              background: ticker === s ? 'rgba(0,245,160,0.1)' : 'transparent',
              border: `1px solid ${ticker === s ? 'var(--accent-green)' : 'var(--border)'}`,
              borderRadius: 7,
              padding: '5px 12px',
              color: ticker === s ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: 11,
              letterSpacing: 1.5,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (ticker !== s) e.target.style.borderColor = 'var(--border-bright)' }}
            onMouseLeave={e => { if (ticker !== s) e.target.style.borderColor = 'var(--border)' }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}