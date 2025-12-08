import React from 'react'
import PropTypes from 'prop-types'
import { useChartLibrary } from 'hooks/ChartContext'
import GoogleChartWrapper from './GoogleChartWrapper'
import ChartJSLine from './ChartJSLine'
import ChartJSBar from './ChartJSBar'
import ChartJSCombo from './ChartJSCombo'

/**
 * 統一圖表介面組件
 * 根據環境變數 REACT_APP_CHART_LIBRARY 自動選擇底層實現
 *
 * @param {string} type - 圖表類型: 'line' | 'bar' | 'combo'
 * @param {Array} data - Google Charts 格式的二維陣列數據
 * @param {Object} options - 圖表配置選項 (Google Charts 格式)
 * @param {string} height - 圖表高度
 */
const StockerChart = ({ type, data, options = {}, height = '400px' }) => {
  const { chartLibrary } = useChartLibrary()

  if (chartLibrary === 'chartjs') {
    switch (type) {
      case 'line':
        return <ChartJSLine data={data} options={options} height={height} />
      case 'bar':
        return <ChartJSBar data={data} options={options} height={height} />
      case 'combo':
      default:
        return <ChartJSCombo data={data} options={options} height={height} />
    }
  }

  // 預設使用 Google Charts
  return (
    <GoogleChartWrapper
      type={type}
      data={data}
      options={options}
      height={height}
    />
  )
}

StockerChart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'combo']).isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default StockerChart
