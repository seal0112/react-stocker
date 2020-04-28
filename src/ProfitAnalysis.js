import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';

class ProfitAnalysis extends Component {
    state = {
        epsData: [
          ["Year/Season", "營業毛利率", "營業利益率", "稅前淨利率", "本期淨利率"],
          ["2017Q1", 51.94, 40.76, 41.82, 37.46],
          ["2017Q2", 50.85, 38.93, 40.27, 30.99],
          ["2017Q3", 49.93, 38.89, 39.87, 35.68],
          ["2017Q4", 49.97, 39.23, 40.23, 35.78],
          ["2018Q1", 50.38, 39.03, 40.29, 36.19],
          ["2018Q2", 47.84, 36.19, 37.55, 30.99],
          ["2018Q3", 47.39, 36.58, 37.99, 34.22],
          ["2018Q4", 47.64, 36.97, 38.33, 34.51],
          ["2019Q1", 41.31, 29.38, 31.18, 28.07],
          ["2019Q2", 43.02, 31.66, 33.42, 27.71],
          ["2019Q3", 47.58, 36.82, 38.33, 34.5],
          ["2019Q4", 50.2, 39.16, 40.59, 36.59]
        ],
    }

    render() {
        const data = this.state.epsData;
        return (
            <div className="Profit-Analysis">
                <Chart
                    chartType="ComboChart"
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart</div>}
                    options={{
                        title: '利潤分析',
                        legend: {
                          position: "top"
                        },
                        chartArea: { width: '75%' },
                        seriesType: 'line',
                        series: {
                          0:{visibleInLegend: true},
                          1:{visibleInLegend: true},
                          2:{visibleInLegend: true},
                          3:{visibleInLegend: true},
                          4:{visibleInLegend: true},
                          5:{visibleInLegend: true}
                        },
                        pointSize: 7,
                        vAxes: {
                            0: {},
                        },
                        explorer: {
                            actions: ['dragToZoom', 'rightClickToReset']
                        },
                    }}
                    data={data} />
                <CustomizedTable data={data}/>
            </div>
        );
    }
}

export default ProfitAnalysis;