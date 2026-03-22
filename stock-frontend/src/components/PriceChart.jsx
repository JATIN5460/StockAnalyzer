// src/components/PriceChart.jsx
import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts'
import { useStock } from '../context/StockContext'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
      borderRadius: 8, padding: '10px 14px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
        ${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  )
}

export default function PriceChart() {
  const { stockData, loading } = useStock()
  const [range, setRange] = useState(30)

  const chartData = useMemo(() => {
    if (!stockData?.history) return []
    return stockData.history
      .slice(-range)
      .map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: d.close,
        open: d.open,
        high: d.high,
        low: d.low,
      }))
  }, [stockData, range])

  const isUp = useMemo(() => {
    if (chartData.length < 2) return true
    return chartData[chartData.length - 1].price >= chartData[0].price
  }, [chartData])

  const color = isUp ? 'var(--accent-green)' : 'var(--accent-red)'
  const colorHex = isUp ? '#00f5a0' : '#f43f5e'

  const priceMin = Math.min(...chartData.map(d => d.price)) * 0.995
  const priceMax = Math.max(...chartData.map(d => d.price)) * 1.005
  const currentPrice = stockData?.quote?.price

  if (!stockData && !loading) return null

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 20px 12px', marginBottom: 20,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 2 }}>PRICE CHART</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 14, 30].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              background: range === r ? 'rgba(0,245,160,0.1)' : 'transparent',
              border: `1px solid ${range === r ? 'var(--accent-green)' : 'var(--border)'}`,
              borderRadius: 6, padding: '4px 12px',
              color: range === r ? 'var(--accent-green)' : 'var(--text-muted)',
              fontSize: 11, letterSpacing: 1, transition: 'all 0.15s',
            }}>{r}D</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={colorHex} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colorHex} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickLine={false} axisLine={false}
              interval={Math.floor(chartData.length / 5)}
            />
            <YAxis
              domain={[priceMin, priceMax]}
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickLine={false} axisLine={false}
              width={60}
              tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {currentPrice && (
              <ReferenceLine
                y={parseFloat(currentPrice)}
                stroke={colorHex}
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
            )}
            <Area
              type="monotone"
              dataKey="price"
              stroke={colorHex}
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 5, fill: colorHex, stroke: 'var(--bg-base)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
