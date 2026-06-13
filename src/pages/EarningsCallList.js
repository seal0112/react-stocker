import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Spinner, Form, Row, Col, Button, Collapse
} from 'react-bootstrap'
import * as StockerAPI from 'utils/StockerAPI'
import { useAuth } from 'hooks/AuthContext'
import dayjs from 'dayjs'
import { SentimentBadge, StatusBadge, SummaryDetail } from 'components/EarningsCallShared'

const SCORE_FILTERS = [
  { label: '全部', scoreMin: undefined, scoreMax: undefined },
  { label: '強力買入 (+4 ~ +5)', scoreMin: 4, scoreMax: 5 },
  { label: '買入 (+2 ~ +3)', scoreMin: 2, scoreMax: 3 },
  { label: '中性 (-1 ~ +1)', scoreMin: -1, scoreMax: 1 },
  { label: '賣出 (-2 ~ -3)', scoreMin: -3, scoreMax: -2 },
  { label: '強力賣出 (-4 ~ -5)', scoreMin: -5, scoreMax: -4 }
]

const EarningsCallList = () => {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('admin')

  const [earningsCalls, setEarningsCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const [stock, setStock] = useState('')
  const [meetingDate, setMeetingDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [scoreFilterIdx, setScoreFilterIdx] = useState(0)

  const handleSummaryUpdated = useCallback((earningsCallId, summary) => {
    setEarningsCalls(prev => prev.map(ec =>
      ec.id === earningsCallId ? { ...ec, summary } : ec
    ))
  }, [])

  const fetchEarningsCalls = useCallback((params = {}) => {
    setLoading(true)
    setExpandedId(null)
    StockerAPI.getEarningsCallList(params)
      .then(data => { setEarningsCalls(data || []) })
      .catch(() => setEarningsCalls([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchEarningsCalls({ meeting_date: dayjs().format('YYYY-MM-DD') })
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
                                  onSummaryUpdated={handleSummaryUpdated}
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
