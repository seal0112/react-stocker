import React, { useState, useEffect } from 'react'
import 'assets/css/StockerLayout.css'
import * as StockerAPI from 'utils/StockerAPI'
import { Container, Form, Col, Row, Button, Alert } from 'react-bootstrap'
import dayjs from 'dayjs'

const getCurrentSeason = () => {
  const season = Math.ceil((dayjs().month() + 1) / 3) - 1
  return season === 0 ? 4 : season
}

const AnnouncementDismantlingList = () => {
  const [link, setLink] = useState('')
  const [year, setYear] = useState(dayjs().year())
  const [season, setSeason] = useState(1)
  const [announceData, setAnnounceData] = useState()
  const [alertShow, setAlertShow] = useState(false)

  const handleLinkChange = (e) => {
    setLink(e.target.value)
  }

  const handleYear = (e) => {
    setYear(e.target.value)
  }

  const handleSeason = (e) => {
    setSeason(e.target.value)
  }

  const clickSubmitBtn = (e) => {
    e.preventDefault()
    StockerAPI.getAnnouncementDismantling({
      link,
      year,
      season
    }).then(data => {
      setAnnounceData(data)
      setLink('')
    }).catch(err => {
      setAnnounceData(null)
      console.log(err)
      setAlertShow(true)
    })
  }

  useEffect(() => {
    const currentSeason = getCurrentSeason()
    if (currentSeason === 4) {
      setYear(year - 1)
    }
    setSeason(currentSeason)
  }, [])

  return (
    <main>
      <Container>
        <Form style={{ marginBottom: '1rem' }}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3">
              公告連結
            </Form.Label>
            <Col sm="9">
              <Form.Control
                  type="text"
                  value={link}
                  name="link"
                  onChange={handleLinkChange} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3">
              年份
            </Form.Label>
            <Col sm="9">
              <Form.Control
                  type="number"
                  value={year}
                  name="year"
                  onChange={handleYear} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3">
              季度
            </Form.Label>
            <Col sm="9">
              <Form.Select
                  value={season}
                  name="season"
                  onChange={handleSeason}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={clickSubmitBtn}>
            Submit
          </Button>
        </Form>
        {
          alertShow &&
          <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
            <Alert.Heading>格式頗析錯誤</Alert.Heading>
            <p>
              請自行運算，或聯絡開發者幫忙
            </p>
          </Alert>
        }
        {
          announceData &&
          <>
            <h4>股票號碼: {announceData.stock_id}</h4>
            <hr />
            <Row>
              <Col sm={3}>本期EPS</Col>
              <Col sm={9}>{announceData['基本每股盈餘']}</Col>
            </Row>
            <hr />
            <Row>
              <Col sm={3}>毛利率</Col>
              <Col sm={9}>{announceData['營業毛利率']}</Col>
            </Row>
            <Row>
              <Col sm={3}>營業利益率</Col>
              <Col sm={9}>{announceData['營業利益率']}</Col>
            </Row>
            <Row>
              <Col sm={3}>稅前淨利率</Col>
              <Col sm={9}>{announceData['稅前淨利率']}</Col>
            </Row>
            <Row>
              <Col sm={3}>稅後淨利率</Col>
              <Col sm={9}>{announceData['本期淨利率']}</Col>
            </Row>
            <hr />
            <Row>
              <Col sm={3}>營收</Col>
              <Col sm={9}>{announceData['營業收入合計']}</Col>
            </Row>
            <Row>
              <Col sm={3}>毛利</Col>
              <Col sm={9}>{announceData['營業毛利']}</Col>
            </Row>
            <Row>
              <Col sm={3}>營業利益</Col>
              <Col sm={9}>{announceData['營業利益']}</Col>
            </Row>
            <Row>
              <Col sm={3}>稅前淨利</Col>
              <Col sm={9}>{announceData['稅前淨利']}</Col>
            </Row>
            <Row>
              <Col sm={3}>稅後淨利</Col>
              <Col sm={9}>{announceData['本期淨利']}</Col>
            </Row>
          </>
        }

      </Container>
    </main>
  )
}

export default AnnouncementDismantlingList
