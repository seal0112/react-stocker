import React, { useState, useEffect } from 'react'
import '../assets/css/StockerLayout.css'
import dayjs from 'dayjs'
import NewsCard from '../components/NewsCard'
import DateRangePicker from '../components/DateRangePicker'
import SelectOption from '../components/SelectOption'
import * as StockerAPI from '../utils/StockerAPI'
import { Container, Spinner, Form } from 'react-bootstrap'

const MarketNews = () => {
  const [marketNews, setMarketNews] = useState()
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

  useEffect(() => {
    setMarketNews(null)
    StockerAPI.getMarketFeed(targetDate, feedType).then(data => {
      setMarketNews(data)
    })
  }, [targetDate, feedType])

  return (
    <main>
      <Container>
        <Form>
          <DateRangePicker
              targetDate={targetDate}
              setTargetDate={setTargetDate} />
          <SelectOption
              label={'資料種類'}
              name={feedType}
              value={feedType}
              optionSource={feedTypeSource}
              setOptionValue={setFeedType}/>
        </Form>
      </Container>
      <ul className="news-list">
        {
          marketNews
            ? marketNews.map(news =>
              <NewsCard
                  key={news.id}
                  newsId={news.id}
                  source={news.source}
                  title={news.title}
                  releaseTime={news.releaseTime}
                  link={news.link} />)
            : <div style={{ textAlign: 'center' }}>
                <Spinner animation="border" role="status" />
              </div>
        }
      </ul>
    </main>
  )
}

export default MarketNews
