import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../assets/css/CustomizedTable.css'
import { Table, Spinner } from 'react-bootstrap'

const VerticalDataTable = (props) => {
  const [tableHeader, setTableHeader] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    setTableHeader(props.data[0])
    setTableData(props.data.filter((d, index) => index !== 0).reverse())
  }, [props.data])

  return (
    <>
     {
      tableData?.length === 0
        ? (<div className="Customized-table">
            <div className="table-scroller">
              <Spinner
                animation="border"
                variant="success"
                style={{ position: 'relative', left: '50%' }}/>
            </div>
          </div>)
        : (<div className="Customized-table">
          <Table
            striped
            bordered
            hover
            responsive="md"
            style={{ maxHeight: '500px', overflowX: 'scroll', overflowY: 'scrloll' }}
          >
            <thead>
              <tr key="time">
                {tableHeader?.map((header, index) =>
                  (<th className={index === 0 ? 'head-col' : ''} key={`header-${index}`}>{header}</th>)
                )}
              </tr>
            </thead>
            <tbody>
              {
                tableData?.map((rowData, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {
                      rowData.map((data, colIndex) => (
                        <td key={`data-${rowIndex}-${colIndex}`}>{
                          typeof (data) === 'number' ? data.toLocaleString() : data
                        }</td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>)
      }
    </>
  )
}

VerticalDataTable.propTypes = {
  data: PropTypes.array.isRequired
}

export default VerticalDataTable
