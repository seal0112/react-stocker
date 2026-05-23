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

const belowZeroPlugin = {
  id: 'belowZeroBackground',
  afterDraw (chart) {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y
    if (!yScale) return
    const yZero = yScale.getPixelForValue(0)
    const clampedY = Math.min(Math.max(yZero, chartArea.top), chartArea.bottom)
    if (clampedY >= chartArea.bottom) return
    ctx.save()
    ctx.fillStyle = 'rgba(220, 53, 69, 0.07)'
    ctx.fillRect(chartArea.left, clampedY, chartArea.right - chartArea.left, chartArea.bottom - clampedY)
    ctx.restore()
  }
}

const ChartJSCombo = ({ data, options = {}, height = '400px' }) => {
  const seriesType = options.seriesType || 'line'
  const colors = options.colors || palette

  const chartData = formatForChartJS(data, {
    type: seriesType,
    colors,
    pointSize: options.pointSize
  })

  // 設定每個 dataset 的類型
  chartData.datasets = chartData.datasets.map((dataset, index) => {
    const seriesConfig = options.series?.[index] || {}
    const type = seriesConfig.type || seriesType
    const targetAxisIndex = seriesConfig.targetAxisIndex ?? 0

    return {
      ...dataset,
      type: type === 'bars' ? 'bar' : 'line',
      yAxisID: targetAxisIndex === 1 ? 'y1' : 'y',
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

  const plugins = options.belowZeroBackground ? [belowZeroPlugin] : []

  return (
    <div style={{ height, width: '100%' }}>
      <Chart type="bar" data={chartData} options={chartOptions} plugins={plugins} />
    </div>
  )
}

ChartJSCombo.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default ChartJSCombo
