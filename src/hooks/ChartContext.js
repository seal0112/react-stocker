import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const STORAGE_KEY = 'chart_library'

const ChartContext = createContext()

export const ChartProvider = ({ children }) => {
  const [chartLibrary, setChartLibrary] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'chartjs'
  )

  const toggleChartLibrary = () => {
    setChartLibrary(prev => {
      const next = prev === 'chartjs' ? 'google' : 'chartjs'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return (
    <ChartContext.Provider value={{ chartLibrary, toggleChartLibrary }}>
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
    return {
      chartLibrary: localStorage.getItem(STORAGE_KEY) || 'chartjs',
      toggleChartLibrary: () => {}
    }
  }
  return context
}

export default ChartContext
