import React, { useLayoutEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import 'assets/css/StockerLayout.css'

import Header from 'components/Header'
import NaviBar from 'components/NaviBar'
import StockInfoAndCommodity from 'components/StockInfoAndCommodity'
import FollowStock from 'components/FollowStock'
import NoThisStock from 'pages/NoThisStock'

import { useStock } from 'hooks/StockContext'

const StockerLayout = () => {
  const stock = useStock()
  const { pathname } = useLocation()
  const { stockNum } = useParams()

  useLayoutEffect(() => {
    stock.handleStockNum(stockNum || '2330')
  }, [stockNum])

  return (
    <div className="Stocker">
      <Header />
      <NaviBar />
      {new Set(['taiwan-stock', 'user']).has(pathname.split('/')[1])
        ? <Outlet />
        : stock.stockNum
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
