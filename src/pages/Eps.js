import React, { useState, useEffect } from 'react'
import { StockerChart } from 'components/charts'
import CustomizedTable from 'components/CustomizedTable'
import YearRangePicker from 'components/YearRangePicker'
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
  const [yearRange, setYearRange] = useState(5)
  const stock = useStock()

  const epsKeysOrder = [
    {
      title: 'Year/Season',
      transferToFloat: false
    }, {
      title: '基本每股盈餘',
      transferToFloat: true
    }
  ]

  const handleEpsState = (epsData) => {
    setEpsdata(epsData)
  }

  useEffect(() => {
    StockerAPI.getEps(stock.stockNum, yearRange)
      .then(data => StockerTool.formatDataForGoogleChart(data, epsKeysOrder))
      .then(handleEpsState)
  }, [stock.stockNum, yearRange])

  return (
    <div className="Eps">
      <YearRangePicker value={yearRange} onChange={setYearRange} />
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
