import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const StockContext = createContext()

export const StockProvider = ({ children }) => {
  const [stockNum, setStockNum] = useState('2330')

  const handleStockNum = (stockNum) => {
    setStockNum(stockNum)
  }

  const value = { stockNum, handleStockNum }

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  )
}

StockProvider.propTypes = {
  children: PropTypes.object.isRequired
}

export const useStock = () => {
  return useContext(StockContext)
}
