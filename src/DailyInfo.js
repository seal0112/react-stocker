import React, { useState, useEffect, useContext } from 'react'
import './assets/css/DailyInfo.css'
import { Row, Col, Card } from 'react-bootstrap'
import { StockContext } from './StockContext'
import * as StockerAPI from './utils/StockerAPI'

const DailyInfo = () => {
  const stock = useContext(StockContext)
  const [dailyInfo, setDailyInfo] = useState({
    本日收盤價: 0,
    本日漲跌: 0,
    本益比: 0,
    近四季每股盈餘: 0
  })

  useEffect(() => {
    StockerAPI.getDailyInfo(stock.stockNum)
      .then(res => {
        setDailyInfo(res)
      })
  }, [stock.stockNum])

  let upAndDownCardText
  if (dailyInfo['本日漲跌'] >= 0) {
    upAndDownCardText = (<Card.Text style={{ color: 'red' }}>
      {`+${dailyInfo['本日漲跌']} ` +
      `(${Math.round(dailyInfo['本日漲跌'] / (dailyInfo['本日收盤價'] - dailyInfo['本日漲跌']) * 10000) / 100})%`}
    </Card.Text>)
  } else {
    upAndDownCardText = (<Card.Text style={{ color: 'green' }}>
      {`${dailyInfo['本日漲跌']} ` +
      `(${Math.round(dailyInfo['本日漲跌'] / (dailyInfo['本日收盤價'] - dailyInfo['本日漲跌']) * 10000) / 100}%)`}
    </Card.Text>)
  }

  return (
    <div className="Daily-info">
      <Row>
        <Col md={3} xs={6}>
          <Card id="price">
            <Card.Header>本日收盤價</Card.Header>
            <Card.Body>
              <Card.Text>
                {dailyInfo['本日收盤價']}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card id="upAndDown">
            <Card.Header>本日漲跌</Card.Header>
            <Card.Body>
              {upAndDownCardText}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card id="pe">
            <Card.Header>本益比</Card.Header>
            <Card.Body>
              <Card.Text>
                { dailyInfo['本益比'] ? dailyInfo['本益比'] : '--' }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card id="fourSeasonEPS">
            <Card.Header>近四季每股盈餘</Card.Header>
            <Card.Body>
              <Card.Text>
                { dailyInfo['近四季每股盈餘'] ? dailyInfo['近四季每股盈餘'] : '--'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DailyInfo
