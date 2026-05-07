import React, { useState, useEffect } from 'react'
import { Spinner, Form, Row, Col } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'

import NewsCard from 'components/NewsCard'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'

const PAGE_SIZE = 20

const StockFeed = () => {
  const { stockNum } = useStock()
  const [feeds, setFeeds] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')

  const reset = (date) => {
    setFeeds([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    StockerAPI.getStockFeed(stockNum, 1, PAGE_SIZE, date || null)
      .then(result => {
        setFeeds(result.feeds)
        setPage(2)
        setHasMore(result.has_next)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reset(startDate)
  }, [stockNum])

  const fetchMore = () => {
    if (loading) return
    setLoading(true)
    StockerAPI.getStockFeed(stockNum, page, PAGE_SIZE, startDate || null)
      .then(result => {
        setFeeds(prev => [...prev, ...result.feeds])
        setPage(prev => prev + 1)
        setHasMore(result.has_next)
      })
      .finally(() => setLoading(false))
  }

  const handleDateChange = (e) => {
    const val = e.target.value
    setStartDate(val)
    reset(val)
  }

  return (
    <main>
      <Row className="px-3 pt-3 pb-2 align-items-center">
        <Col xs="auto">
          <Form.Label className="mb-0">從</Form.Label>
        </Col>
        <Col xs="auto">
          <Form.Control
            type="date"
            value={startDate}
            max={dayjs().format('YYYY-MM-DD')}
            onChange={handleDateChange}
            style={{ width: '160px' }}
          />
        </Col>
        <Col xs="auto" className="text-muted">
          {startDate ? `${startDate} 起` : '全部'}
        </Col>
      </Row>
      <ul className="news-list">
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Spinner animation="border" role="status" />
            </div>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>已無更多消息</b>
            </p>
          }
        >
          {feeds.map(feed => (
            <NewsCard
              key={feed.id}
              newsId={feed.id}
              source={feed.source}
              title={feed.title}
              releaseTime={feed.releaseTime}
              link={feed.link}
            />
          ))}
        </InfiniteScroll>
      </ul>
    </main>
  )
}

export default StockFeed
