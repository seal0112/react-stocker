import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'

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

  const fetchFeeds = (currentPage, currentFeeds) => {
    if (loading) return
    setLoading(true)
    StockerAPI.getStockFeed(stockNum, currentPage, PAGE_SIZE)
      .then(result => {
        setFeeds([...currentFeeds, ...result.feeds])
        setPage(currentPage + 1)
        setHasMore(result.has_next)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setFeeds([])
    setPage(1)
    setHasMore(true)
    StockerAPI.getStockFeed(stockNum, 1, PAGE_SIZE)
      .then(result => {
        setFeeds(result.feeds)
        setPage(2)
        setHasMore(result.has_next)
      })
  }, [stockNum])

  return (
    <main>
      <ul className="news-list">
        <InfiniteScroll
          dataLength={feeds.length}
          next={() => fetchFeeds(page, feeds)}
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
