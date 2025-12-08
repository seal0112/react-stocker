import React, { createContext, useContext } from 'react'

const ChartContext = createContext()

export const ChartProvider = ({ children }) => {
  const chartLibrary = process.env.REACT_APP_CHART_LIBRARY || 'google'

  return (
    <ChartContext.Provider value={{ chartLibrary }}>
      {children}
    </ChartContext.Provider>
  )
}

export const useChartLibrary = () => {
  const context = useContext(ChartContext)
  if (!context) {
    return { chartLibrary: process.env.REACT_APP_CHART_LIBRARY || 'google' }
  }
  return context
}

export default ChartContext
