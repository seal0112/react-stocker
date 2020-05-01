import React, { Component } from 'react';
import './CustomizedTable.css';
import {
    Table
} from 'react-bootstrap';

class CustomizedTable extends Component {

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        return (
            <div className="Customized-table">
                <div className="table-scroller">
                    <Table striped bordered hover responsive="md">
                      <thead>
                        <tr key="time">
                            {this.props.data.map((data, index)=>
                                (<th className={index===0?"head-col":""} key={`time-${data[0]}`}>{data[0]}</th>)
                            )}
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.data[0].forEach((d, index) => {
                            if (index!==0) {
                                return (
                                <tr key={`${d}`}>
                                    {this.props.data.map(
                                        (rowData, rowIdx)=>{
                                            if(rowIdx===0){
                                                return (<th
                                                          className="head-col"
                                                          key={`${d}-${rowData[0]}`}>
                                                            {rowData[index]}
                                                        </th>)
                                            } else {
                                                return (<td key={`${d}-${rowData[0]}`}>{
                                                    typeof(rowData[index])=='number'?this.numberWithCommas(rowData[index]):rowData[index]
                                                }</td>)
                                            }
                                        })
                                    }
                                </tr>);
                            }
                        })}
                      </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default CustomizedTable;