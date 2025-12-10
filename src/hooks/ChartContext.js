import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const ChartContext = createContext()

export const ChartProvider = ({ children }) => {
  const chartLibrary = process.env.REACT_APP_CHART_LIBRARY || 'google'

  return (
    <ChartContext.Provider value={{ chartLibrary }}>
      {children}
    </ChartContext.Provider>
  )
}

ChartProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useChartLibrary = () => {
  const context = useContext(ChartContext)
  if (!context) {
    return { chartLibrary: process.env.REACT_APP_CHART_LIBRARY || 'google' }
  }
  return context
}

export default ChartContext
