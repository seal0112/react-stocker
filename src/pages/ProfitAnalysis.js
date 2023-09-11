import React, { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import CustomizedTable from '../components/CustomizedTable'
import { useStock } from '../hooks/StockContext'
import * as StockerAPI from '../utils/StockerAPI'
import * as StockerTool from '../utils/StockerTool'

/*
 * profit Data example for google chart
 * profitData: [
 *     ["Year/Season", "營業毛利率", "營業利益率", "稅前淨利率", "本期淨利率"],
 *     ["2017Q1", 51.94, 40.76, 41.82, 37.46],
 * ]
 */
const ProfitAnalysis = () => {
  const [profitData, setProfitData] = useState([
    ['Year/Season', '營業毛利率', '營業利益率', '稅前淨利率', '本期淨利率'],
    ['', 0, 0, 0, 0]
  ])
  const stock = useStock()

  const profitKeysOrder = [
    {
      title: 'Year/Season',
      transferToFloat: false
    },
    {
      title: '營業毛利率',
      transferToFloat: true
    },
    {
      title: '營業利益率',
      transferToFloat: true
    },
    {
      title: '稅前淨利率',
      transferToFloat: true
    },
    {
      title: '本期淨利率',
      transferToFloat: true
    }
  ]

  const handleProfitState = (profitData) => {
    setProfitData(profitData)
  }

  useEffect(() => {
    StockerAPI.getProfit(stock.stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, profitKeysOrder))
      .then(handleProfitState)
  }, [stock.stockNum])

  return (
    <div className="Profit-Analysis">
      <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          options={{
            title: '利潤分析',
            legend: { position: 'top' },
            chartArea: { width: '80%' },
            seriesType: 'line',
            series: {
              0: { visibleInLegend: true },
              1: { visibleInLegend: true },
              2: { visibleInLegend: true },
              3: { visibleInLegend: true },
              4: { visibleInLegend: true },
              5: { visibleInLegend: true }
            },
            pointSize: 7,
            vAxes: {
              0: {}
            },
            hAxis: {
              showTextEvery: 4
            },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset']
            }
          }}
          data={profitData} />
      <CustomizedTable data={profitData}/>
    </div>
  )
}

export default ProfitAnalysis
