import React, { useState, useEffect } from 'react'
import '../assets/css/StockerLayout.css'
import dayjs from 'dayjs'
import { Container, Spinner, Form } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'

import NewsCard from '../components/NewsCard'
import DateRangePicker from '../components/DateRangePicker'
import SelectOption from '../components/SelectOption'
import * as StockerAPI from '../utils/StockerAPI'

const MarketNews = () => {
  const pageSize = 20
  const [feeds, setFeeds] = useState([])
  const [getFeeds, setGetFeeds] = useState(true)
  const [nextPage, setNextPage] = useState(1)
  const [hasMoreFeed, setHasMoreFeed] = useState(true)

  const [targetDate, setTargetDate] = useState(
    dayjs().format('YYYY-MM-DD'))
  const [feedType, setFeedType] = useState('all')

  const feedTypeSource = [{
    value: 'all',
    text: '公告及新聞'
  }, {
    value: 'announcement',
    text: '公告'
  }, {
    value: 'news',
    text: '新聞'
  }]

  const getFeedData = () => {
    StockerAPI.getMarketFeed(targetDate, feedType, nextPage, pageSize).then(result => {
      setGetFeeds(true)
      setFeeds(feeds.concat(result.feeds))
      setNextPage(result.next_page)
      setHasMoreFeed(result.has_next)
    })
  }

  useEffect(() => {
    setFeeds([])
    setNextPage(1)
    setHasMoreFeed(true)
    setGetFeeds(false)
  }, [targetDate, feedType])

  useEffect(() => {
    if (!getFeeds) {
      getFeedData()
    }
  }, [getFeeds])

  return (
    <main>
      <Container>
        <Form>
          <DateRangePicker
            targetDate={targetDate}
            setTargetDate={setTargetDate}
          />
          <SelectOption
            label={'資料種類'}
            name={feedType}
            value={feedType}
            optionSource={feedTypeSource}
            setOptionValue={setFeedType}
          />
        </Form>
      </Container>
      <ul className="news-list">
        <InfiniteScroll
          dataLength={pageSize * nextPage}
          next={getFeedData}
          hasMore={hasMoreFeed}
          loader={
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Spinner animation="border" role="status" />
            </div>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>已無最新消息</b>
            </p>
          }
        >
          {
            feeds.map(news =>
              <NewsCard
                  key={news.id}
                  newsId={news.id}
                  source={news.source}
                  title={news.title}
                  releaseTime={news.releaseTime}
                  link={news.link}
              />)
          }
        </InfiniteScroll>
      </ul>
    </main>
  )
}

export default MarketNews
