import React, { useState, useEffect } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { StockerChart } from 'components/charts'
import { Tabs, Tab, Row, Col, Table } from 'react-bootstrap'
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

const calcAvgInRange = (vals, low, high) => {
  const sorted = [...vals].sort((a, b) => a - b)
  const loIdx = Math.floor((low / 100) * sorted.length)
  const hiIdx = Math.min(Math.ceil((high / 100) * sorted.length), sorted.length) - 1
  const slice = sorted.slice(loIdx, hiIdx + 1)
  if (slice.length === 0) return null
  return slice.reduce((a, b) => a + b, 0) / slice.length
}

const getPercentileRank = (sortedVals, value) => {
  const below = sortedVals.filter(v => v <= value).length
  return Math.round((below / sortedVals.length) * 100)
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

  const handleSliderChange = (val) => {
    const next = { low: val[0], high: val[1] }
    setPercentile(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const getMetricAvg = (metric) => {
    const vals = rawData.map(r => parseFloat(r[metric])).filter(v => !isNaN(v))
    const avg = calcAvgInRange(vals, percentile.low, percentile.high)
    return avg != null ? parseFloat(avg.toFixed(2)) : null
  }

  const makeChartData = (field) => {
    if (rawData.length === 0) return [['Year/Month', field, '分位平均'], ['', null, null]]
    const avg = getMetricAvg(field)
    return StockerTool.formatDataForGoogleChart(
      rawData.map(r => ({ ...r, 分位平均: avg })),
      [
        { title: 'Year/Month', transferToFloat: false },
        { title: field, transferToFloat: true },
        { title: '分位平均', transferToFloat: true }
      ]
    )
  }

  const percentileStats = METRICS.map(metric => {
    const vals = rawData.map(r => parseFloat(r[metric])).filter(v => !isNaN(v)).sort((a, b) => a - b)
    if (vals.length === 0) return { metric, rangeAvg: '-', current: '-', rank: '-' }
    const rangeAvg = calcAvgInRange(vals, percentile.low, percentile.high)
    const latest = parseFloat(rawData[rawData.length - 1]?.[metric])
    return {
      metric,
      rangeAvg: rangeAvg != null ? rangeAvg.toFixed(2) : '-',
      current: isNaN(latest) ? '-' : latest.toFixed(2),
      rank: isNaN(latest) ? '-' : `${getPercentileRank(vals, latest)}%`
    }
  })

  const lineOverlay = {
    seriesType: 'line',
    series: {
      0: { type: 'line', targetAxisIndex: 0 },
      1: { type: 'line', targetAxisIndex: 0 }
    }
  }

  const barWithLine = {
    seriesType: 'bars',
    series: {
      0: { type: 'bars', targetAxisIndex: 0 },
      1: { type: 'line', targetAxisIndex: 0 }
    }
  }

  return (
    <div className="MonthlyValuation px-3 pt-3">
      <Row className="align-items-center mb-2">
        <Col xs="auto" className="text-muted" style={{ minWidth: 40 }}>{percentile.low}%</Col>
        <Col>
          <Slider
            range
            min={0}
            max={100}
            value={[percentile.low, percentile.high]}
            onChange={handleSliderChange}
            allowCross={false}
          />
        </Col>
        <Col xs="auto" className="text-muted" style={{ minWidth: 40 }}>{percentile.high}%</Col>
      </Row>

      <Table bordered size="sm" className="mb-3" style={{ width: 'auto' }}>
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
              <td>{rangeAvg}</td>
              <td>{current}</td>
              <td>{rank}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Tabs defaultActiveKey="price" id="monthly-valuation-tab">
        <Tab eventKey="price" title="月均價">
          <StockerChart
            type="combo"
            data={makeChartData('均價')}
            height="400px"
            options={{
              title: '月均價',
              legend: { position: 'top' },
              chartArea: { width: '80%' },
              colors: ['#6096FD', '#f4a261'],
              vAxis: { title: '價格 (元)', minValue: 0 },
              hAxis: { showTextEvery: 12 },
              ...barWithLine
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
              colors: ['#f4a261', '#dc3545'],
              pointSize: 4,
              hAxis: { showTextEvery: 12 },
              ...lineOverlay
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
              colors: ['#e76f51', '#dc3545'],
              pointSize: 4,
              hAxis: { showTextEvery: 12 },
              ...lineOverlay
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
              colors: ['#2cc185', '#dc3545'],
              pointSize: 4,
              hAxis: { showTextEvery: 12 },
              ...lineOverlay
            }}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

export default MonthlyValuation
