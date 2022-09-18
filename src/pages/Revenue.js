import React, { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import { Tabs, Tab } from 'react-bootstrap'
import CustomizedTable from '../components/CustomizedTable'
import { useStock } from '../hooks/StockContext'
import * as StockerAPI from '../utils/StockerAPI'
import * as StockerTool from '../utils/StockerTool'

/*
 * Revenue Data example for google chart
 * revenueData: [
 *     ["Year/Month", "當月營收", "去年同月增減"],
 *     ["2013/1", 733.044, 22.6],
 * ]
 */
const Revenue = () => {
  const [revenueData, setRevenueData] = useState([
    ['Year/Month', '當月營收', '去年同月增減'],
    ['', 0, 0]
  ])
  const [activeKey, setActiveKey] = useState('precentageOperExp')
  const stock = useStock()
  const revenueKeysOrder = ['Year/Month', '當月營收', '去年同月增減']

  const handleCount = (key) => {
    setActiveKey(key)
  }

  const handleRevenueData = (revenueData) => {
    setRevenueData(revenueData)
  }

  useEffect(() => {
    StockerAPI.getRevenue(stock.stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, revenueKeysOrder))
      .then(handleRevenueData)
  }, [stock.stockNum])

  const revenue = revenueData.map(d => [].concat(d.slice(0, 2)))
  const annualIncrease = revenueData.map(d => [].concat(d.slice(0, 1), d.slice(2)))
  console.log(activeKey)
  return (
    <div className="revenue">
      <Tabs defaultActiveKey="revenue" id="Revenue-Analysis-tab" onSelect={handleCount}>
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
              hAxis: {}
            }}
            data={annualIncrease} />
        </Tab>
      </Tabs>
      <CustomizedTable data={revenueData}/>
    </div>
  )
}

export default Revenue
