// src/components/Chat.jsx
import { useState, useRef, useEffect } from 'react'
import { fetchChatReply } from '../services/api'
import { useStock } from '../context/StockContext'

const SUGGESTIONS = [
  'Is this stock overvalued?',
  'What are the key risks?',
  'How is the sector performing?',
  'Should I buy, hold, or sell?',
]

export default function Chat() {
  const { ticker, stockData } = useStock()
  const [messages, setMessages] = useState([])   // { role, content }
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Reset chat when ticker changes
  useEffect(() => { setMessages([]) }, [ticker])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || !ticker) return
    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)

    try {
      const reply = await fetchChatReply(ticker, newMessages)
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: '⚠ Failed to get a response. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!stockData) return null

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '22px 24px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 2, marginBottom: 16 }}>
        ASK AI — {ticker}
      </div>

      {/* Message thread */}
      <div style={{
        minHeight: 100, maxHeight: 320, overflowY: 'auto',
        marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.length === 0 && (
          <>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '16px 0 10px' }}>
              Ask anything about {ticker}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 20, padding: '5px 12px',
                  color: 'var(--text-secondary)', fontSize: 11,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.color = 'var(--accent-green)' }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)' }}
                >{s}</button>
              ))}
            </div>
          </>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, marginRight: 8, marginTop: 2, color: '#000', fontWeight: 700,
              }}>⚡</div>
            )}
            <div style={{
              maxWidth: '78%', padding: '10px 14px', borderRadius: 12,
              fontSize: 13, lineHeight: 1.65,
              background: m.role === 'user' ? 'rgba(0,245,160,0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${m.role === 'user' ? 'rgba(0,245,160,0.18)' : 'var(--border)'}`,
              color: m.role === 'user' ? '#b8f5df' : '#9aa0be',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#000', fontWeight: 700,
            }}>⚡</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)',
                  display: 'inline-block', opacity: 0.5,
                  animation: 'pulse-dot 1s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 9, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Ask about ${ticker}...`}
          style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 9,
            padding: '11px 14px', color: 'var(--text-primary)',
            fontSize: 13, outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-green)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            borderRadius: 9, padding: '11px 18px',
            color: '#000', fontWeight: 700, fontSize: 16,
            opacity: (!input.trim() || loading) ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >→</button>
      </div>
    </div>
  )
}