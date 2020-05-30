import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import { Tabs, Tab } from 'react-bootstrap';
import CustomizedTable from './CustomizedTable';
import * as StockerAPI from './utils/StockerAPI';
import * as StockerTool from './utils/StockerTool';

class Revenue extends Component {
    _isMounted = false;

    state = {
        revenueData: [
          ["Year", "營收", "年增率"],
          ["2010", 10, 22.6],
          ["2020", 14, 70.7],
          ["2030", 16, 62.8],
          ["2040", 22, -14.6],
          ["2050", 28, -22]
        ],
        activeKey: "precentageOperExp"
    }

    handleCount = (key) => {
        this.setState({
            activeKey: key
        })
    }

    handleRevenueData = (revenueData) => {
        this.setState({revenueData})
    }

    getRevenueData = (stockNum) => {
        StockerAPI.getRevenue(stockNum)
            .then(res => res.data)
            .then(StockerTool.formatDataForGoogleChart)
            .then(this.handleRevenueData)
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.stockNum !== prevProps.stockNum) {
            this.getRevenueData(this.props.stockNum)
        }
    }

    componentDidMount = () => {
        this._isMounted = true;

        this.getRevenueData(this.props.stockNum)
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        const data = this.state.revenueData;
        const revenue = data.map(d=>[].concat(d.slice(0,1), d.slice(2)))
        const annualIncrease = data.map(d=>[].concat(d.slice(0,2)))
        return (
            <div className="revenue">
                <Tabs defaultActiveKey="revenue" id="Revenue-Analysis-tab" onSelect={this.handleCount}>
                    <Tab eventKey="revenue" title="當月營收">
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
                                seriesType: 'bars',
                                series: {
                                  0:{visibleInLegend: true, color: '#2cc185'},
                                },
                                pointSize: 7,
                                vAxes: {
                                    0: {},
                                },
                                hAxis: {
                                    direction: -1,
                                },
                            }}
                            data={revenue} />
                    </Tab>
                    <Tab eventKey="annualIncrease" title="去年同月增減">
                        <Chart
                            chartType="ComboChart"
                            width="100%"
                            height="500px"
                            loader={<div>Loading Chart</div>}
                            options={{
                                title: '去年同月增減',
                                legend: {
                                  position: "top"
                                },
                                chartArea: { width: '75%' },
                                seriesType: 'line',
                                series: {
                                  0:{visibleInLegend: true, color: 'red'},
                                },
                                pointSize: 7,
                                vAxes: {
                                    0: {},
                                },
                                hAxis: {
                                    direction: -1,
                                },
                            }}
                            data={annualIncrease} />
                    </Tab>
                </Tabs>
                <CustomizedTable data={data}/>
            </div>
        );
    }
}

export default Revenue;