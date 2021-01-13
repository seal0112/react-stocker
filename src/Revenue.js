import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'react-google-charts'
import { Tabs, Tab } from 'react-bootstrap'
import CustomizedTable from './CustomizedTable'
import * as StockerAPI from './utils/StockerAPI'
import * as StockerTool from './utils/StockerTool'

/*
 * Revenue Data example for google chart
 * revenueData: [
 *     ["Year/Month", "當月營收", "去年同月增減"],
 *     ["2013/1", 733.044, 22.6],
 * ]
 */
class Revenue extends Component {
  _isMounted = false

  static propTypes = {
    stockNum: PropTypes.string.isRequired
  }

  state = {
    revenueData: [
      ['Year/Month', '當月營收', '去年同月增減'],
      ['', 0, 0]
    ],
    activeKey: 'precentageOperExp'
  }

  revenueKeysOrder = ['Year/Month', '當月營收', '去年同月增減']

  handleCount = (key) => {
    this.setState({
      activeKey: key
    })
  }

  handleRevenueData = (revenueData) => {
    this.setState({ revenueData })
  }

  getRevenueData = (stockNum) => {
    StockerAPI.getRevenue(stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, this.revenueKeysOrder))
      .then(this.handleRevenueData)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.stockNum !== prevProps.stockNum) {
      this.getRevenueData(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getRevenueData(this.props.stockNum)
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const data = this.state.revenueData
    const revenue = data.map(d => [].concat(d.slice(0, 2)))
    const annualIncrease = data.map(d => [].concat(d.slice(0, 1), d.slice(2)))
    return (
      <div className="revenue">
        <Tabs defaultActiveKey="revenue" id="Revenue-Analysis-tab" onSelect={this.handleCount}>
          <Tab eventKey="revenue" title="當月營收">
            <Chart
              chartType="ComboChart"
              width="100%"
              height="400px"
              loader={<div>Loading Chart</div>}
              options={{
                title: '營業費用比例',
                legend: {
                  position: 'top'
                },
                chartArea: { width: '80%' },
                seriesType: 'bars',
                series: {
                  0: { visibleInLegend: true, color: '#2cc185' }
                },
                pointSize: 7,
                vAxes: {
                  0: {}
                },
                hAxis: {
                  showTextEvery: 12
                }
              }}
              data={revenue} />
          </Tab>
          <Tab eventKey="annualIncrease" title="去年同月增減">
            <Chart
              chartType="ComboChart"
              width="100%"
              height="500px"
              loader={<div>Loading Chart</div>}
              options={{
                title: '去年同月增減',
                legend: {
                  position: 'top'
                },
                chartArea: { width: '75%' },
                seriesType: 'line',
                series: {
                  0: { visibleInLegend: true, color: 'red' }
                },
                pointSize: 7,
                vAxes: {
                  0: {}
                },
                hAxis: {

                }
              }}
              data={annualIncrease} />
          </Tab>
        </Tabs>
        <CustomizedTable data={data}/>
      </div>
    )
  }
}

export default Revenue
