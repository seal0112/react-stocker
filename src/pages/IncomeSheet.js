import React, { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import CustomizedTable from '../components/CustomizedTable'
import { useStock } from '../hooks/StockContext'
import * as StockerAPI from '../utils/StockerAPI'
import * as StockerTool from '../utils/StockerTool'

/*
 * Income Sheet Data example for google chart
 * incomeSheetData: [
 *     ["Year/Season", "營業收入合計", "營業毛利", "營業利益", "稅前淨利", "本期淨利", "母公司業主淨利"],
 *     ["2017Q4", 277570284, 138715365, 108894999, 111674900, 99306060, 99286122]
 * ]
 */
const IncomeSheet = () => {
  const [incomeSheetData, setIncomeSheetData] = useState([
    ['Year/Season', '營業收入合計', '營業毛利', '營業利益', '稅前淨利', '本期淨利', '母公司業主淨利'],
    ['', 0, 0, 0, 0, 0, 0]
  ])
  const stock = useStock()

  const incomeSheetKeysOrder = [
    'Year/Season',
    '營業收入合計',
    '營業毛利',
    '營業利益',
    '稅前淨利',
    '本期淨利',
    '母公司業主淨利']

  const handleIncomeSheetState = (incomeSheetData) => {
    setIncomeSheetData(incomeSheetData)
  }

  useEffect(() => {
    StockerAPI.getIncomeSheet(stock.stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, incomeSheetKeysOrder))
      .then(handleIncomeSheetState)
  }, [stock.stockNum])

  return (
    <div className="IncomeSheet">
      <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          loader={ <div>Loading Chart</div> }
          options={{
            chart: {
              title: '損益表'
            },
            legend: {
              position: 'top'
            },
            chartArea: { width: '80%' },
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
              // Adds labels to each axis; they don't have to match the axis names.
              0: { baseline: 0 }
            },
            hAxis: {
              showTextEvery: 4
            },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset']
            }
          }}
          data={incomeSheetData} />
      <CustomizedTable data={incomeSheetData}/>
    </div>
  )
}

export default IncomeSheet
