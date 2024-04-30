import React, { useState, useEffect } from 'react'
import {
  Form, Col, Row, Button
} from 'react-bootstrap'

import { getPushNotification, updatePushNotification } from '../utils/StockerAPI'

const PushNotification = () => {
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [pushNotification, setPushNotification] = useState({
    notify_enabled: false,
    line_notify_token: '',
    notify_time: '20:00',
    notify_month_revenue: false,
    notify_income_sheet: false,
    notify_news: false,
    notify_announcement: false,
    notify_earnings_call: false
  })

  const changeFormValue = (event) => {
    const { name, value } = event.target
    setPushNotification({
      ...pushNotification,
      [name]: value
    })
  }

  const toggleFormCheckbox = (event) => {
    const { name } = event.target
    setPushNotification({
      ...pushNotification,
      [name]: !pushNotification[name]
    })
  }

  const toggleSubmitBtnDisabled = (disable = true) => {
    setSubmitBtnDisabled(disable)
  }

  const clickPushNotificaationSubmitBtn = (event) => {
    event.preventDefault()
    toggleSubmitBtnDisabled(true)
    updatePushNotification(pushNotification).then(() => {
      alert('更新成功')
      toggleSubmitBtnDisabled(false)
    })
  }

  useEffect(() => {
    getPushNotification().then((pushNotification) => {
      setPushNotification(pushNotification)
    })
  }, [])

  return (
    <div>
      <h4>個股更新通知設定</h4>
      <Form
        onSubmit={clickPushNotificaationSubmitBtn}
      >
        <Form.Group as={Row}>
          <Form.Label column xs={4}>通知功能:</Form.Label>
          <Col xs={8} style={{ paddingTop: '8px' }}>
            <Form.Check
              type="switch"
              id="notify-enabled-switch"
              name="notify_enabled"
              checked={pushNotification.notify_enabled}
              onChange={toggleFormCheckbox}
            />
          </Col>
        </Form.Group>
        <hr />
        {pushNotification.notify_enabled && (
          <>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm={4}>
                LINE Notify Token:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  required
                  type="text"
                  value={pushNotification.line_notify_token}
                  name="line_notify_token"
                  onChange={changeFormValue}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm={4}>
                通知時間:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="time"
                  value={pushNotification.notify_time}
                  name="notify_time"
                  onChange={changeFormValue}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                通知項目:
              </Form.Label>
              <Col sm={8}>
                <Form.Check
                  type="switch"
                  label="月營收通知"
                  name="notify_month_revenue"
                  checked={pushNotification.notify_month_revenue}
                  onChange={toggleFormCheckbox}
                />
                <Form.Check
                  type="switch"
                  label="個股財報通知"
                  name="notify_income_sheet"
                  checked={pushNotification.notify_income_sheet}
                  onChange={toggleFormCheckbox}
                />
                <Form.Check
                  type="switch"
                  id="notify-news-switch"
                  label="個股新聞通知"
                  name="notify_news"
                  checked={pushNotification.notify_news}
                  onChange={toggleFormCheckbox}
                />
                <Form.Check
                  type="switch"
                  id="notify-announcement-switch"
                  label="個股公告通知"
                  name="notify_announcement"
                  checked={pushNotification.notify_announcement}
                  onChange={toggleFormCheckbox}
                />
                <Form.Check
                  type="switch"
                  id="notify-earnings-call-switch"
                  label="個股法說會通知"
                  name="notify_earnings_call"
                  checked={pushNotification.notify_announcement}
                  onChange={toggleFormCheckbox}
                />
              </Col>
            </Form.Group>
          </>
        )}
        <Button
          variant="success"
          type="submit"
          disabled={submitBtnDisabled}
        >
          儲存設定
        </Button>
      </Form>
    </div>
  )
}

export default PushNotification
