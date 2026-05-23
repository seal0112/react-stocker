import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import 'assets/css/StockerLayout.css'
import * as StockerAPI from 'utils/StockerAPI'
import { Container, Form, Col, Row, Table, Badge, Spinner, Button } from 'react-bootstrap'
import dayjs from 'dayjs'

const YoY = ({ value }) => {
  if (value == null) return <span className="text-muted">-</span>
  const num = parseFloat(value)
  const color = num > 0 ? 'success' : num < 0 ? 'danger' : 'secondary'
  const prefix = num > 0 ? '+' : ''
  return <Badge bg={color}>{prefix}{num.toFixed(2)}%</Badge>
}

YoY.propTypes = { value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }

const Pct = ({ value }) => {
  if (value == null) return <span className="text-muted">-</span>
  return <span>{parseFloat(value).toFixed(2)}%</span>
}

Pct.propTypes = { value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }

const POLL_INTERVAL_MS = 5000
const POLL_TIMEOUT_MS = 120000

const AnnouncementDismantlingList = () => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [rawFeeds, setRawFeeds] = useState([])
  const [triggeringId, setTriggeringId] = useState(null)
  const [pollingId, setPollingId] = useState(null)
  const pollRef = useRef(null)
  const pollStartRef = useRef(null)

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    setPollingId(null)
  }

  const fetchList = (targetDate) => {
    setLoading(true)
    return StockerAPI.getAnnouncementDismantlingList(targetDate)
      .then(data => { setList(data); return data })
      .catch(() => { setList([]); return [] })
      .finally(() => setLoading(false))
  }

  const fetchRawFeeds = (targetDate) => {
    StockerAPI.getAnnouncementFeeds(targetDate)
      .then(data => {
        const announcements = (data || []).filter(f => f.feedType === 'announcement')
        setRawFeeds(announcements)
      })
      .catch(() => setRawFeeds([]))
  }

  useEffect(() => {
    fetchList(date)
    return () => stopPolling()
  }, [])

  const startPolling = (targetDate, feedId) => {
    setPollingId(feedId)
    pollStartRef.current = Date.now()
    pollRef.current = setInterval(() => {
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
        stopPolling()
        return
      }
      StockerAPI.getAnnouncementDismantlingList(targetDate)
        .then(data => {
          if (data.length > 0) {
            setList(data)
            setRawFeeds([])
            stopPolling()
          }
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    stopPolling()
    setDate(newDate)
    setRawFeeds([])
    fetchList(newDate).then(data => {
      if (data.length === 0) fetchRawFeeds(newDate)
    })
  }

  useEffect(() => {
    if (!loading && list.length === 0) fetchRawFeeds(date)
  }, [loading])

  const handleTrigger = (feedId) => {
    setTriggeringId(feedId)
    StockerAPI.triggerAnnouncementParsing(feedId)
      .then(() => startPolling(date, feedId))
      .catch(() => {})
      .finally(() => setTriggeringId(null))
  }

  return (
    <main>
      <Container>
        <Row className="mb-3 mt-3 align-items-center">
          <Col xs="auto">
            <Form.Control
              type="date"
              value={date}
              onChange={handleDateChange}
            />
          </Col>
          <Col xs="auto" className="text-muted">
            {loading
              ? <Spinner animation="border" size="sm" />
              : `共 ${list.length} 筆`}
          </Col>
        </Row>

        {!loading && list.length === 0 && rawFeeds.length === 0 && (
          <div className="text-muted text-center py-4">當日無公告財報資料</div>
        )}

        {!loading && list.length === 0 && rawFeeds.length > 0 && (
          <Table bordered hover responsive size="sm">
            <thead className="table-secondary">
              <tr>
                <th>股票</th>
                <th>公告標題</th>
                <th>時間</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rawFeeds.map(feed => {
                const isPolling = pollingId === feed.id
                const isTriggering = triggeringId === feed.id
                return (
                  <tr key={feed.id}>
                    <td>
                      <strong>{feed.stock_id}</strong>
                      {feed.company_name && <div className="text-muted" style={{ fontSize: '0.8rem' }}>{feed.company_name}</div>}
                    </td>
                    <td>
                      {feed.link
                        ? <a href={feed.link} target="_blank" rel="noreferrer">{feed.title}</a>
                        : feed.title}
                    </td>
                    <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                      {dayjs(feed.releaseTime).format('HH:mm')}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={isPolling ? 'outline-secondary' : 'outline-primary'}
                        onClick={() => handleTrigger(feed.id)}
                        disabled={isTriggering || isPolling}
                      >
                        {isTriggering
                          ? <><Spinner animation="border" size="sm" className="me-1" />觸發中</>
                          : isPolling
                            ? <><Spinner animation="border" size="sm" className="me-1" />等待中</>
                            : '觸發解析'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}

        {list.length > 0 && (
          <Table bordered hover responsive size="sm">
            <thead className="table-dark">
              <tr>
                <th>股票</th>
                <th>公告</th>
                <th>年/季</th>
                <th>EPS</th>
                <th>YoY</th>
                <th>毛利率</th>
                <th>YoY</th>
                <th>營業利益率</th>
                <th>YoY</th>
                <th>稅後淨利率</th>
                <th>YoY</th>
                <th>本業佔比</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.feed_id}>
                  <td>
                    <strong>{item.stock_id}</strong>
                    {item.company_name && <div className="text-muted" style={{ fontSize: '0.8rem' }}>{item.company_name}</div>}
                  </td>
                  <td>
                    {item.feed?.link
                      ? <a href={item.feed.link} target="_blank" rel="noreferrer">{item.feed.title}</a>
                      : item.feed?.title ?? '-'
                    }
                  </td>
                  <td>{item.year} Q{item.season}</td>
                  <td>{item['基本每股盈餘'] ?? '-'}</td>
                  <td><YoY value={item['基本每股盈餘年增率']} /></td>
                  <td><Pct value={item['營業毛利率']} /></td>
                  <td><YoY value={item['營業毛利率年增率']} /></td>
                  <td><Pct value={item['營業利益率']} /></td>
                  <td><YoY value={item['營業利益率年增率']} /></td>
                  <td><Pct value={item['本期淨利率']} /></td>
                  <td><YoY value={item['本期淨利率年增率']} /></td>
                  <td><Pct value={item['本業佔比']} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </main>
  )
}

export default AnnouncementDismantlingList
