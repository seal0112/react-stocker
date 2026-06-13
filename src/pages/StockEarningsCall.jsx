import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Spinner, Badge, Collapse } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'

import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'

const PAGE_SIZE = 15

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
  if (sentiment == null) return <span className="text-muted small">—</span>
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

const earningsCallShape = PropTypes.shape({
  id: PropTypes.number,
  meeting_date: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  summary: PropTypes.shape({
    processing_status: PropTypes.string,
    sentiment: PropTypes.string,
    score: PropTypes.number
  })
})

const EarningsCallCard = ({ ec }) => {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)

  const handleToggle = () => {
    if (!open && summary === null) {
      setLoadingSummary(true)
      StockerAPI.getEarningsCallSummary(ec.id)
        .then(data => setSummary(data))
        .catch(() => setSummary(false))
        .finally(() => setLoadingSummary(false))
    }
    setOpen(v => !v)
  }

  const statusCfg = STATUS_CONFIG[ec.summary?.processing_status] || null

  return (
    <div
      style={{
        borderBottom: '1px solid #e9ecef',
        padding: '12px 0',
        cursor: 'pointer'
      }}
    >
      <div
        className="d-flex justify-content-between align-items-start"
        onClick={handleToggle}
      >
        <div>
          <span className="fw-bold me-2" style={{ fontSize: '0.95rem' }}>
            {ec.meeting_date ? dayjs(ec.meeting_date).format('YYYY-MM-DD') : '—'}
          </span>
          {ec.location && (
            <small className="text-muted me-2">{ec.location}</small>
          )}
          {ec.description && (
            <small className="text-muted">{ec.description}</small>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <SentimentBadge sentiment={ec.summary?.sentiment} score={ec.summary?.score} />
          {statusCfg && <Badge bg={statusCfg.bg}>{statusCfg.label}</Badge>}
          <small className="text-muted">{open ? '▲' : '▼'}</small>
        </div>
      </div>

      <Collapse in={open}>
        <div style={{ paddingTop: 10 }}>
          {loadingSummary && <Spinner animation="border" size="sm" />}
          {summary === false && <small className="text-danger">載入失敗</small>}
          {summary && summary.processing_status === 'completed' && (
            <div style={{ fontSize: '0.88rem', color: '#444' }}>
              {summary.outlook && (
                <div className="mb-1">
                  <span className="fw-bold me-1">前景展望</span>
                  {summary.outlook}
                </div>
              )}
              {summary.capex && (
                <div className="mb-1">
                  <span className="fw-bold me-1">資本支出</span>
                  {summary.capex}
                  {summary.capex_industry && <span className="text-muted ms-1">（{summary.capex_industry}）</span>}
                </div>
              )}
              {summary.concerns_and_risks && (
                <div className="mb-1">
                  <span className="fw-bold me-1">隱憂與風險</span>
                  {summary.concerns_and_risks}
                </div>
              )}
              {summary.reasoning && (
                <div className="mb-1 text-muted">
                  <span className="fw-bold me-1">評分依據</span>
                  {summary.reasoning}
                </div>
              )}
            </div>
          )}
          {summary && summary.processing_status !== 'completed' && (
            <small className="text-muted">
              {summary.error_message || '尚無分析結果'}
            </small>
          )}
          {summary === null && !loadingSummary && (
            <small className="text-muted">尚無 AI 分析資料</small>
          )}
        </div>
      </Collapse>
    </div>
  )
}
EarningsCallCard.propTypes = {
  ec: earningsCallShape
}

const StockEarningsCall = () => {
  const { stockNum } = useStock()
  const [earningsCalls, setEarningsCalls] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)

  const loadMore = useCallback((nextPage, reset = false) => {
    StockerAPI.getStockEarningsCallList(stockNum, nextPage, PAGE_SIZE)
      .then(data => {
        const items = data.earnings_calls || []
        setEarningsCalls(prev => reset ? items : [...prev, ...items])
        setPage(nextPage + 1)
        setHasMore(data.has_next)
      })
      .finally(() => setInitialLoading(false))
  }, [stockNum])

  useEffect(() => {
    setEarningsCalls([])
    setPage(1)
    setHasMore(true)
    setInitialLoading(true)
    loadMore(1, true)
  }, [stockNum, loadMore])

  if (initialLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (earningsCalls.length === 0) {
    return <p className="text-muted py-3">目前沒有法說會資料</p>
  }

  return (
    <InfiniteScroll
      dataLength={earningsCalls.length}
      next={() => loadMore(page)}
      hasMore={hasMore}
      loader={<div className="text-center py-2"><Spinner animation="border" size="sm" /></div>}
      endMessage={<p className="text-center text-muted py-2" style={{ fontSize: '0.85rem' }}>已顯示全部法說會資料</p>}
    >
      {earningsCalls.map(ec => (
        <EarningsCallCard key={ec.id} ec={ec} />
      ))}
    </InfiniteScroll>
  )
}

export default StockEarningsCall
