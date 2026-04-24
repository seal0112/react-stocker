import React from 'react'
import PropTypes from 'prop-types'
import ChartJSLine from './ChartJSLine'
import ChartJSBar from './ChartJSBar'
import ChartJSCombo from './ChartJSCombo'

const StockerChart = ({ type, data, options = {}, height = '400px' }) => {
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

StockerChart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'combo']).isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.string
}

export default StockerChart
