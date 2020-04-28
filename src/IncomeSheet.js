import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import CustomizedTable from './CustomizedTable';

class IncomeSheet extends Component {
    state = {
        epsData: [
          ["Year/Season", "營業收入合計", "營業毛利", "營業利益", "稅前淨利", "本期淨利", "母公司業主淨利"],
          ["2017Q4", 277570284, 138715365, 108894999, 111674900, 99306060, 99286122],
          ["2018Q1", 248078671, 124974694, 96826946, 99943621, 89787574, 89784622],
          ["2018Q2", 233276811, 111588104, 84428146, 87587608, 72293375, 72290539],
          ["2018Q3", 260347882, 123380843, 95245181, 98896942, 89098072, 89071628],
          ["2018Q4", 289770193, 138042400, 107123251, 111082092, 100005385, 99984095],
          ["2019Q1", 218704469, 90352125, 64266023, 68181652, 61387310, 61393851],
          ["2019Q2", 240998475, 103673230, 76304053, 80545440, 66775851, 66764850],
          ["2019Q3", 293045439, 139432161, 107887292, 112336271, 101102454, 101069886],
          ["2019Q4", 317237065, 159240985, 124243722, 128781973, 116078194, 116035081]
        ],
    }
    render() {
        const data = this.state.epsData;
        return (
            <div className="IncomeSheet">
                <Chart
                    chartType="ComboChart"
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart</div>}
                    options={{
                        chart: {
                          title: '損益表'
                        },
                        legend: {
                          position: "top"
                        },
                        chartArea: { width: '80%' },
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
                          // Adds labels to each axis; they don't have to match the axis names.
                            0: {baseline: 0},
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

export default IncomeSheet;