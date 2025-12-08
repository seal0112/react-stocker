import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import CustomizedTable from 'components/CustomizedTable'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'
import * as StockerTool from 'utils/StockerTool'

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
  const stock = useStock()

  const epsKeysOrder = [
    {
      title: 'Year/Season',
      transferToFloat: false
    }, {
      title: '基本每股盈餘',
      transferToFloat: false
    }
  ]

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
      <StockerChart
        type="bar"
        data={epsData}
        height="400px"
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
      />
      <CustomizedTable data={epsData} />
    </div>
  )
}

export default Eps
