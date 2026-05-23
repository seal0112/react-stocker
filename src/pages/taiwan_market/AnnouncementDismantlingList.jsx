import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import 'assets/css/StockerLayout.css'
import * as StockerAPI from 'utils/StockerAPI'
import { Container, Form, Col, Row, Table, Badge, Spinner, Button, Alert } from 'react-bootstrap'
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
  const [triggering, setTriggering] = useState(false)
  const [polling, setPolling] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState(null)
  const pollRef = useRef(null)
  const pollStartRef = useRef(null)

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    setPolling(false)
  }

  const fetchList = (targetDate) => {
    setLoading(true)
    return StockerAPI.getAnnouncementDismantlingList(targetDate)
      .then(data => { setList(data); return data })
      .catch(() => { setList([]); return [] })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchList(date)
    return () => stopPolling()
  }, [])

  const startPolling = (targetDate) => {
    setPolling(true)
    pollStartRef.current = Date.now()
    pollRef.current = setInterval(() => {
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
        stopPolling()
        setTriggerMsg({ variant: 'warning', text: '等待逾時，請手動重新整理' })
        return
      }
      StockerAPI.getAnnouncementDismantlingList(targetDate)
        .then(data => {
          if (data.length > 0) {
            setList(data)
            stopPolling()
            setTriggerMsg(null)
          }
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    stopPolling()
    setDate(newDate)
    setTriggerMsg(null)
    fetchList(newDate)
  }

  const handleTrigger = () => {
    setTriggering(true)
    setTriggerMsg(null)
    StockerAPI.triggerAnnouncementParsing(date)
      .then(res => {
        if (res.triggered === 0) {
          setTriggerMsg({ variant: 'warning', text: `當日無可解析的公告 feed（${date}）` })
        } else {
          setTriggerMsg({ variant: 'info', text: `已觸發 ${res.triggered} 筆，等待解析結果...` })
          startPolling(date)
        }
      })
      .catch(() => setTriggerMsg({ variant: 'danger', text: '觸發失敗，請稍後再試' }))
      .finally(() => setTriggering(false))
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
              : polling
                ? <><Spinner animation="border" size="sm" className="me-1" />等待解析...</>
                : `共 ${list.length} 筆`}
          </Col>
        </Row>

        {!loading && list.length === 0 && (
          <div className="text-center py-4">
            <div className="text-muted mb-3">當日無公告財報資料</div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleTrigger}
              disabled={triggering}
            >
              {triggering
                ? <><Spinner animation="border" size="sm" className="me-1" />觸發中...</>
                : '觸發重新解析'}
            </Button>
            {triggerMsg && (
              <Alert variant={triggerMsg.variant} className="mt-3 mb-0 py-2 px-3 d-inline-block" style={{ fontSize: '0.875rem' }}>
                {triggerMsg.text}
              </Alert>
            )}
          </div>
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
                  <td><strong>{item.stock_id}</strong></td>
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
