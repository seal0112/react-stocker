import React, { useState, useEffect } from 'react'
import { Container, Table, Spinner, Form, Row, Col, Button } from 'react-bootstrap'
import * as StockerAPI from 'utils/StockerAPI'
import dayjs from 'dayjs'

const EarningsCallList = () => {
  const [earningsCalls, setEarningsCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [stock, setStock] = useState('')
  const [meetingDate, setMeetingDate] = useState('')

  const fetchEarningsCalls = (params = {}) => {
    setLoading(true)
    StockerAPI.getEarningsCallList(params)
      .then((data) => {
        setEarningsCalls(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setEarningsCalls([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEarningsCalls()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (stock) params.stock = stock
    if (meetingDate) params.meeting_date = meetingDate
    fetchEarningsCalls(params)
  }

  const handleReset = () => {
    setStock('')
    setMeetingDate('')
    fetchEarningsCalls()
  }

  return (
    <main>
      <Container>
        <h4 style={{ marginBottom: '1rem' }}>法說會列表</h4>
        <Form style={{ marginBottom: '1rem' }} onSubmit={handleSearch}>
          <Row className="mb-3">
            <Col sm={4}>
              <Form.Group controlId="stock">
                <Form.Label>股票代碼</Form.Label>
                <Form.Control
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="例如: 2330"
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="meetingDate">
                <Form.Label>會議日期</Form.Label>
                <Form.Control
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="d-flex align-items-end">
              <Button variant="primary" type="submit" className="me-2">
                搜尋
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>

        {loading
          ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spinner animation="border" variant="success" />
              </div>
            )
          : earningsCalls.length === 0
            ? (
                <p>目前沒有法說會資料</p>
              )
            : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>股票代碼</th>
                      <th>會議日期</th>
                      <th>會議時間</th>
                      <th>地點</th>
                      <th>說明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsCalls.map((call) => (
                      <tr key={call.id}>
                        <td>{call.stock_id}</td>
                        <td>{call.meeting_date ? dayjs(call.meeting_date).format('YYYY-MM-DD') : '-'}</td>
                        <td>{call.meeting_time || '-'}</td>
                        <td>{call.location || '-'}</td>
                        <td>{call.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
      </Container>
    </main>
  )
}

export default EarningsCallList
