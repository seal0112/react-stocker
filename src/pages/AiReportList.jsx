import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Badge, Spinner, Alert, Form, Row, Col, Button, Collapse
} from 'react-bootstrap'
import dayjs from 'dayjs'
import { listAiReports } from 'utils/AiReportAPI'
import { SentimentBadge, StatusBadge } from 'components/EarningsCallShared'

const REPORT_TYPE_LABELS = {
  earnings_call: '法說會摘要',
  news: '新聞摘要'
}

const DEFAULT_FILTERS = {
  report_type: '',
  subject: '',
  processing_status: '',
  date_from: '',
  date_to: ''
}

const AiReportDetail = ({ report }) => {
  const kp = report.key_points || {}
  if (report.report_type === 'earnings_call') {
    return (
      <div className="p-3" style={{ background: '#f8f9fa', fontSize: '0.9rem' }}>
        <Row>
          <Col md={6}>
            {kp.outlook && (
              <div className="mb-2"><strong>前景展望</strong><p className="mb-1 mt-1">{kp.outlook}</p></div>
            )}
            {kp.capex && (
              <div className="mb-2">
                <strong>資本支出</strong>
                <p className="mb-1 mt-1">{kp.capex}</p>
                {kp.capex_industry && <small className="text-muted">產業：{kp.capex_industry}</small>}
              </div>
            )}
            {kp.concerns_and_risks && (
              <div className="mb-2"><strong>隱憂與風險</strong><p className="mb-1 mt-1">{kp.concerns_and_risks}</p></div>
            )}
          </Col>
          <Col md={6}>
            {report.summary && (
              <div className="mb-2"><strong>評分依據</strong><p className="mb-1 mt-1">{report.summary}</p></div>
            )}
            <div className="d-flex gap-3 mb-2 flex-wrap">
              <div><small className="text-muted">影響時程</small><br />{kp.impact_duration || '—'}</div>
              <div><small className="text-muted">資料來源</small><br />{kp.source_reliability || '—'}</div>
            </div>
          </Col>
        </Row>
        {(report.total_tokens > 0 || report.cost_twd > 0) && (
          <div className="mt-2 pt-2 border-top text-muted" style={{ fontSize: '0.78rem' }}>
            {report.model_name && <span className="me-3">模型：{report.model_name}</span>}
            <span className="me-3">Token：{report.input_tokens?.toLocaleString()} in / {report.output_tokens?.toLocaleString()} out</span>
            <span>費用：NT${Number(report.cost_twd).toFixed(2)}（USD ${Number(report.cost_usd).toFixed(4)}）</span>
          </div>
        )}
      </div>
    )
  }
  // news type
  return (
    <div className="p-3" style={{ background: '#f8f9fa', fontSize: '0.9rem' }}>
      {report.summary && <p className="mb-2">{report.summary}</p>}
      {kp.key_themes?.length > 0 && (
        <div>
          <strong>重點主題</strong>
          <ul className="mt-1">
            {kp.key_themes.map((t, i) => (
              <li key={i}><strong>{t.theme}</strong>：{t.description}</li>
            ))}
          </ul>
        </div>
      )}
      {(report.total_tokens > 0 || report.cost_twd > 0) && (
        <div className="mt-2 pt-2 border-top text-muted" style={{ fontSize: '0.78rem' }}>
          {report.model_name && <span className="me-3">模型：{report.model_name}</span>}
          <span className="me-3">Token：{report.input_tokens?.toLocaleString()} in / {report.output_tokens?.toLocaleString()} out</span>
          <span>費用：NT${Number(report.cost_twd).toFixed(2)}（USD ${Number(report.cost_usd).toFixed(4)}）</span>
        </div>
      )}
    </div>
  )
}

const AiReportList = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [expandedId, setExpandedId] = useState(null)

  const fetchReports = useCallback(async (f) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAiReports({ ...f, page_size: 50 })
      setReports(Array.isArray(data) ? data : (data.items || []))
    } catch (err) {
      setError('載入失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports(filters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => fetchReports(filters)

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    fetchReports(DEFAULT_FILTERS)
  }

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <Container className="py-4">
      <h2 className="mb-3">AI 報告</h2>

      <Row className="g-2 mb-3 align-items-end">
        <Col xs={12} sm={6} md={2}>
          <Form.Label className="mb-1 small">報告類型</Form.Label>
          <Form.Select size="sm" value={filters.report_type} onChange={e => setFilters(f => ({ ...f, report_type: e.target.value }))}>
            <option value="">全部</option>
            <option value="earnings_call">法說會摘要</option>
            <option value="news">新聞摘要</option>
          </Form.Select>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Form.Label className="mb-1 small">對象（股票代號/來源）</Form.Label>
          <Form.Control size="sm" value={filters.subject} onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))} placeholder="例：2330 或 trendforce" />
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Form.Label className="mb-1 small">狀態</Form.Label>
          <Form.Select size="sm" value={filters.processing_status} onChange={e => setFilters(f => ({ ...f, processing_status: e.target.value }))}>
            <option value="">全部</option>
            <option value="completed">完成</option>
            <option value="processing">處理中</option>
            <option value="pending">待處理</option>
            <option value="failed">失敗</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={2}>
          <Form.Label className="mb-1 small">開始日期</Form.Label>
          <Form.Control size="sm" type="date" value={filters.date_from} onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))} />
        </Col>
        <Col xs={6} md={2}>
          <Form.Label className="mb-1 small">結束日期</Form.Label>
          <Form.Control size="sm" type="date" value={filters.date_to} onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))} />
        </Col>
        <Col xs={12} md={2} className="d-flex gap-2">
          <Button size="sm" onClick={handleSearch} disabled={loading}>查詢</Button>
          <Button size="sm" variant="outline-secondary" onClick={handleReset} disabled={loading}>重設</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading
        ? <div className="text-center py-5"><Spinner animation="border" /></div>
        : (
          <Table bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>類型</th>
                <th>對象</th>
                <th>期間</th>
                <th>情緒</th>
                <th>狀態</th>
                <th>費用（TWD）</th>
                <th>建立時間</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <React.Fragment key={r.id}>
                  <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(r.id)}>
                    <td><Badge bg="info" style={{ fontSize: '0.75rem' }}>{REPORT_TYPE_LABELS[r.report_type] || r.report_type}</Badge></td>
                    <td>{r.subject}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {r.period_start === r.period_end
                        ? r.period_start
                        : `${r.period_start} ~ ${r.period_end}`}
                    </td>
                    <td>
                      {r.report_type === 'earnings_call'
                        ? <SentimentBadge sentiment={r.sentiment} score={r.score} />
                        : <span className="text-muted">—</span>}
                    </td>
                    <td><StatusBadge status={r.processing_status} /></td>
                    <td>{r.cost_twd ? `NT$${Number(r.cost_twd).toFixed(2)}` : '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{dayjs(r.created_at).format('MM/DD HH:mm')}</td>
                    <td className="text-center"><small className="text-muted">{expandedId === r.id ? '▲' : '▼'}</small></td>
                  </tr>
                  <tr style={{ display: expandedId === r.id ? '' : 'none' }}>
                    <td colSpan={8} style={{ padding: 0, borderTop: 'none' }}>
                      <Collapse in={expandedId === r.id}>
                        <div>{expandedId === r.id && <AiReportDetail report={r} />}</div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={8} className="text-center text-muted py-4">無資料</td></tr>
              )}
            </tbody>
          </Table>
        )}
    </Container>
  )
}

export default AiReportList
