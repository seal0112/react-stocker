import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Container, Row, Col, Form, Button, Table, Spinner, Alert, Card
} from 'react-bootstrap'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { getAiUsageReport } from 'utils/StockerAPI'
import { useAuth } from 'hooks/AuthContext'

ChartJS.register(ArcElement, Tooltip, Legend)

const PIE_COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
  '#59a14f', '#edc948', '#b07aa1', '#ff9da7'
]

const PIE_OPTIONS = {
  responsive: true,
  plugins: {
    legend: { position: 'right' },
    tooltip: {
      callbacks: {
        label: (ctx) => ` NT$${ctx.parsed.toFixed(2)} (${ctx.label})`
      }
    }
  }
}

const buildPieData = (rows, labelKey) => ({
  labels: rows.map(r => r[labelKey]),
  datasets: [{
    data: rows.map(r => Number(r.cost_twd || 0)),
    backgroundColor: rows.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
    borderWidth: 1
  }]
})

const SummaryCard = ({ title, value, sub }) => (
  <Card className="text-center h-100">
    <Card.Body>
      <div className="text-muted small mb-1">{title}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{value}</div>
      {sub && <div className="text-muted" style={{ fontSize: '0.82rem' }}>{sub}</div>}
    </Card.Body>
  </Card>
)

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  sub: PropTypes.string
}

SummaryCard.defaultProps = {
  sub: null
}

const AiUsageReport = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [dateFrom, setDateFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [dateTo, setDateTo] = useState(dayjs().format('YYYY-MM-DD'))
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReport = useCallback(async (from, to) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAiUsageReport(from, to)
      setReport(data)
    } catch (err) {
      setError(err.response?.status === 403 ? 'permission_denied' : '載入失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasRole('admin')) { navigate('/'); return }
    fetchReport(dateFrom, dateTo)
  }, [hasRole, navigate, fetchReport, dateFrom, dateTo])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchReport(dateFrom, dateTo)
  }

  if (error === 'permission_denied') {
    return (
      <Container className="py-4">
        <h2>AI 費用報表</h2>
        <Alert variant="danger">權限不足，需要管理員權限。</Alert>
      </Container>
    )
  }

  const totalCostTwd = report?.by_feature?.reduce((s, r) => s + r.cost_twd, 0) || 0
  const totalCostUsd = report?.by_feature?.reduce((s, r) => s + r.cost_usd, 0) || 0
  const totalTokens = report?.by_feature?.reduce((s, r) => s + r.total_tokens, 0) || 0
  const totalCount = report?.by_feature?.reduce((s, r) => s + r.count, 0) || 0

  const featurePieData = report?.by_feature?.length > 0
    ? buildPieData(report.by_feature, 'feature')
    : null

  const modelPieData = report?.by_model?.length > 0
    ? buildPieData(report.by_model, 'model_name')
    : null

  return (
    <Container className="py-4">
      <h2 className="mb-3">AI 費用報表</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col sm={3}>
            <Form.Group>
              <Form.Label>開始日期</Form.Label>
              <Form.Control
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>結束日期</Form.Label>
              <Form.Control
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button variant="primary" type="submit">查詢</Button>
          </Col>
        </Row>
      </Form>

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" /></div>
        : error
          ? <Alert variant="danger">{error}</Alert>
          : (
            <>
              {/* 總覽卡片 */}
              <Row className="g-3 mb-4">
                <Col xs={6} sm={3}>
                  <SummaryCard
                    title="總費用"
                    value={`NT$${totalCostTwd.toFixed(2)}`}
                    sub={`USD $${totalCostUsd.toFixed(4)}`}
                  />
                </Col>
                <Col xs={6} sm={3}>
                  <SummaryCard
                    title="總 Token 數"
                    value={totalTokens.toLocaleString()}
                  />
                </Col>
                <Col xs={6} sm={3}>
                  <SummaryCard
                    title="分析次數"
                    value={totalCount.toLocaleString()}
                  />
                </Col>
                <Col xs={6} sm={3}>
                  <SummaryCard
                    title="平均每次費用"
                    value={totalCount > 0 ? `NT$${(totalCostTwd / totalCount).toFixed(2)}` : '-'}
                  />
                </Col>
              </Row>

              {/* 圓餅圖 */}
              {(featurePieData || modelPieData)
                ? (
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Card>
                        <Card.Header>費用佔比（依功能）</Card.Header>
                        <Card.Body>
                          <Pie data={featurePieData} options={PIE_OPTIONS} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Header>費用佔比（依模型）</Card.Header>
                        <Card.Body>
                          <Pie data={modelPieData} options={PIE_OPTIONS} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  )
                : <Alert variant="secondary">此日期範圍無資料</Alert>
              }

              {/* 依功能彙總表 */}
              {report?.by_feature?.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>依功能彙總</Card.Header>
                  <Card.Body className="p-0">
                    <Table bordered responsive className="mb-0" style={{ fontSize: '0.9rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>功能</th>
                          <th className="text-end">次數</th>
                          <th className="text-end">Input Token</th>
                          <th className="text-end">Output Token</th>
                          <th className="text-end">費用 (TWD)</th>
                          <th className="text-end">費用 (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.by_feature.map((r) => (
                          <tr key={r.feature}>
                            <td>{r.feature}</td>
                            <td className="text-end">{r.count.toLocaleString()}</td>
                            <td className="text-end">{r.input_tokens.toLocaleString()}</td>
                            <td className="text-end">{r.output_tokens.toLocaleString()}</td>
                            <td className="text-end fw-bold">NT${Number(r.cost_twd).toFixed(2)}</td>
                            <td className="text-end text-muted">${Number(r.cost_usd).toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* 依模型彙總表 */}
              {report?.by_model?.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>依模型彙總</Card.Header>
                  <Card.Body className="p-0">
                    <Table bordered responsive className="mb-0" style={{ fontSize: '0.9rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>模型</th>
                          <th className="text-end">次數</th>
                          <th className="text-end">Input Token</th>
                          <th className="text-end">Output Token</th>
                          <th className="text-end">費用 (TWD)</th>
                          <th className="text-end">費用 (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.by_model.map((r) => (
                          <tr key={r.model_name}>
                            <td><code>{r.model_name}</code></td>
                            <td className="text-end">{r.count.toLocaleString()}</td>
                            <td className="text-end">{r.input_tokens.toLocaleString()}</td>
                            <td className="text-end">{r.output_tokens.toLocaleString()}</td>
                            <td className="text-end fw-bold">NT${Number(r.cost_twd).toFixed(2)}</td>
                            <td className="text-end text-muted">${Number(r.cost_usd).toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* 每日明細表 */}
              {report?.daily?.length > 0 && (
                <Card>
                  <Card.Header>每日明細</Card.Header>
                  <Card.Body className="p-0">
                    <Table bordered responsive className="mb-0" style={{ fontSize: '0.85rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>日期</th>
                          <th>功能</th>
                          <th>模型</th>
                          <th className="text-end">次數</th>
                          <th className="text-end">費用 (TWD)</th>
                          <th className="text-end">費用 (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.daily.map((r, i) => (
                          <tr key={i}>
                            <td>{r.date}</td>
                            <td>{r.feature}</td>
                            <td><code>{r.model_name}</code></td>
                            <td className="text-end">{r.count}</td>
                            <td className="text-end">NT${Number(r.cost_twd).toFixed(2)}</td>
                            <td className="text-end text-muted">${Number(r.cost_usd).toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </>
            )
      }
    </Container>
  )
}

export default AiUsageReport
