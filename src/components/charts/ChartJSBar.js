import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatForChartJS, convertGoogleOptionsToChartJS } from 'utils/ChartDataFormatter'
import { barChartDefaults, mergeOptions, palette } from 'utils/ChartJSTheme'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ChartJSBar = ({ data, options = {}, height = '400px' }) => {
  const chartData = formatForChartJS(data, {
    type: 'bar',
    colors: options.colors || options.series?.map(s => s.color) || palette
  })

  const chartOptions = mergeOptions(
    convertGoogleOptionsToChartJS(options, 'bar'),
    barChartDefaults
  )

  return (
    <div style={{ height, width: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  )
}

ChartJSBar.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default ChartJSBar
