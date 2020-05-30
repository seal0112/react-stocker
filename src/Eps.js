import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';
import * as StockerAPI from './utils/StockerAPI';
import * as StockerTool from './utils/StockerTool';

class Eps extends Component {
    _isMounted = false;

    state = {
        epsData: [],
    }

    handleEpsState = (epsData) => {
        if (this._isMounted) {
            this.setState({epsData})
        }
    }

    getEpsData = (stockNum) => {
        StockerAPI.getEps(stockNum)
            .then(res => res.data)
            .then(StockerTool.formatDataForGoogleChart)
            .then(this.handleEpsState)
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.stockNum !== prevProps.stockNum) {
            this.getEpsData(this.props.stockNum)
        }
    }

    componentDidMount = () => {
        this._isMounted = true;

        this.getEpsData(this.props.stockNum)
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        const data = this.state.epsData;
        console.log(data)
        // let chartData = data.map((d, idx)=>{
        //     console.log(d)
        //     if(idx===0){
        //         return d;
        //     }
        //     const date = d[0].split("-")
        //     d[0] = Date(date[0], date[1]);
        //     return d;
        // })
        // console.log(data)
        // console.log(chartData)
        console.log(this.state.epsData)
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
                        vAxis: {
                            title: 'EPS',
                            minValue: 0
                        },
                        hAxis: {
                            direction: -1,
                            gridlines: {
                                count: 4,
                                color: 'green'
                            },
                            format: 'yy'
                        },
                    }}
                    data={data} />
                <CustomizedTable data={this.state.epsData}/>
            </div>
        );
    }
}

export default Eps;