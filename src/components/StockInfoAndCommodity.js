import React, { useState, useEffect } from 'react'
import 'assets/css/StockInfoAndCommodity.css'
import { useStock } from 'hooks/StockContext'
import * as StockerAPI from 'utils/StockerAPI'

const StockInfoAndCommodity = () => {
  const [companyName, setCompanyName] = useState('')
  const [exchangeType, setExchangeType] = useState('')
  const [industryCategory, setIndustryCategory] = useState('')
  const [stockCommodity, setStockCommodity] = useState({
    stockFuture: false,
    stockOption: false,
    smallStockFuture: false
  })

  const stock = useStock()

  const exchType = {
    sii: '上市',
    otc: '上櫃',
    rotc: '興櫃',
    pub: '公開發行'
  }

  const handleStockInfoAndCommodity = (data) => {
    setCompanyName(data.stockInformation['公司簡稱'])
    setExchangeType(exchType[data.stockInformation.exchange_type])
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
  if (stockCommodity.stock_future) stockInfoAndCommodity.push('股票期貨')
  if (stockCommodity.stock_option) stockInfoAndCommodity.push('股票選擇權')
  if (stockCommodity.small_stock_future) stockInfoAndCommodity.push('小型股票期貨')

  return (
    <div id="stockInfoAndCommodity">
      <h3 id="stockName">{stock.stockNum} {companyName}</h3>
      <p id="stockCommodity">{`${stockInfoAndCommodity.join(', ')}`}</p>
    </div>)
}

export default StockInfoAndCommodity
