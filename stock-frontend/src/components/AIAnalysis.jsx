// src/components/AIAnalysis.jsx
import { useState } from 'react'
import { fetchAnalysis } from '../services/api'
import { useStock } from '../context/StockContext'

export default function AIAnalysis() {
  const { ticker, stockData } = useStock()
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [lastTicker, setLastTicker] = useState('')

  const handleAnalyze = async () => {
    if (!ticker) return
    setLoading(true)
    setError('')
    if (ticker !== lastTicker) setAnalysis('')
    try {
      const data = await fetchAnalysis(ticker)
      setAnalysis(data.analysis)
      setLastTicker(ticker)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analysis.')
    } finally {
      setLoading(false)
    }
  }

  if (!stockData) return null

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '22px 24px', marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 2 }}>AI ANALYSIS</div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            background: loading
              ? 'var(--bg-elevated)'
              : 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            borderRadius: 8, padding: '9px 18px',
            color: loading ? 'var(--text-muted)' : '#000',
            fontWeight: 700, fontSize: 11, letterSpacing: 1.5,
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          {loading ? (
            <>
              <LoadingDots />
              ANALYZING
            </>
          ) : (
            <>⚡ ANALYZE {ticker}</>
          )}
        </button>
      </div>

      {/* Content */}
      {error && (
        <div style={{ color: 'var(--accent-red)', fontSize: 12, padding: '12px 0' }}>⚠ {error}</div>
      )}

      {analysis ? (
        <div className="fade-in" style={{
          fontSize: 13, lineHeight: 1.9, color: '#9aa0be',
          whiteSpace: 'pre-wrap', borderTop: '1px solid var(--border)', paddingTop: 16,
        }}>
          {analysis}
        </div>
      ) : !loading && (
        <div style={{
          textAlign: 'center', padding: '28px 0',
          color: 'var(--text-muted)', fontSize: 12, letterSpacing: 1,
        }}>
          Click ANALYZE to generate an AI-powered report for {ticker}
        </div>
      )}
    </div>
  )
}

const LoadingDots = () => (
  <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
    {[0, 1, 2].map(i => (
      <span key={i} style={{
        width: 4, height: 4, borderRadius: '50%',
        background: 'var(--text-muted)',
        display: 'inline-block',
        animation: 'pulse-dot 1s ease-in-out infinite',
        animationDelay: `${i * 0.2}s`,
      }} />
    ))}
  </span>
)