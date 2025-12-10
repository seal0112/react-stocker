import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import 'assets/css/CustomizedTable.css'
import { Table, Spinner } from 'react-bootstrap'

const CustomizedTable = ({ data }) => {
  const tableScroller = useRef(null)

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const controlScrollToEnd = () => {
    if (tableScroller.current) {
      tableScroller.current.scrollLeft = tableScroller.current.scrollWidth
    }
  }

  useEffect(() => {
    controlScrollToEnd()
  }, [data])

  if (data.length === 0) {
    return (
      <div className="Customized-table">
        <div className="table-scroller" ref={tableScroller}>
          <Spinner
            animation="border"
            variant="success"
            style={{ position: 'relative', left: '50%' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="Customized-table">
      <div className="table-scroller" ref={tableScroller}>
        <Table striped bordered hover responsive="md">
          <thead>
            <tr key="time">
              {data.map((d, index) => (
                <th className={index === 0 ? 'head-col' : ''} key={`time-${d[0]}`}>
                  {d[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[0].map((d, index) => {
              if (index !== 0) {
                return (
                  <tr key={`${d}`}>
                    {data.map((rowData, rowIdx) => {
                      if (rowIdx === 0) {
                        return (
                          <th className="head-col" key={`${d}-${rowData[0]}`}>
                            {rowData[index]}
                          </th>
                        )
                      } else {
                        return (
                          <td key={`${d}-${rowData[0]}`}>
                            {typeof rowData[index] === 'number'
                              ? numberWithCommas(rowData[index])
                              : rowData[index]}
                          </td>
                        )
                      }
                    })}
                  </tr>
                )
              } else {
                return null
              }
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

CustomizedTable.propTypes = {
  data: PropTypes.array.isRequired
}

export default CustomizedTable
