import React, { useState, useEffect, useRef } from 'react'
import { Spinner, Form, Row, Col } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'

import NewsCard from 'components/NewsCard'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'

const PAGE_SIZE = 20

const FEED_SOURCE_OPTIONS = [
  { value: 'mops', text: '公開資訊觀測站' },
  { value: 'cnyes', text: '鉅亨網' },
  { value: 'ctee', text: '工商時報' },
  { value: 'money', text: '經濟日報' },
  { value: 'yahoo', text: 'Yahoo' },
  { value: 'trendforce', text: '集邦' }
]

const getInitialSources = () => {
  const stored = localStorage.getItem('stockFeedSource')
  if (stored) return stored.split(',')
  const all = FEED_SOURCE_OPTIONS.map(o => o.value)
  localStorage.setItem('stockFeedSource', all.join(','))
  return all
}

const StockFeed = () => {
  const { stockNum } = useStock()
  const [feeds, setFeeds] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [feedSource, setFeedSource] = useState(getInitialSources)
  const debounceTimer = useRef(null)

  const reset = (date, sources) => {
    setFeeds([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    StockerAPI.getStockFeed(stockNum, 1, PAGE_SIZE, date || null, sources)
      .then(result => {
        setFeeds(result.feeds)
        setPage(2)
        setHasMore(result.has_next)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reset(startDate, feedSource)
  }, [stockNum])

  const fetchMore = () => {
    if (loading) return
    setLoading(true)
    StockerAPI.getStockFeed(stockNum, page, PAGE_SIZE, startDate || null, feedSource)
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
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => reset(val, feedSource), 300)
  }

  const updateFeedSource = (event) => {
    const source = event.target.value
    const checked = event.target.checked
    setFeedSource(prev => {
      const newSources = checked
        ? [...prev, source]
        : prev.filter(item => item !== source)
      localStorage.setItem('stockFeedSource', newSources.join(','))
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => reset(startDate, newSources), 300)
      return newSources
    })
  }

  return (
    <main>
      <Row className="px-3 pt-3 pb-2 align-items-center">
        <Col xs="auto">
          <Form.Label className="mb-0">截至</Form.Label>
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
          {startDate ? `${startDate} 以前` : '全部'}
        </Col>
      </Row>
      <Row className="px-3 pb-2 align-items-center">
        <Col xs="auto">
          <Form.Label className="mb-0">資料來源</Form.Label>
        </Col>
        <Col>
          {FEED_SOURCE_OPTIONS.map(source => (
            <Form.Check
              inline
              type="checkbox"
              key={source.value}
              name="stock-feed-source"
              id={`stock-feed-source-${source.value}`}
              value={source.value}
              label={source.text}
              onChange={updateFeedSource}
              checked={feedSource.includes(source.value)}
            />
          ))}
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
