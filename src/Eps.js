import React, { useState, useEffect, useContext } from 'react'
import { Chart } from 'react-google-charts'
import CustomizedTable from './CustomizedTable'
import { StockContext } from './StockContext'
import * as StockerAPI from './utils/StockerAPI'
import * as StockerTool from './utils/StockerTool'

/* EPS Data example for google chart
 * epsData: [
 *     ['Year/Season', '基本每股盈餘'],
 *     ['2017Q4', 2.1]
 * ]
 */
const Eps = () => {
  const [epsData, setEpsdata] = useState([
    ['Year/Season', '基本每股盈餘'],
    ['', 0]
  ])
  const stock = useContext(StockContext)

  const epsKeysOrder = ['Year/Season', '基本每股盈餘']

  const handleEpsState = (epsData) => {
    setEpsdata(epsData)
  }

  useEffect(() => {
    StockerAPI.getEps(stock.stockNum)
      .then(data => StockerTool.formatDataForGoogleChart(data, epsKeysOrder))
      .then(handleEpsState)
  }, [stock.stockNum])

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
              position: 'top'
            },
            chartArea: { width: '80%' },
            colors: ['#2cc185'],
            vAxis: {
              title: 'EPS',
              minValue: 0
            },
            hAxis: {
              showTextEvery: 4
            }
          }}
          data={epsData} />
      <CustomizedTable data={epsData} />
    </div>
  )
}

export default Eps
