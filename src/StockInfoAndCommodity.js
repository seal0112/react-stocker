import React, { useState, useEffect, useContext } from 'react'
import './assets/css/StockInfoAndCommodity.css'
import { StockContext } from './StockContext'
import * as StockerAPI from './utils/StockerAPI'

const StockInfoAndCommodity = () => {
  const [companyName, setCompanyName] = useState('')
  const [exchangeType, setExchangeType] = useState('')
  const [industryCategory, setIndustryCategory] = useState('')
  const [stockCommodity, setStockCommodity] = useState({
    stockFuture: false,
    stockOption: false,
    smallStockFuture: false
  })

  const stock = useContext(StockContext)

  const exchType = {
    sii: '上市',
    otc: '上櫃',
    rotc: '興櫃',
    pub: '公開發行'
  }

  const handleStockInfoAndCommodity = (data) => {
    setCompanyName(data.stockInformation['公司簡稱'])
    setExchangeType(exchType[data.stockInformation.exchangeType])
    setIndustryCategory(data.stockInformation['產業類別'])
    setStockCommodity(data.stockCommodity)
  }

  const getStockInfoAndCommodity = () => {
    StockerAPI.getStockInfoAndCommodity(stock.stockNum)
      .then(handleStockInfoAndCommodity)
      .catch(err => {
        stock.handleStockExist(false)
        console.log(err)
      })
  }

  useEffect(() => {
    getStockInfoAndCommodity()
  }, [stock.stockNum])

  const stockInfoAndCommodity = [exchangeType, industryCategory]
  if (stockCommodity.stockFuture) stockInfoAndCommodity.push('股票期貨')
  if (stockCommodity.stockOption) stockInfoAndCommodity.push('股票選擇權')
  if (stockCommodity.smallStockFuture) stockInfoAndCommodity.push('小型股票期貨')

  return (
    <div className="StockInfoAndCommodity">
      <h3 id="stockName">{stock.stockNum} {companyName}</h3>
      <p id="stockCommodity">{`${stockInfoAndCommodity.join(', ')}`}</p>
    </div>)
}

export default StockInfoAndCommodity
