import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { StockerChart } from 'components/charts'
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

const STORAGE_KEY = 'monthly_valuation_percentile'

const METRIC_MAP = {
  price: { field: '均價', title: '月均價', color: '#6096FD', avgColor: '#f4a261', chartType: 'bar' },
  pe: { field: '本益比', title: '本益比 (P/E)', color: '#f4a261', avgColor: '#dc3545', chartType: 'line' },
  pb: { field: '淨值比', title: '淨值比 (P/B)', color: '#e76f51', avgColor: '#dc3545', chartType: 'line' },
  yield: { field: '殖利率', title: '殖利率 (%)', color: '#2cc185', avgColor: '#dc3545', chartType: 'line' }
}

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

const MonthlyValuation = () => {
  const { metric = 'price' } = useParams()
  const [rawData, setRawData] = useState([])
  const [percentile, setPercentile] = useState(loadPercentile)
  const stock = useStock()

  const config = METRIC_MAP[metric] || METRIC_MAP.price

  useEffect(() => {
    StockerAPI.getMonthlyValuation(stock.stockNum, 5)
      .then(data => {
        setRawData(data.map(r => ({ ...r, 'Year/Month': `${r.year}/${r.month}` })))
      })
  }, [stock.stockNum])

  const handleSliderChange = (val) => {
    const next = { low: val[0], high: val[1] }
    setPercentile(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const getAvg = () => {
    const vals = rawData.map(r => parseFloat(r[config.field])).filter(v => !isNaN(v))
    const avg = calcAvgInRange(vals, percentile.low, percentile.high)
    return avg != null ? parseFloat(avg.toFixed(2)) : null
  }

  const makeChartData = () => {
    if (rawData.length === 0) return [['Year/Month', config.field, '分位平均'], ['', null, null]]
    const avg = getAvg()
    return StockerTool.formatDataForGoogleChart(
      rawData.map(r => ({ ...r, 分位平均: avg })),
      [
        { title: 'Year/Month', transferToFloat: false },
        { title: config.field, transferToFloat: true },
        { title: '分位平均', transferToFloat: true }
      ]
    )
  }

  const isBar = config.chartType === 'bar'
  const chartOptions = {
    title: config.title,
    legend: { position: 'top' },
    chartArea: { width: '80%' },
    colors: [config.color, config.avgColor],
    hAxis: { showTextEvery: 12 },
    pointSize: isBar ? undefined : 4,
    seriesType: isBar ? 'bars' : 'line',
    series: {
      0: { type: isBar ? 'bars' : 'line', targetAxisIndex: 0 },
      1: { type: 'line', targetAxisIndex: 0 }
    }
  }

  return (
    <div className="MonthlyValuation px-3 pt-3">
      <Row className="align-items-center mb-4">
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
        <Col xs="auto">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                拖動左右把手選取歷史資料的分位範圍。<br />
                圖表橫線 = 落在此範圍內所有月份資料的平均值。<br />
                例：0% ~ 20% 為歷史最低的 20% 區間平均。
              </Tooltip>
            }
          >
            <span style={{ cursor: 'pointer', color: '#adb5bd' }}>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </span>
          </OverlayTrigger>
        </Col>
      </Row>

      <StockerChart
        type="combo"
        data={makeChartData()}
        height="450px"
        options={chartOptions}
      />
    </div>
  )
}

export default MonthlyValuation
