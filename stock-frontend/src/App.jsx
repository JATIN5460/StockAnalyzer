// src/App.jsx
import { StockProvider } from './context/StockContext'
import SearchBar    from './components/SearchBar'
import StockHeader  from './components/StockHeader'
import PriceChart   from './components/PriceChart'
import AIAnalysis   from './components/AIAnalysis'
import Chat         from './components/Chat'

export default function App() {
  return (
    <StockProvider>
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '0 0 60px',
      }}>
        {/* Top bar */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'flex', alignItems: 'center', gap: 14,
          backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(5,7,15,0.92)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#000',
          }}>⚡</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
              StockMind
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 3 }}>AI MARKET INTELLIGENCE</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>LIVE</span>
          </div>
        </header>

        {/* Main content */}
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px 0' }}>
          <SearchBar />
          <StockHeader />

          {/* Two column layout for chart + chat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <PriceChart />
            </div>
          </div>

          <AIAnalysis />
          <Chat />
        </main>
      </div>
    </StockProvider>
  )
}