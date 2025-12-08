import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import { Tabs, Tab } from 'react-bootstrap'
import CustomizedTable from 'components/CustomizedTable'
// import VerticalDataTable from 'components/VerticalDataTable'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

/*
 * Revenue Data example for google chart
 * revenueData: [
 *     ["Year/Month", "當月營收", "去年同月增減", "上月比較增減"],
 *     ["2013/1", 733.044, 22.6, 3.06],
 * ]
 */
const Revenue = () => {
  const [revenueData, setRevenueData] = useState([
    ['Year/Month', '當月營收', '去年同月增減', '上月比較增減', '備註'],
    ['', 0, 0, 0, '']
  ])
  const [activeKey, setActiveKey] = useState('precentageOperExp')
  const stock = useStock()
  const revenueKeysOrder = [
    {
      title: 'Year/Month',
      transferToFloat: false
    },
    {
      title: '當月營收',
      transferToFloat: false
    },
    {
      title: '去年同月增減',
      transferToFloat: false
    },
    {
      title: '上月比較增減',
      transferToFloat: false
    },
    {
      title: '備註',
      transferToFloat: false
    }
  ]

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
  const annualIncrease = revenueData.map(d => [].concat(d.slice(0, 1), d.slice(2, 3)))
  const monthIncrease = revenueData.map(d => [].concat(d.slice(0, 1), d.slice(3, 4)))
  console.log(activeKey)

  return (
    <div className="revenue">
      <Tabs defaultActiveKey="revenue" id="Revenue-Analysis-tab" onSelect={handleCount}>
        <Tab eventKey="revenue" title="當月營收">
          <StockerChart
            type="combo"
            data={revenue}
            height="400px"
            options={{
              title: '當月營收',
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
              },
              colors: ['#2cc185']
            }}
          />
        </Tab>
        <Tab eventKey="annualIncrease" title="營收年增率">
          <StockerChart
            type="combo"
            data={annualIncrease}
            height="500px"
            options={{
              title: '營收年增率',
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
              hAxis: {},
              colors: ['#dc3545']
            }}
          />
        </Tab>
        <Tab eventKey="monthIncrease" title="營收月增率">
          <StockerChart
            type="combo"
            data={monthIncrease}
            height="500px"
            options={{
              title: '營收月增率',
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
              hAxis: {},
              colors: ['#dc3545']
            }}
          />
        </Tab>
      </Tabs>
      <CustomizedTable data={revenueData} />
      {/* <VerticalDataTable data={revenueData} /> */}
    </div>
  )
}

export default Revenue
