import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

const SelectOption = (props) => {
  const handleChangeOption = (event) => {
    props.setOptionValue(event.target.value)
  }

  return (
    <>
      <Form.Group
          as={Row}
          className="mb-3"
          controlId="exampleForm.ControlInput1">
        <Form.Label column sm="2">{props.label}:</Form.Label>
        <Col sm="10">
          <Form.Select
              name={props.name}
              value={props.value}
              onChange={handleChangeOption}>
            {
              props.optionSource.map(option => (
                <option key={option.value} value={option.value}>{option.text}</option>)
              )
            }
          </Form.Select>
        </Col>
      </Form.Group>
    </>
  )
}

SelectOption.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  optionSource: PropTypes.array,
  setOptionValue: PropTypes.func
}

export default SelectOption
