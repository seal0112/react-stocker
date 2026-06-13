import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Spinner, Badge, Button, Alert, Row, Col, Collapse } from 'react-bootstrap'
import dayjs from 'dayjs'
import * as StockerAPI from 'utils/StockerAPI'

export const SENTIMENT_CONFIG = {
  /* eslint-disable quote-props */
  'Strong Buy': { bg: 'success', label: '強力買入' },
  Buy: { bg: 'primary', label: '買入' },
  Neutral: { bg: 'secondary', label: '中性' },
  Sell: { bg: 'warning', label: '賣出' },
  'Strong Sell': { bg: 'danger', label: '強力賣出' }
  /* eslint-enable quote-props */
}

export const STATUS_CONFIG = {
  completed: { bg: 'success', label: '完成' },
  processing: { bg: 'warning', label: '處理中' },
  pending: { bg: 'secondary', label: '待處理' },
  failed: { bg: 'danger', label: '失敗' }
}

export const SentimentBadge = ({ sentiment, score }) => {
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

export const StatusBadge = ({ status }) => {
  if (!status) return <span className="text-muted">—</span>
  const cfg = STATUS_CONFIG[status] || { bg: 'secondary', label: status }
  return <Badge bg={cfg.bg}>{cfg.label}</Badge>
}
StatusBadge.propTypes = { status: PropTypes.string }

const POLL_INTERVAL_MS = 60_000
const POLL_MAX_MS = 5 * 60_000
const ERROR_MESSAGES = {
  'No related feeds found': '找不到相關新聞，無法產生 AI 摘要'
}

export const SummaryDetail = ({ earningsCallId, processingStatus, isAdmin, meetingDate, onSummaryUpdated }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState(null)
  const [boundFeeds, setBoundFeeds] = useState([])
  const [pollingCountdown, setPollingCountdown] = useState(null)
  const pollRef = useRef(null)
  const pollStartRef = useRef(null)

  const fetchSummary = useCallback(() => {
    return StockerAPI.getEarningsCallSummary(earningsCallId)
      .then(data => { setSummary(data); setLoading(false); return data })
      .catch(err => {
        if (err.response?.status === 404) {
          setSummary(null)
          setLoading(false)
        } else {
          setError('載入失敗')
          setLoading(false)
        }
        return null
      })
  }, [earningsCallId])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    setPollingCountdown(null)
  }, [])

  const startPolling = useCallback(() => {
    pollStartRef.current = Date.now()
    setPollingCountdown(5)
    pollRef.current = setInterval(() => {
      const elapsed = Date.now() - pollStartRef.current
      if (elapsed >= POLL_MAX_MS) {
        stopPolling()
        return
      }
      const remaining = Math.ceil((POLL_MAX_MS - elapsed) / 60_000)
      setPollingCountdown(remaining)
      fetchSummary().then(data => {
        if (data && data.processing_status === 'completed') {
          stopPolling()
          onSummaryUpdated?.(earningsCallId, data)
          StockerAPI.getEarningsCallBoundFeeds(earningsCallId)
            .then(feeds => setBoundFeeds(feeds || []))
            .catch(() => {})
        } else if (data && data.processing_status === 'failed') {
          stopPolling()
          onSummaryUpdated?.(earningsCallId, data)
        }
      })
    }, POLL_INTERVAL_MS)
  }, [earningsCallId, fetchSummary, stopPolling, onSummaryUpdated])

  useEffect(() => {
    fetchSummary()
    StockerAPI.getEarningsCallBoundFeeds(earningsCallId)
      .then(data => setBoundFeeds(data || []))
      .catch(() => setBoundFeeds([]))
    return () => stopPolling()
  }, [earningsCallId, fetchSummary, stopPolling])

  const handleTrigger = () => {
    setTriggering(true)
    setTriggerMsg(null)
    StockerAPI.triggerEarningsCallSummary(earningsCallId)
      .then(() => {
        setTriggerMsg({ variant: 'success', text: '已送出分析請求，每分鐘自動更新（最多 5 分鐘）' })
        startPolling()
      })
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
          <Button size="sm" variant="outline-primary" onClick={handleTrigger} disabled={triggering || !!pollingCountdown}>
            {triggering ? <><Spinner animation="border" size="sm" className="me-1" />觸發中...</> : '觸發 AI 分析'}
          </Button>
        )}
        {triggerMsg && (
          <Alert variant={triggerMsg.variant} className="mt-2 mb-0 py-1 px-2" style={{ fontSize: '0.85rem' }}>
            {triggerMsg.text}
            {pollingCountdown && <span className="ms-2 text-muted">（自動更新中，剩約 {pollingCountdown} 分鐘）</span>}
          </Alert>
        )}
      </div>
    )
  }

  if (summary.processing_status === 'failed') {
    const displayMsg = ERROR_MESSAGES[summary.error_message] || summary.error_message || '分析失敗'
    return (
      <div className="p-3">
        <Alert variant="warning" className="mb-2 py-2">
          <strong>分析失敗：</strong>{displayMsg}
        </Alert>
        {canTrigger && (
          <Button size="sm" variant="outline-primary" onClick={handleTrigger} disabled={triggering || !!pollingCountdown}>
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
                      <span
                        className={`fw-bold flex-shrink-0 ${feed.score_delta > 0 ? 'text-success' : feed.score_delta < 0 ? 'text-danger' : 'text-muted'}`}
                        style={{ minWidth: '2rem', textAlign: 'right' }}
                      >
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
              <Button size="sm" variant="outline-secondary" onClick={handleTrigger} disabled={triggering || !!pollingCountdown}>
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
  meetingDate: PropTypes.string,
  onSummaryUpdated: PropTypes.func
}

export const EarningsCallRow = ({ ec, expandedId, onToggle, isAdmin, onSummaryUpdated, colSpan }) => (
  <React.Fragment>
    <tr style={{ cursor: 'pointer' }} onClick={() => onToggle(ec.id)}>
      <td>{ec.meeting_date ? dayjs(ec.meeting_date).format('YYYY-MM-DD') : '—'}</td>
      <td>
        <SentimentBadge sentiment={ec.summary?.sentiment} score={ec.summary?.score} />
      </td>
      <td><StatusBadge status={ec.summary?.processing_status} /></td>
      <td className="text-truncate" style={{ maxWidth: 0 }}>
        <small>{ec.location || ''}{ec.location && ec.description ? '・' : ''}{ec.description || ''}</small>
      </td>
      <td className="text-center">
        <small className="text-muted">{expandedId === ec.id ? '▲ 收起' : '▼ 展開分析'}</small>
      </td>
    </tr>
    <tr style={{ display: expandedId === ec.id ? '' : 'none' }}>
      <td colSpan={colSpan || 5} style={{ padding: 0, borderTop: 'none' }}>
        <Collapse in={expandedId === ec.id}>
          <div>
            {expandedId === ec.id && (
              <SummaryDetail
                earningsCallId={ec.id}
                processingStatus={ec.summary?.processing_status}
                isAdmin={isAdmin}
                meetingDate={ec.meeting_date}
                onSummaryUpdated={onSummaryUpdated}
              />
            )}
          </div>
        </Collapse>
      </td>
    </tr>
  </React.Fragment>
)

EarningsCallRow.propTypes = {
  ec: PropTypes.shape({
    id: PropTypes.number,
    meeting_date: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    summary: PropTypes.shape({
      processing_status: PropTypes.string,
      sentiment: PropTypes.string,
      score: PropTypes.number
    })
  }).isRequired,
  expandedId: PropTypes.number,
  onToggle: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  onSummaryUpdated: PropTypes.func,
  colSpan: PropTypes.number
}
