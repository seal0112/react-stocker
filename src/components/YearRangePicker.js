import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

const YEAR_OPTIONS = [3, 5, 7, 10]

const YearRangePicker = ({ value, onChange }) => (
  <div className="d-flex align-items-center gap-2 mb-2">
    <Form.Label className="mb-0 text-nowrap">資料年份</Form.Label>
    <Form.Select
      size="sm"
      style={{ width: 'auto' }}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    >
      {YEAR_OPTIONS.map(y => (
        <option key={y} value={y}>{y} 年</option>
      ))}
    </Form.Select>
  </div>
)

YearRangePicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default YearRangePicker
