import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { formatForChartJS, convertGoogleOptionsToChartJS } from 'utils/ChartDataFormatter'
import { comboChartDefaults, mergeOptions, palette } from 'utils/ChartJSTheme'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ChartJSCombo = ({ data, options = {}, height = '400px' }) => {
  const seriesType = options.seriesType || 'line'
  const colors = options.colors || options.series?.map(s => s.color) || palette

  const chartData = formatForChartJS(data, {
    type: seriesType,
    colors,
    pointSize: options.pointSize
  })

  // 設定每個 dataset 的類型
  chartData.datasets = chartData.datasets.map((dataset, index) => {
    const seriesConfig = options.series?.[index] || {}
    const type = seriesConfig.type || seriesType

    return {
      ...dataset,
      type: type === 'bars' ? 'bar' : 'line',
      backgroundColor: type === 'bars'
        ? colors[index % colors.length]
        : `${colors[index % colors.length]}20`,
      borderColor: colors[index % colors.length],
      fill: type !== 'bars' && (seriesConfig.fill ?? false)
    }
  })

  const chartOptions = mergeOptions(
    convertGoogleOptionsToChartJS(options, 'combo'),
    comboChartDefaults
  )

  return (
    <div style={{ height, width: '100%' }}>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  )
}

ChartJSCombo.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default ChartJSCombo
