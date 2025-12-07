import React, { useState, useEffect } from 'react'
import { useStock } from 'hooks/StockContext'
import dayjs from 'dayjs'
import 'assets/css/follow-stock.css'
import {
  Button, Modal, Form, Row,
  Col, ButtonGroup, ToggleButton
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import * as followStockApi from 'utils/FollowStockAPI'

const longShortBtn = [
  {
    name: '偏多',
    value: 'long',
    variant: 'outline-success',
    checkedVariant: 'success'
  },
  {
    name: '偏空',
    value: 'short',
    variant: 'outline-danger',
    checkedVariant: 'danger'
  }
]

const FollowStock = () => {
  const stock = useStock()
  const defaultFollowStock = {
    stock_id: stock.stockNum,
    long_or_short: '',
    comment: '',
    create_time: null,
    last_update_time: null
  }

  const [modalShow, setModalShow] = useState(false)
  const [followStockExist, setFollowStockExist] = useState(false)
  const [followStock, setFollowStock] = useState(defaultFollowStock)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setFollowStock((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const closeModal = () => setModalShow(false)

  const createFollowStock = () => {
    followStockApi.addFollowStock(followStock).then(data => {
      setFollowStockExist(true)
      setFollowStock(data)
      closeModal()
    })
  }

  const updateFollowStock = () => {
    followStockApi.updateFollowStock(followStock.id, followStock).then(data => {
      setFollowStock(data)
      closeModal()
    })
  }

  const removeFollowStock = () => {
    followStockApi.deleteFollowStock(followStock.id).then(data => {
      setFollowStockExist(false)
      setFollowStock(defaultFollowStock)
      closeModal()
    })
  }

  useEffect(() => {
    followStockApi.getFollowStock(stock.stockNum)
      .then(data => {
        if (data) {
          setFollowStockExist(true)
          setFollowStock(data)
        } else {
          setFollowStockExist(false)
          setFollowStock(defaultFollowStock)
        }
      })
      .catch(() => {
        setFollowStockExist(false)
        setFollowStock(defaultFollowStock)
      })
  }, [stock])

  return (
    <>
      <div id="follow-stock">
        <Button
          variant={
            !followStockExist
              ? 'light'
              : followStock.long_or_short === 'long'
                ? 'success'
                : 'danger'
          }
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon
            className="icon"
            icon={
              !followStockExist
                ? faPlus
                : faLightbulb
            }
            size="lg"
          />
          <span style={{ paddingLeft: '0.25rem' }}>
            {
              !followStockExist
                ? '追蹤'
                : followStock.long_or_short === 'long'
                  ? '偏多'
                  : '偏空'
            }
          </span>
        </Button>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            追蹤股票
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>股票號碼:</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  size="sm"
                  value={followStock.stock_id}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>追蹤時間:</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="date"
                  size="sm"
                  value={dayjs(followStock.create_time).format('YYYY-MM-DD')}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>上次更新:</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="date"
                  size="sm"
                  value={dayjs(followStock.last_update_time).format('YYYY-MM-DD')}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>偏多/偏空:</Form.Label>
              <Col sm={9}>
                <ButtonGroup>
                  {longShortBtn.map((button, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type='radio'
                      variant={
                        followStock.long_or_short === button.value
                          ? button.checkedVariant
                          : button.variant
                      }
                      name='long_or_short'
                      value={button.value}
                      checked={followStock.long_or_short === button.value}
                      onChange={handleChangeForm}
                    >
                      {button.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>備註</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder='新增備註'
                name='comment'
                value={followStock.comment}
                onChange={handleChangeForm}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {
            !followStockExist
              ? <Button variant="primary" onClick={createFollowStock}>新增追蹤</Button>
              : <span>
                  <Button variant="warning" onClick={updateFollowStock}>更新追蹤</Button>
                  <Button variant="danger" onClick={removeFollowStock}>移除追蹤</Button>
                </span>
          }

          <Button variant="secondary" onClick={() => setModalShow(false)}>關閉</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FollowStock
