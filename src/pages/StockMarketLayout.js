import React from 'react'
import '../assets/css/StockerLayout.css'
import Header from '../components/Header'
import NaviBar from '../components/NaviBar'
import { Outlet } from 'react-router-dom'

const StockMarketLayout = () => {
  return (
    <div className="Stocker">
      <Header />
      <NaviBar />
      <Outlet />
    </div>
  )
}

export default StockMarketLayout
