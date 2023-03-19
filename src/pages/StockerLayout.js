import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import '../assets/css/StockerLayout.css'

import Header from '../components/Header'
import NaviBar from '../components/NaviBar'
import StockInfoAndCommodity from '../components/StockInfoAndCommodity'
import FollowStock from '../components/FollowStock'
import NoThisStock from './NoThisStock'

import { useStock } from '../hooks/StockContext'

const StockerLayout = () => {
  const stock = useStock()

  return (
    <div className="Stocker">
      <Header />
      <NaviBar />
      {stock.stockNum
        ? <Container>
            <div id="stock-banner">
              <StockInfoAndCommodity />
              <FollowStock />
            </div>
            <hr />
            <Outlet />
            </Container>
        : <NoThisStock />
      }
    </div>
  )
}

export default StockerLayout
