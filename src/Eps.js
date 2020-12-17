import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import CustomizedTable from './CustomizedTable'
import * as StockerAPI from './utils/StockerAPI'
import * as StockerTool from './utils/StockerTool'

/* EPS Data example for google chart
 * epsData: [
 *     ['Year/Season', '基本每股盈餘'],
 *     ['2017Q4', 2.1]
 * ]
 */
class Eps extends Component {
  _isMounted = false

  state = {
    epsData: [
      ['Year/Season', '基本每股盈餘'],
      ['', 0]
    ]
  }

  epsKeysOrder = ['Year/Season', '基本每股盈餘']

  handleEpsState = (epsData) => {
    if (this._isMounted) {
      this.setState({ epsData })
    }
  }

  getEpsData = (stockNum) => {
    StockerAPI.getEps(stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, this.epsKeysOrder))
      .then(this.handleEpsState)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.stockNum !== prevProps.stockNum) {
      this.getEpsData(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getEpsData(this.props.stockNum)
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const epsData = this.state.epsData
    return (
      <div className="Eps">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          options={{
            title: 'EPS',
            legend: {
              position: 'top'
            },
            chartArea: { width: '80%' },
            colors: ['#2cc185'],
            vAxis: {
              title: 'EPS',
              minValue: 0
            },
            hAxis: {
              showTextEvery: 4
            }
          }}
          data={epsData} />
        <CustomizedTable data={epsData}/>
      </div>
    )
  }
}

export default Eps
