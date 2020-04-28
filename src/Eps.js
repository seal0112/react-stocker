import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';

class Eps extends Component {
    state = {
        epsData: [
          ["Season", "EPS"],
          ["2010Q1", 3.4],
          ["2010Q2", 1.6],
          ["2010Q3", 7.5],
          ["2010Q4", 5.6],
          ["2011Q1", 6.7]
        ],
    }
    render() {
        const data = this.state.epsData;
        return (
            <div className="Eps">
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart</div>}
                    options={{
                        title: 'EPS',
                        legend: {
                          position: "top"
                        },
                        chartArea: { width: '80%' },
                        colors: ['#2cc185'],
                    }}
                    data={data} />
                <CustomizedTable data={data}/>
            </div>
        );
    }
}

export default Eps;