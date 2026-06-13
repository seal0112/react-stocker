import React, { useState, useEffect, useCallback } from 'react'
import { Spinner, Table } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useStock } from 'hooks/StockContext'
import { useAuth } from 'hooks/AuthContext'
import * as StockerAPI from 'utils/StockerAPI'
import { EarningsCallRow } from 'components/EarningsCallShared'

const PAGE_SIZE = 15

const StockEarningsCall = () => {
  const { stockNum } = useStock()
  const { hasRole } = useAuth()
  const isAdmin = hasRole('admin')

  const [earningsCalls, setEarningsCalls] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const handleSummaryUpdated = useCallback((earningsCallId, summary) => {
    setEarningsCalls(prev => prev.map(ec =>
      ec.id === earningsCallId ? { ...ec, summary } : ec
    ))
  }, [])

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
    setExpandedId(null)
    loadMore(1, true)
  }, [stockNum, loadMore])

  const toggleRow = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

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
      <Table bordered hover responsive style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '14%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '38%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>日期</th>
            <th>AI 評分</th>
            <th>AI 狀態</th>
            <th>地點 / 說明</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {earningsCalls.map(ec => (
            <EarningsCallRow
              key={ec.id}
              ec={ec}
              expandedId={expandedId}
              onToggle={toggleRow}
              isAdmin={isAdmin}
              onSummaryUpdated={handleSummaryUpdated}
              colSpan={5}
            />
          ))}
        </tbody>
      </Table>
    </InfiniteScroll>
  )
}

export default StockEarningsCall
