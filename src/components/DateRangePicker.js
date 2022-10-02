import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'
import dayjs from 'dayjs'

const DateRangePicker = (props) => {
  const handleTargetDate = (event) => {
    props.setTargetDate(
      dayjs(event.target.value).format('YYYY-MM-DD'))
  }

  return (
    <>
      <Form>
        <Form.Group
            as={Row}
            className="mb-3"
            controlId="exampleForm.ControlInput1">
          <Form.Label column sm="2">日期:</Form.Label>
          <Col sm="10">
            <Form.Control
                type="date"
                value={props.targetDate}
                onInput={handleTargetDate} />
          </Col>
        </Form.Group>
      </Form>
    </>
  )
}

DateRangePicker.propTypes = {
  targetDate: PropTypes.string,
  setTargetDate: PropTypes.func
}

export default DateRangePicker
