import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';
import { Tabs, Tab } from 'react-bootstrap';

class OperatingExpensesAnalysis extends Component {
    state = {
        operatingExpensesData: [
          ["Year/Season", "營業費用率", "推銷費用率", "管理費用率", "研究發展費用率", "營業費用", "推銷費用", "管理費用", "研究發展費用"],
          ["2017Q1", 11.18, 0.64, 2.24, 8.3, 26156483, 1496487, 5247603, 19412393],
          ["2017Q2", 11.86, 0.65, 2.3, 8.91, 25366814, 1382199, 4927159, 19057456],
          ["2017Q3", 10.92, 0.59, 1.98, 8.35, 27536716, 1487598, 5003679, 21045439],
          ["2017Q4", 10.39, 0.58, 2.17, 7.64, 28841655, 1606204, 6018276, 21217175],
          ["2018Q1", 10.77, 0.58,  1.96, 8.23, 26728394, 1448092, 4851708, 20428594],
          ["2018Q2", 11.33, 0.63, 2.17, 8.53, 26440124, 1477977, 5070594, 19891553],
          ["2018Q3", 10.8, 0.61, 1.79, 8.41, 28128452, 1585523, 4656730, 21886199],
          ["2018Q4", 10.65, 0.51, 1.96, 8.18, 30852310, 1476236, 5686851, 23689223],
          ["2019Q1", 11.9, 0.67, 1.89, 9.34, 26018013, 1459973, 4140729, 20417311],
          ["2019Q2", 11.27, 0.62, 1.78, 8.88, 27164995, 1483004, 4288263, 21393728],
          ["2019Q3", 10.71, 0.54, 1.98, 8.18, 31378953, 1596829, 5810048, 23972076],
          ["2019Q4", 11.01, 0.57, 2.36, 8.08, 34942621, 1808820, 7498170, 25635631]
        ],
        activeKey: "precentageOperExp"
    }

    handleCount = (key) => {
        this.setState({
         activeKey: key
        })
    }

    render() {
        const data = this.state.operatingExpensesData;
        const precentageOperExp = data.map(d=>[].concat(d.slice(0,5)))
        const rowOperExp = data.map(d=>[].concat(d.slice(0,1), d.slice(5)))
        return (
            <div className="Operating-Expenses-Analysis">
                <Tabs defaultActiveKey="precentageOperExp" id="Operating-Expenses-tab" onSelect={this.handleCount}>
                    <Tab eventKey="precentageOperExp" title="營業費用比例">
                        <Chart
                            chartType="ComboChart"
                            width="100%"
                            height="400px"
                            loader={<div>Loading Chart</div>}
                            options={{
                                title: '營業費用比例',
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
                                },
                                pointSize: 7,
                                vAxes: {
                                    0: {},
                                }
                            }}
                            data={precentageOperExp} />
                    </Tab>
                    <Tab eventKey="rowOperExp" title="營業費用資料">
                        <Chart
                            chartType="ComboChart"
                            width="100%"
                            height="500px"
                            loader={<div>Loading Chart</div>}
                            options={{
                                title: '營業費用資料',
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
                                },
                                pointSize: 7,
                                vAxes: {
                                    0: {},
                                }
                            }}
                            data={rowOperExp} />
                    </Tab>
                </Tabs>
                <CustomizedTable data={data}/>
            </div>
        );
    }
}

export default OperatingExpensesAnalysis;