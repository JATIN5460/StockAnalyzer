// src/components/StockHeader.jsx
import { useStock } from '../context/StockContext'

const Metric = ({ label, value, color }) => (
  <div style={{ minWidth: 90 }}>
    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 5 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: color || 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</div>
  </div>
)

const SkeletonBlock = ({ w, h }) => (
  <div className="skeleton" style={{ width: w, height: h }} />
)

export default function StockHeader() {
  const { stockData, loading, ticker, error } = useStock()

  if (error) return (
    <div style={{
      background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
      borderRadius: 14, padding: '20px 24px', marginBottom: 20,
      color: 'var(--accent-red)', fontSize: 13,
    }}>
      ⚠ {error}
    </div>
  )

  if (loading) return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
      <SkeletonBlock w="80px" h="12px" />
      <div style={{ marginTop: 12 }}><SkeletonBlock w="200px" h="44px" /></div>
      <div style={{ marginTop: 10 }}><SkeletonBlock w="140px" h="18px" /></div>
      <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
        {[1,2,3,4].map(i => <SkeletonBlock key={i} w="70px" h="36px" />)}
      </div>
    </div>
  )

  if (!stockData) return null

  const { quote, overview } = stockData
  const isUp = parseFloat(quote.change) >= 0
  const changeColor = isUp ? 'var(--accent-green)' : 'var(--accent-red)'

  const fmt = (n) => {
    const num = parseInt(n)
    if (num >= 1e12) return `$${(num/1e12).toFixed(2)}T`
    if (num >= 1e9)  return `$${(num/1e9).toFixed(2)}B`
    if (num >= 1e6)  return `$${(num/1e6).toFixed(1)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="fade-up" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '24px 28px',
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 200, height: 200,
        background: `radial-gradient(circle, ${isUp ? 'rgba(0,245,160,0.05)' : 'rgba(244,63,94,0.05)'} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        {/* Left — price block */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 3 }}>{ticker}</span>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 4,
              background: isUp ? 'rgba(0,245,160,0.1)' : 'rgba(244,63,94,0.1)',
              color: changeColor, letterSpacing: 1,
            }}>
              {isUp ? '▲' : '▼'} LIVE
            </span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: -2, color: '#fff', lineHeight: 1 }}>
            ${parseFloat(quote.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ marginTop: 8, fontSize: 14, color: changeColor, fontWeight: 600 }}>
            {isUp ? '+' : ''}{parseFloat(quote.change).toFixed(2)} &nbsp;
            <span style={{ opacity: 0.7 }}>({quote.changePercent})</span>
          </div>
          {overview?.name && (
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
              {overview.name} · {overview.sector}
            </div>
          )}
        </div>

        {/* Right — metrics grid */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Metric label="DAY HIGH"   value={`$${parseFloat(quote.high).toFixed(2)}`}  color="var(--accent-green)" />
          <Metric label="DAY LOW"    value={`$${parseFloat(quote.low).toFixed(2)}`}   color="var(--accent-red)" />
          <Metric label="VOLUME"     value={parseInt(quote.volume).toLocaleString()} />
          <Metric label="MKT CAP"    value={fmt(overview?.marketCap || 0)} />
          <Metric label="P/E RATIO"  value={overview?.pe || '—'} />
          <Metric label="52W HIGH"   value={`$${overview?.fiftyTwoWeekHigh || '—'}`} color="var(--accent-green)" />
          <Metric label="52W LOW"    value={`$${overview?.fiftyTwoWeekLow  || '—'}`} color="var(--accent-red)" />
          <Metric label="TARGET"     value={`$${overview?.analystTarget    || '—'}`} color="var(--accent-blue)" />
        </div>
      </div>
    </div>
  )
}