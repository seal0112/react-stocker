import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import CustomizedTable from 'components/CustomizedTable'
import YearRangePicker from 'components/YearRangePicker'
import { Tabs, Tab } from 'react-bootstrap'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

const EMPTY_ROW = [['Year/Month', '-'], ['', null]]

const MonthlyValuation = () => {
  const [rawData, setRawData] = useState([])
  const [yearRange, setYearRange] = useState(5)
  const stock = useStock()

  useEffect(() => {
    StockerAPI.getMonthlyValuation(stock.stockNum, yearRange)
      .then(data => {
        const processed = data.map(r => ({
          ...r,
          'Year/Month': `${r.year}/${r.month}`
        }))
        setRawData(processed)
      })
  }, [stock.stockNum, yearRange])

  const makeChartData = (field) => {
    if (rawData.length === 0) return EMPTY_ROW
    return StockerTool.formatDataForGoogleChart(rawData, [
      { title: 'Year/Month', transferToFloat: false },
      { title: field, transferToFloat: true }
    ])
  }

  const tableData = rawData.length > 0
    ? StockerTool.formatDataForGoogleChart(rawData, [
        { title: 'Year/Month', transferToFloat: false },
        { title: '均價', transferToFloat: true },
        { title: '本益比', transferToFloat: true },
        { title: '淨值比', transferToFloat: true },
        { title: '殖利率', transferToFloat: true }
      ])
    : [['Year/Month', '均價', '本益比', '淨值比', '殖利率']]

  return (
    <div className="MonthlyValuation">
      <YearRangePicker value={yearRange} onChange={setYearRange} />
      <Tabs defaultActiveKey="price" id="monthly-valuation-tab">
        <Tab eventKey="price" title="月均價">
          <StockerChart
            type="bar"
            data={makeChartData('均價')}
            height="400px"
            options={{
              title: '月均價',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              colors: ['#6096FD'],
              vAxis: { title: '價格 (元)', minValue: 0 },
              hAxis: { showTextEvery: 12 }
            }}
          />
        </Tab>
        <Tab eventKey="pe" title="本益比">
          <StockerChart
            type="combo"
            data={makeChartData('本益比')}
            height="400px"
            options={{
              title: '本益比 (P/E)',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              seriesType: 'line',
              colors: ['#f4a261'],
              pointSize: 5,
              hAxis: { showTextEvery: 12 }
            }}
          />
        </Tab>
        <Tab eventKey="pb" title="淨值比">
          <StockerChart
            type="combo"
            data={makeChartData('淨值比')}
            height="400px"
            options={{
              title: '淨值比 (P/B)',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              seriesType: 'line',
              colors: ['#e76f51'],
              pointSize: 5,
              hAxis: { showTextEvery: 12 }
            }}
          />
        </Tab>
        <Tab eventKey="yield" title="殖利率">
          <StockerChart
            type="combo"
            data={makeChartData('殖利率')}
            height="400px"
            options={{
              title: '殖利率 (%)',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              seriesType: 'line',
              colors: ['#2cc185'],
              pointSize: 5,
              hAxis: { showTextEvery: 12 }
            }}
          />
        </Tab>
      </Tabs>
      <CustomizedTable data={tableData} />
    </div>
  )
}

export default MonthlyValuation
