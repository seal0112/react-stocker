import React, { Component } from 'react'
import './css/StockInfoAndCommodity.css'
import * as StockerAPI from './utils/StockerAPI'

class StockInfoAndCommodity extends Component {
  _isMounted = false;

  constructor (props) {
    super(props)
    this.state = {
      companyName: '',
      exchangeType: '',
      industryCategory: '',
      stockFuture: true,
      stockOption: true,
      smallStockFuture: true
    }
  }

  exchType = {
    sii: '上市',
    otc: '上櫃',
    rotc: '興櫃',
    pub: '公開發行'
  }

  handleStockInfoAndCommodity = (data) => {
    console.log(data)
    this.setState({
      companyName: data.stockInformation['公司簡稱'],
      exchangeType: this.exchType[data.stockInformation.exchangeType],
      industryCategory: data.stockInformation['產業類別'],
      stockFuture: data.stockCommodity.stock_future,
      stockOption: data.stockCommodity.stock_option,
      smallStockFuture: data.stockCommodity.small_stock_future
    })
  }

  getStockInfoAndCommodity = () => {
    StockerAPI.getStockInfoAndCommodity(this.props.stockNum)
      .then(this.handleStockInfoAndCommodity)
      .catch(err => {
        console.log(err)
      })
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.stockNum !== prevProps.stockNum) {
      this.getStockInfoAndCommodity(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getStockInfoAndCommodity(this.props.stockNum)
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const {
      companyName,
      exchangeType,
      industryCategory,
      stockFuture,
      stockOption,
      smallStockFuture
    } = this.state

    const stockInfoAndCommodity = [exchangeType, industryCategory]
    if (stockFuture) stockInfoAndCommodity.push('股票期貨')
    if (stockOption) stockInfoAndCommodity.push('股票選擇權')
    if (smallStockFuture) stockInfoAndCommodity.push('小型股票期貨')

    return (
      <div className="StockInfoAndCommodity">
        <h3 id="stockName">{this.props.stockNum} {companyName}</h3>
        <p id="stockCommodity">{`${stockInfoAndCommodity.join(', ')}`}</p>
      </div>)
  }
}

export default StockInfoAndCommodity
