// src/context/StockContext.jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { fetchFull } from '../services/api'

const StockContext = createContext(null)

export const StockProvider = ({ children }) => {
  const [ticker, setTicker]       = useState('')
  const [stockData, setStockData] = useState(null)  // { quote, history, overview }
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const loadStock = useCallback(async (symbol) => {
    if (!symbol) return
    setLoading(true)
    setError(null)
    setStockData(null)
    try {
      const data = await fetchFull(symbol.toUpperCase())
      setStockData(data)
      setTicker(symbol.toUpperCase())
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load stock data.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <StockContext.Provider value={{ ticker, stockData, loading, error, loadStock }}>
      {children}
    </StockContext.Provider>
  )
}

export const useStock = () => useContext(StockContext)