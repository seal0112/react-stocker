import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const StockContext = createContext()

export const StockProvider = ({ children }) => {
  const [stockNum, setStockNum] = useState()
  const [stockExist, setStockExist] = useState(true)

  const handleStockNum = (stockNum) => {
    setStockNum(stockNum)
    setStockExist(true)
  }

  const handleStockExist = (exist) => {
    setStockExist(exist)
  }

  const value = { stockNum, stockExist, handleStockNum, handleStockExist }

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
