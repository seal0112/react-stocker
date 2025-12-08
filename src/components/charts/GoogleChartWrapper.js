import React from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'react-google-charts'

const GoogleChartWrapper = ({ type, data, options = {}, height = '400px' }) => {
  // 將統一的 type 轉換為 Google Charts 的 chartType
  const getChartType = (type) => {
    switch (type) {
      case 'line':
        return 'LineChart'
      case 'bar':
        return 'ColumnChart'
      case 'combo':
        return 'ComboChart'
      default:
        return 'ComboChart'
    }
  }

  return (
    <Chart
      chartType={getChartType(type)}
      width="100%"
      height={height}
      loader={<div>Loading Chart</div>}
      data={data}
      options={options}
    />
  )
}

GoogleChartWrapper.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'combo']).isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default GoogleChartWrapper
