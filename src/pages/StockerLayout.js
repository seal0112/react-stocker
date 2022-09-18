import React from 'react'
import '../assets/css/StockerLayout.css'
import Header from '../components/Header'
import NaviBar from '../components/NaviBar'
import StockInfoAndCommodity from '../components/StockInfoAndCommodity'
import NoThisStock from './NoThisStock'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useStock } from '../hooks/StockContext'

const StockerLayout = () => {
  const stock = useStock()

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
