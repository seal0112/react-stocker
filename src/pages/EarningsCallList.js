import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Container, Table, Spinner, Form, Row, Col, Button, Badge, Collapse, Alert
} from 'react-bootstrap'
import * as StockerAPI from 'utils/StockerAPI'
import { useAuth } from 'hooks/AuthContext'
import dayjs from 'dayjs'

const SCORE_FILTERS = [
  { label: '全部', scoreMin: undefined, scoreMax: undefined },
  { label: '強力買入 (+4 ~ +5)', scoreMin: 4, scoreMax: 5 },
  { label: '買入 (+2 ~ +3)', scoreMin: 2, scoreMax: 3 },
  { label: '中性 (-1 ~ +1)', scoreMin: -1, scoreMax: 1 },
  { label: '賣出 (-2 ~ -3)', scoreMin: -3, scoreMax: -2 },
  { label: '強力賣出 (-4 ~ -5)', scoreMin: -5, scoreMax: -4 }
]

const SENTIMENT_CONFIG = {
  /* eslint-disable quote-props */
  'Strong Buy': { bg: 'success', label: '強力買入' },
  Buy: { bg: 'primary', label: '買入' },
  Neutral: { bg: 'secondary', label: '中性' },
  Sell: { bg: 'warning', label: '賣出' },
  'Strong Sell': { bg: 'danger', label: '強力賣出' }
  /* eslint-enable quote-props */
}

const STATUS_CONFIG = {
  completed: { bg: 'success', label: '完成' },
  processing: { bg: 'warning', label: '處理中' },
  pending: { bg: 'secondary', label: '待處理' },
  failed: { bg: 'danger', label: '失敗' }
}

const SentimentBadge = ({ sentiment, score }) => {
  if (sentiment == null) return <span className="text-muted">—</span>
  const cfg = SENTIMENT_CONFIG[sentiment] || { bg: 'secondary', label: sentiment }
  return (
    <span>
      <Badge bg={cfg.bg} className="me-1">{cfg.label}</Badge>
      <small className="text-muted">{score > 0 ? `+${score}` : score}</small>
    </span>
  )
}
SentimentBadge.propTypes = {
  sentiment: PropTypes.string,
  score: PropTypes.number
}

const StatusBadge = ({ status }) => {
  if (!status) return <span className="text-muted">—</span>
  const cfg = STATUS_CONFIG[status] || { bg: 'secondary', label: status }
  return <Badge bg={cfg.bg}>{cfg.label}</Badge>
}
StatusBadge.propTypes = { status: PropTypes.string }

const SummaryDetail = ({ earningsCallId, processingStatus, isAdmin, meetingDate }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState(null)
  const [boundFeeds, setBoundFeeds] = useState([])

  useEffect(() => {
    StockerAPI.getEarningsCallSummary(earningsCallId)
      .then(data => { setSummary(data); setLoading(false) })
      .catch(err => {
        if (err.response?.status === 404) {
          setSummary(null)
          setLoading(false)
        } else {
          setError('載入失敗')
          setLoading(false)
        }
      })
    StockerAPI.getEarningsCallBoundFeeds(earningsCallId)
      .then(data => setBoundFeeds(data || []))
      .catch(() => setBoundFeeds([]))
  }, [earningsCallId])

  const handleTrigger = () => {
    setTriggering(true)
    setTriggerMsg(null)
    StockerAPI.triggerEarningsCallSummary(earningsCallId)
      .then(() => setTriggerMsg({ variant: 'success', text: '已送出分析請求，約 1 分鐘後完成' }))
      .catch(() => setTriggerMsg({ variant: 'danger', text: '觸發失敗，請稍後再試' }))
      .finally(() => setTriggering(false))
  }

  const meetingPassed = meetingDate ? !dayjs(meetingDate).isAfter(dayjs(), 'day') : true
  const canTrigger = isAdmin && meetingPassed && (!processingStatus || processingStatus === 'failed' || processingStatus === 'pending')

  if (loading) return <div className="py-2 text-center"><Spinner animation="border" size="sm" /></div>
  if (error) return <Alert variant="danger" className="mb-0 py-2">{error}</Alert>
  if (!summary) {
    return (
      <div className="p-3">
        <p className="text-muted mb-2">尚無 AI 分析資料</p>
        {canTrigger && (
          <Button size="sm" variant="outline-primary" onClick={handleTrigger} disabled={triggering}>
            {triggering ? <><Spinner animation="border" size="sm" className="me-1" />觸發中...</> : '觸發 AI 分析'}
          </Button>
        )}
        {triggerMsg && <Alert variant={triggerMsg.variant} className="mt-2 mb-0 py-1 px-2" style={{ fontSize: '0.85rem' }}>{triggerMsg.text}</Alert>}
      </div>
    )
  }

  const ERROR_MESSAGES = {
    'No related feeds found': '找不到相關新聞，無法產生 AI 摘要'
  }

  if (summary.processing_status === 'failed') {
    const displayMsg = ERROR_MESSAGES[summary.error_message] || summary.error_message || '分析失敗'
    return (
      <div className="p-3">
        <Alert variant="warning" className="mb-2 py-2">
          <strong>分析失敗：</strong>{displayMsg}
        </Alert>
        {canTrigger && (
          <Button size="sm" variant="outline-primary" onClick={handleTrigger} disabled={triggering}>
            {triggering ? <><Spinner animation="border" size="sm" className="me-1" />觸發中...</> : '重新觸發 AI 分析'}
          </Button>
        )}
        {triggerMsg && <Alert variant={triggerMsg.variant} className="mt-2 mb-0 py-1 px-2" style={{ fontSize: '0.85rem' }}>{triggerMsg.text}</Alert>}
      </div>
    )
  }

  return (
    <div className="p-3" style={{ background: '#f8f9fa', fontSize: '0.9rem' }}>
      <Row>
        <Col md={6}>
          {summary.outlook && (
            <div className="mb-2">
              <strong>前景展望</strong>
              <p className="mb-1 mt-1">{summary.outlook}</p>
            </div>
          )}
          {summary.capex && (
            <div className="mb-2">
              <strong>資本支出</strong>
              <p className="mb-1 mt-1">{summary.capex}</p>
              {summary.capex_industry && (
                <small className="text-muted">產業：{summary.capex_industry}</small>
              )}
            </div>
          )}
          {summary.concerns_and_risks && (
            <div className="mb-2">
              <strong>隱憂與風險</strong>
              <p className="mb-1 mt-1">{summary.concerns_and_risks}</p>
            </div>
          )}
        </Col>
        <Col md={6}>
          <div className="mb-2">
            <strong>評分依據</strong>
            <p className="mb-1 mt-1">{summary.reasoning || '—'}</p>
          </div>
          <div className="d-flex gap-3 mb-2 flex-wrap">
            <div><small className="text-muted">影響時程</small><br />{summary.impact_duration || '—'}</div>
            <div><small className="text-muted">資料來源</small><br />{summary.source_reliability || '—'}</div>
          </div>
          {boundFeeds.length > 0 && (
            <div>
              <strong>參考新聞</strong>
              <ul className="mt-1 ps-0 mb-0" style={{ listStyle: 'none' }}>
                {boundFeeds.map((feed) => (
                  <li key={feed.feed_id} className="mb-2">
                    <div className="d-flex align-items-start gap-2">
                      <span className={`fw-bold flex-shrink-0 ${feed.score_delta > 0 ? 'text-success' : feed.score_delta < 0 ? 'text-danger' : 'text-muted'}`}
                        style={{ minWidth: '2rem', textAlign: 'right' }}>
                        {feed.score_delta > 0 ? `+${feed.score_delta}` : feed.score_delta ?? '—'}
                      </span>
                      <div>
                        {feed.link
                          ? <a href={feed.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>{feed.title}</a>
                          : <span style={{ fontSize: '0.85rem' }}>{feed.title}</span>
                        }
                        {feed.key_insight && (
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{feed.key_insight}</div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(summary.total_tokens > 0 || summary.cost_twd > 0) && (
            <div className="mt-3 pt-2 border-top text-muted" style={{ fontSize: '0.78rem' }}>
              <span className="me-3">Token：{summary.input_tokens?.toLocaleString()} in / {summary.output_tokens?.toLocaleString()} out</span>
              <span>費用：NT${Number(summary.cost_twd).toFixed(2)}（USD ${Number(summary.cost_usd).toFixed(4)}）</span>
            </div>
          )}
          {canTrigger && processingStatus === 'completed' && (
            <div className="mt-3">
              <Button size="sm" variant="outline-secondary" onClick={handleTrigger} disabled={triggering}>
                {triggering ? <><Spinner animation="border" size="sm" className="me-1" />觸發中...</> : '重新觸發 AI 分析'}
              </Button>
              {triggerMsg && <Alert variant={triggerMsg.variant} className="mt-2 mb-0 py-1 px-2" style={{ fontSize: '0.85rem' }}>{triggerMsg.text}</Alert>}
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}

SummaryDetail.propTypes = {
  earningsCallId: PropTypes.number.isRequired,
  processingStatus: PropTypes.string,
  isAdmin: PropTypes.bool,
  meetingDate: PropTypes.string
}

const EarningsCallList = () => {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('admin')

  const [earningsCalls, setEarningsCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const [stock, setStock] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [scoreFilterIdx, setScoreFilterIdx] = useState(0)

  const fetchEarningsCalls = useCallback((params = {}) => {
    setLoading(true)
    setExpandedId(null)
    StockerAPI.getEarningsCallList(params)
      .then(data => { setEarningsCalls(data || []) })
      .catch(() => setEarningsCalls([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchEarningsCalls()
  }, [fetchEarningsCalls])

  const handleSearch = (e) => {
    e.preventDefault()
    const scoreFilter = SCORE_FILTERS[scoreFilterIdx]
    const params = {}
    if (stock) params.stock = stock
    if (meetingDate) params.meeting_date = meetingDate
    if (scoreFilter.scoreMin !== undefined) params.score_min = scoreFilter.scoreMin
    if (scoreFilter.scoreMax !== undefined) params.score_max = scoreFilter.scoreMax
    fetchEarningsCalls(params)
  }

  const handleReset = () => {
    setStock('')
    setMeetingDate('')
    setScoreFilterIdx(0)
    fetchEarningsCalls()
  }

  const toggleRow = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <main>
      <Container>
        <h4 style={{ marginBottom: '1rem' }}>法說會列表</h4>

        <Form style={{ marginBottom: '1rem' }} onSubmit={handleSearch}>
          <Row className="mb-3 g-2">
            <Col sm={3}>
              <Form.Group>
                <Form.Label>股票代碼</Form.Label>
                <Form.Control
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="例如：2330"
                />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>指定日期</Form.Label>
                <Form.Control
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>AI 評分篩選</Form.Label>
                <Form.Select
                  value={scoreFilterIdx}
                  onChange={(e) => setScoreFilterIdx(Number(e.target.value))}
                >
                  {SCORE_FILTERS.map((f, i) => (
                    <option key={i} value={i}>{f.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={2} className="d-flex align-items-end gap-2">
              <Button variant="primary" type="submit">搜尋</Button>
              <Button variant="secondary" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>

        {loading
          ? <div style={{ textAlign: 'center', padding: '2rem' }}><Spinner animation="border" variant="success" /></div>
          : earningsCalls.length === 0
            ? <p className="text-muted">沒有符合條件的法說會資料</p>
            : (
              <Table bordered hover responsive style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>代碼</th>
                    <th>日期</th>
                    <th>AI 評分</th>
                    <th>AI 狀態</th>
                    <th>地點 / 說明</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {earningsCalls.map((ec) => (
                    <React.Fragment key={ec.id}>
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleRow(ec.id)}
                      >
                        <td>
                          <strong>{ec.stock_id}</strong>
                          {ec.company_name && <div className="text-muted" style={{ fontSize: '0.8rem' }}>{ec.company_name}</div>}
                        </td>
                        <td>{ec.meeting_date ? dayjs(ec.meeting_date).format('YYYY-MM-DD') : '—'}</td>
                        <td>
                          <SentimentBadge
                            sentiment={ec.summary?.sentiment}
                            score={ec.summary?.score}
                          />
                        </td>
                        <td><StatusBadge status={ec.summary?.processing_status} /></td>
                        <td className="text-truncate" style={{ maxWidth: 0 }}>
                          <small>{ec.location || ''}{ec.location && ec.description ? '・' : ''}{ec.description || ''}</small>
                        </td>
                        <td className="text-center">
                          <small className="text-muted">
                            {expandedId === ec.id ? '▲ 收起' : '▼ 展開分析'}
                          </small>
                        </td>
                      </tr>
                      <tr style={{ display: expandedId === ec.id ? '' : 'none' }}>
                        <td colSpan={6} style={{ padding: 0, borderTop: 'none' }}>
                          <Collapse in={expandedId === ec.id}>
                            <div>
                              {expandedId === ec.id && (
                                <SummaryDetail
                                  earningsCallId={ec.id}
                                  processingStatus={ec.summary?.processing_status}
                                  isAdmin={isAdmin}
                                  meetingDate={ec.meeting_date}
                                />
                              )}
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
              )}
      </Container>
    </main>
  )
}

export default EarningsCallList
