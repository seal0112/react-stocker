import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';

class Revenue extends Component {
    state = {
        revenueData: [
          ["Year", "營收", "年增率"],
          ["2010", 10, 22.6],
          ["2020", 14, 70.7],
          ["2030", 16, 62.8],
          ["2040", 22, -14.6],
          ["2050", 28, -22]
        ],
    }
    render() {
        const data = this.state.revenueData;
        return (
            <div className="revenue">
                <Chart
                    chartType="ComboChart"
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart</div>}
                    options={{
                        title: '月營收',
                        chartArea: { width: '80%' },
                        colors: ['#2cc185', 'red'],
                        seriesType: 'bars',
                        series: {
                            0: { targetAxisIndex: 0 },
                            1: { targetAxisIndex: 1, type: 'line' }
                        },
                        vAxes: {
                          // Adds labels to each axis; they don't have to match the axis names.
                            0: {baseline: 0},
                            1: {baseline: 0}
                        },
                    }}
                    rootProps={{ 'data-testid': '2' }}
                    data={data} />
                <CustomizedTable data={data}/>
            </div>
        );
    }
}

export default Revenue;