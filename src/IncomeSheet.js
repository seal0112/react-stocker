import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import CustomizedTable from './CustomizedTable'
import * as StockerAPI from './utils/StockerAPI'
import * as StockerTool from './utils/StockerTool'

/*
 * Income Sheet Data example for google chart
 * incomeSheetData: [
 *     ["Year/Season", "營業收入合計", "營業毛利", "營業利益", "稅前淨利", "本期淨利", "母公司業主淨利"],
 *     ["2017Q4", 277570284, 138715365, 108894999, 111674900, 99306060, 99286122]
 * ]
 */
class IncomeSheet extends Component {
  _isMounted = false

  state = {
    incomeSheetData: [
      ['Year/Season', '營業收入合計', '營業毛利', '營業利益', '稅前淨利', '本期淨利', '母公司業主淨利'],
      ['', 0, 0, 0, 0, 0, 0]
    ]
  }

  incomeSheetKeysOrder = [
    'Year/Season', '營業收入合計', '營業毛利', '營業利益', '稅前淨利', '本期淨利', '母公司業主淨利']

  handleIncomeSheetState = (incomeSheetData) => {
    this.setState({ incomeSheetData })
  }

  getIncomeSheetData = (stockNum) => {
    StockerAPI.getIncomeSheet(stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, this.incomeSheetKeysOrder))
      .then(this.handleIncomeSheetState)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.stockNum !== prevProps.stockNum) {
      this.getIncomeSheetData(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getIncomeSheetData(this.props.stockNum)
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const data = this.state.incomeSheetData
    return (
      <div className="IncomeSheet">
        <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          loader={ <div>Loading Chart</div> }
          options={{
            chart: {
              title: '損益表'
            },
            legend: {
              position: 'top'
            },
            chartArea: { width: '80%' },
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
              // Adds labels to each axis; they don't have to match the axis names.
              0: { baseline: 0 }
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

export default IncomeSheet
