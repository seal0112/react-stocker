import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import CustomizedTable from 'components/CustomizedTable'
import { Tabs, Tab, Form, Row, Col, Table } from 'react-bootstrap'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

const STORAGE_KEY = 'monthly_valuation_percentile'
const METRICS = ['均價', '本益比', '淨值比', '殖利率']

const loadPercentile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { low: 20, high: 80 }
}

const savePercentile = (low, high) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ low, high }))
}

const calcPercentile = (sortedVals, pct) => {
  const idx = Math.floor((pct / 100) * sortedVals.length)
  return Math.min(idx, sortedVals.length - 1)
}

const getPercentileRank = (sortedVals, value) => {
  const below = sortedVals.filter(v => v <= value).length
  return Math.round((below / sortedVals.length) * 100)
}

const avg = (arr) => {
  const valid = arr.filter(v => v != null && !isNaN(v))
  if (valid.length === 0) return null
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
}

const MonthlyValuation = () => {
  const [rawData, setRawData] = useState([])
  const [percentile, setPercentile] = useState(loadPercentile)
  const stock = useStock()

  useEffect(() => {
    StockerAPI.getMonthlyValuation(stock.stockNum, 5)
      .then(data => {
        setRawData(data.map(r => ({
          ...r,
          'Year/Month': `${r.year}/${r.month}`
        })))
      })
  }, [stock.stockNum])

  const handlePercentileChange = (key, val) => {
    const num = Math.min(100, Math.max(0, Number(val)))
    const next = { ...percentile, [key]: num }
    setPercentile(next)
    savePercentile(next.low, next.high)
  }

  const makeChartData = (field) => {
    if (rawData.length === 0) return [['Year/Month', field], ['', null]]
    return StockerTool.formatDataForGoogleChart(rawData, [
      { title: 'Year/Month', transferToFloat: false },
      { title: field, transferToFloat: true }
    ])
  }

  const percentileStats = METRICS.map(metric => {
    const vals = rawData
      .map(r => parseFloat(r[metric]))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b)

    if (vals.length === 0) return { metric, rangeAvg: '-', current: '-', rank: '-' }

    const loIdx = calcPercentile(vals, percentile.low)
    const hiIdx = calcPercentile(vals, percentile.high)
    const rangeVals = vals.slice(loIdx, hiIdx + 1)
    const rangeAvg = avg(rangeVals)

    const latest = parseFloat(rawData[rawData.length - 1]?.[metric])
    const current = isNaN(latest) ? '-' : latest.toFixed(2)
    const rank = isNaN(latest) ? '-' : `${getPercentileRank(vals, latest)}%`

    return { metric, rangeAvg, current, rank }
  })

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
      <Row className="align-items-center mb-3 px-2 pt-3">
        <Col xs="auto">
          <Form.Label className="mb-0 me-2">分位範圍</Form.Label>
        </Col>
        <Col xs="auto">
          <Form.Control
            type="number"
            min={0} max={100}
            value={percentile.low}
            style={{ width: '75px' }}
            onChange={e => handlePercentileChange('low', e.target.value)}
          />
        </Col>
        <Col xs="auto">% ～ </Col>
        <Col xs="auto">
          <Form.Control
            type="number"
            min={0} max={100}
            value={percentile.high}
            style={{ width: '75px' }}
            onChange={e => handlePercentileChange('high', e.target.value)}
          />
        </Col>
        <Col xs="auto">%</Col>
      </Row>

      <Table bordered size="sm" className="mx-2 mb-4" style={{ width: 'auto' }}>
        <thead className="table-dark">
          <tr>
            <th>指標</th>
            <th>分位區間平均</th>
            <th>目前值</th>
            <th>目前歷史分位</th>
          </tr>
        </thead>
        <tbody>
          {percentileStats.map(({ metric, rangeAvg, current, rank }) => (
            <tr key={metric}>
              <td><strong>{metric}</strong></td>
              <td>{rangeAvg ?? '-'}</td>
              <td>{current}</td>
              <td>{rank}</td>
            </tr>
          ))}
        </tbody>
      </Table>

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
