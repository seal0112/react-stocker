import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import { Tabs, Tab } from 'react-bootstrap'
import CustomizedTable from 'components/CustomizedTable'
import YearRangePicker from 'components/YearRangePicker'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

const Revenue = () => {
  const [revenueData, setRevenueData] = useState([
    ['Year/Month', '當月營收', '去年同月增減', '上月比較增減', '備註', '均價'],
    ['', 0, 0, 0, '', null]
  ])
  const [activeKey, setActiveKey] = useState('precentageOperExp')
  const [yearRange, setYearRange] = useState(5)
  const stock = useStock()

  const revenueKeysOrder = [
    { title: 'Year/Month', transferToFloat: false },
    { title: '當月營收', transferToFloat: false },
    { title: '去年同月增減', transferToFloat: false },
    { title: '上月比較增減', transferToFloat: false },
    { title: '備註', transferToFloat: false },
    { title: '均價', transferToFloat: true }
  ]

  const handleCount = (key) => {
    setActiveKey(key)
  }

  const handleRevenueData = (revenueData) => {
    setRevenueData(revenueData)
  }

  useEffect(() => {
    Promise.all([
      StockerAPI.getRevenue(stock.stockNum, yearRange),
      StockerAPI.getMonthlyValuation(stock.stockNum, yearRange)
    ]).then(([revenueRaw, valuationRaw]) => {
      const valuationMap = {}
      valuationRaw.forEach(v => {
        valuationMap[`${v.year}/${v.month}`] = v.均價
      })
      const merged = revenueRaw.map(r => ({
        ...r,
        '均價': valuationMap[r['Year/Month']] ?? null
      }))
      return StockerTool.formatDataForGoogleChart(merged, revenueKeysOrder)
    }).then(handleRevenueData)
  }, [stock.stockNum, yearRange])

  // index: 0=Year/Month, 1=當月營收, 2=去年同月增減, 3=上月比較增減, 4=備註, 5=均價
  const revenueWithPrice = revenueData.map(d => [d[0], d[1], d[5]])
  const annualIncrease = revenueData.map(d => [d[0], d[2]])
  const monthIncrease = revenueData.map(d => [d[0], d[3]])

  return (
    <div className="revenue">
      <YearRangePicker value={yearRange} onChange={setYearRange} />
      <Tabs defaultActiveKey="revenue" id="Revenue-Analysis-tab" onSelect={handleCount}>
        <Tab eventKey="revenue" title="當月營收">
          <StockerChart
            type="combo"
            data={revenueWithPrice}
            height="400px"
            options={{
              title: '當月營收',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              seriesType: 'bars',
              series: {
                0: { type: 'bars', targetAxisIndex: 0 },
                1: { type: 'line', targetAxisIndex: 1 }
              },
              vAxes: {
                0: { minValue: 0 },
                1: { minValue: 0 }
              },
              hAxis: { showTextEvery: 12 },
              colors: ['#2cc185', '#6096FD']
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
              legend: { position: 'top' },
              chartArea: { width: '75%' },
              seriesType: 'line',
              series: { 0: { visibleInLegend: true } },
              pointSize: 7,
              vAxes: { 0: {} },
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
              legend: { position: 'top' },
              chartArea: { width: '75%' },
              seriesType: 'line',
              series: { 0: { visibleInLegend: true } },
              pointSize: 7,
              vAxes: { 0: {} },
              hAxis: {},
              colors: ['#dc3545']
            }}
          />
        </Tab>
      </Tabs>
      <CustomizedTable data={revenueData} />
    </div>
  )
}

export default Revenue
