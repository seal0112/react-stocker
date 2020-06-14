import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';
import { Tabs, Tab } from 'react-bootstrap';
import * as StockerAPI from './utils/StockerAPI';
import * as StockerTool from './utils/StockerTool';


/*
 * Operating Expenses Data example for google chart
 * operatingExpensesData: [
 *     ["Year/Season", "營業費用率", "推銷費用率", "管理費用率", "研究發展費用率", "營業費用", "推銷費用", "管理費用", "研究發展費用"],
 *     ["2017Q1", 11.18, 0.64, 2.24, 8.3, 26156483, 1496487, 5247603, 19412393]
 * ]
 */
class OperatingExpensesAnalysis extends Component {
    _isMounted = false;

    state = {
        operatingExpensesData: [
            ["Year/Season", "營業費用率", "推銷費用率", "管理費用率", "研究發展費用率", "營業費用", "推銷費用", "管理費用", "研究發展費用"],
            ["", 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        activeKey: "precentageOperExp"
    }

    operatingExpensesKeysOrder = [
        "Year/Season", "營業費用率", "推銷費用率", "管理費用率", "研究發展費用率",
        "營業費用", "推銷費用", "管理費用", "研究發展費用"]

    handleCount = (key) => {
        this.setState({
         activeKey: key
        })
    }

    handleOperatingExpensesState = (operatingExpensesData) => {
        this.setState({operatingExpensesData})
    }

    getOperatingExpensesData = (stockNum) => {
        StockerAPI.getOperatingExpenses(stockNum)
            .then(res => res.data)
            .then(data => StockerTool.formatDataForGoogleChart(
                data, this.operatingExpensesKeysOrder))
            .then(this.handleOperatingExpensesState)
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.stockNum !== prevProps.stockNum) {
            this.getOperatingExpensesData(this.props.stockNum)
        }
    }

    componentDidMount = () => {
        this._isMounted = true;

        this.getOperatingExpensesData(this.props.stockNum)
    }

    componentWillUnmount = () => {
        this._isMounted = false;
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
                                chartArea: { width: '80%' },
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
                                },
                                hAxis: {

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
                                },
                                hAxis: {
                                    showTextEvery: 4,
                                },
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