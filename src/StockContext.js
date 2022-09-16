import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
// import * as StockerAPI from './utils/StockerAPI'

const StockContext = createContext()

const StockProvider = ({ children }) => {
  const [stockNum, setStockNum] = useState('2330')
  // const [stockExist, setStockExist] = useState(false)

  const handleStockNum = (stockNum) => {
    setStockNum(stockNum)
  }

  // const handleStockExist = (stockExist) => {
  //   setStockExist(stockExist)
  // }

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

export { StockContext, StockProvider }
