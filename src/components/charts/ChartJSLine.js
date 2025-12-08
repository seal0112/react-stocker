import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatForChartJS, convertGoogleOptionsToChartJS } from 'utils/ChartDataFormatter'
import { lineChartDefaults, mergeOptions, palette } from 'utils/ChartJSTheme'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ChartJSLine = ({ data, options = {}, height = '400px' }) => {
  const chartData = formatForChartJS(data, {
    type: 'line',
    colors: options.colors || options.series?.map(s => s.color) || palette,
    pointSize: options.pointSize
  })

  const chartOptions = mergeOptions(
    convertGoogleOptionsToChartJS(options, 'line'),
    lineChartDefaults
  )

  return (
    <div style={{ height, width: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

ChartJSLine.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default ChartJSLine
