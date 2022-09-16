import React, { useContext } from 'react'
import './assets/css/StockerLayout.css'
import Header from './Header'
import NaviBar from './NaviBar'
import StockInfoAndCommodity from './StockInfoAndCommodity'
import NoThisStock from './NoThisStock'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { StockContext } from './StockContext'
// import * as StockerAPI from './utils/StockerAPI'

const StockerLayout = () => {
  const stock = useContext(StockContext)
  // const checkStockExist = () => {
  //   StockerAPI.checkStockExist(this.props.stockNum)
  //     .then(res => {
  //       console.log(res.status)
  //       if (res.status === 200) {
  //         this.handleStockExistChange(true)
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       if (err.response.status === 404) {
  //         this.handleStockExistChange(false)
  //       }
  //     })
  // }

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (this.props.stockNum !== prevState.stockNum) {
  //     this.checkStockExist(this.props.stockNum)
  //   }
  // }

  // componentDidMount = () => {
  //   this._isMounted = true
  //   this.checkPathnameStockNum()
  //   this.checkStockExist()
  // }

  return (
    <div className="Stocker">
      <Header />
      <NaviBar />
      {stock.stockNum
        ? <Container>
            <StockInfoAndCommodity />
            <hr />
            <Outlet />
            </Container>
        : <NoThisStock />
      }
    </div>
  )
}

export default StockerLayout
