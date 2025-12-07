import React, { useState, useEffect } from 'react'
import '../../assets/css/StockerLayout.css'
import dayjs from 'dayjs'
import { Container, Spinner, Form, Row, Col } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'

import NewsCard from '../../components/NewsCard'
import DateRangePicker from '../../components/DateRangePicker'
import * as StockerAPI from '../../utils/StockerAPI'

const MarketNews = () => {
  const pageSize = 20
  const [feeds, setFeeds] = useState([])
  const [getFeeds, setGetFeeds] = useState(true)
  const [nextPage, setNextPage] = useState(1)
  const [hasMoreFeed, setHasMoreFeed] = useState(true)

  const [targetDate, setTargetDate] = useState(
    dayjs().format('YYYY-MM-DD'))
  const [feedSource, setFeedSource] = useState([])

  const feedSourceOption = [{
    value: 'mops',
    text: '公開資訊觀測站'
  }, {
    value: 'cnyes',
    text: '鉅亨網'
  }, {
    value: 'ctee',
    text: '工商時報'
  }, {
    value: 'money',
    text: '經濟日報'
  }, {
    value: 'yahoo',
    text: 'Yahoo'
  }]

  const getFeedData = () => {
    StockerAPI.getMarketFeed(targetDate, feedSource, nextPage, pageSize).then(result => {
      setGetFeeds(true)
      setFeeds(feeds.concat(result.feeds))
      setNextPage(result.next_page)
      setHasMoreFeed(result.has_next)
    })
  }

  const updateFeedSource = (event) => {
    setFeedSource(preFeedSource => {
      const source = event.target.value
      const checked = event.target.checked
      let newFeedSource = []
      if (checked) {
        newFeedSource = [...preFeedSource, source]
      } else {
        newFeedSource = preFeedSource.filter(item => item !== source)
      }
      localStorage.setItem('feedSource', newFeedSource.join(','))
      return newFeedSource
    })
  }

  useEffect(() => {
    setFeeds([])
    setNextPage(1)
    setHasMoreFeed(true)
    setGetFeeds(false)
  }, [targetDate, feedSource])

  useEffect(() => {
    if (!getFeeds) {
      getFeedData()
    }
  }, [getFeeds])

  useEffect(() => {
    let storageFeedSource = localStorage.getItem('feedSource')
    if (!storageFeedSource) {
      storageFeedSource = feedSourceOption.map(option => option.value)
      localStorage.setItem('feedSource', storageFeedSource)
    }
    setFeedSource(storageFeedSource.split(',') || [])
  }, [])

  return (
    <main>
      <Container>
        <Form>
          <DateRangePicker
            targetDate={targetDate}
            setTargetDate={setTargetDate}
          />
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              資料來源
            </Form.Label>
            <Col>
              {
                feedSourceOption.map(source => (
                  <Form.Check
                    inline
                    type="checkbox"
                    key={source.value}
                    name="feed-source"
                    id={`feed-source-${source.value}`}
                    value={source.value}
                    label={source.text}
                    onChange={updateFeedSource}
                    checked={feedSource.includes(source.value)}
                  />
                ))
              }
            </Col>
          </Form.Group>
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
