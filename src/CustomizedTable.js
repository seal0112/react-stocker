import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './assets/css/CustomizedTable.css'
import { Table, Spinner } from 'react-bootstrap'

class CustomizedTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    // 產生一個可以儲存 textInput DOM element 的 ref
    this.tableScroller = React.createRef()
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  controlScrollToEnd = () => {
    this.tableScroller.current.scrollLeft = this.tableScroller.current.scrollWidth
  }

  componentDidMount = () => {
    this.controlScrollToEnd()
  }

  componentDidUpdate = () => {
    this.controlScrollToEnd()
  }

  render () {
    const data = this.props.data
    return data.length === 0
      ? (<div className="Customized-table">
          <div className="table-scroller" ref={this.tableScroller}>
            <Spinner
              animation="border"
              variant="success"
              style={{ position: 'relative', left: '50%' }}/>
          </div>
        </div>)
      : (<div className="Customized-table">
        <div className="table-scroller" ref={this.tableScroller}>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr key="time">
                {this.props.data.map((d, index) =>
                  (<th className={index === 0 ? 'head-col' : ''} key={`time-${d[0]}`}>{d[0]}</th>)
                )}
              </tr>
            </thead>
            <tbody>
              {this.props.data[0].map((d, index) => {
                if (index !== 0) {
                  return (
                    <tr key={`${d}`}>
                      {this.props.data.map(
                        (rowData, rowIdx) => {
                          if (rowIdx === 0) {
                            return (
                              <th
                                  className="head-col"
                                  key={`${d}-${rowData[0]}`}>
                                {rowData[index]}
                              </th>)
                          } else {
                            return (<td key={ `${d}-${rowData[0]}` }>{
                              typeof (rowData[index]) === 'number' ? this.numberWithCommas(rowData[index]) : rowData[index]
                            }</td>)
                          }
                        })
                      }
                    </tr>
                  )
                } else {
                  return null
                }
              })}
            </tbody>
          </Table>
        </div>
      </div>)
  }
}

export default CustomizedTable
