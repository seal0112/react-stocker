import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'react-google-charts'
import CustomizedTable from './CustomizedTable'
import * as StockerAPI from './utils/StockerAPI'
import * as StockerTool from './utils/StockerTool'

/*
 * profit Data example for google chart
 * profitData: [
 *     ["Year/Season", "營業毛利率", "營業利益率", "稅前淨利率", "本期淨利率"],
 *     ["2017Q1", 51.94, 40.76, 41.82, 37.46],
 * ]
 */
class ProfitAnalysis extends Component {
  _isMounted = false

  static state = {
    profitData: [
      ['Year/Season', '營業毛利率', '營業利益率', '稅前淨利率', '本期淨利率'],
      ['', 0, 0, 0, 0]
    ]
  }

  propTypes = {
    stockNum: PropTypes.string.isRequired
  }

  profitKeysOrder = ['Year/Season', '營業毛利率', '營業利益率', '稅前淨利率', '本期淨利率']

  handleProfitState = (profitData) => {
    this.setState({ profitData })
  }

  getProfitData = (stockNum) => {
    StockerAPI.getProfit(stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, this.profitKeysOrder))
      .then(this.handleProfitState)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.stockNum !== prevProps.stockNum) {
      this.getProfitData(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getProfitData(this.props.stockNum)
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const data = this.state.profitData
    return (
      <div className="Profit-Analysis">
        <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          options={{
            title: '利潤分析',
            legend: { position: 'top' },
            chartArea: { width: '80%' },
            seriesType: 'line',
            series: {
              0: { visibleInLegend: true },
              1: { visibleInLegend: true },
              2: { visibleInLegend: true },
              3: { visibleInLegend: true },
              4: { visibleInLegend: true },
              5: { visibleInLegend: true }
            },
            pointSize: 7,
            vAxes: {
              0: {}
            },
            hAxis: {
              showTextEvery: 4
            },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset']
            }
          }}
          data={data} />
        <CustomizedTable data={data}/>
      </div>
    )
  }
}

export default ProfitAnalysis
