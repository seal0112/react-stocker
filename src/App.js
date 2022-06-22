import React, { useState, useEffect } from 'react'
import StockerLayout from './StockerLayout'
import Login from './Login'
import DailyInfo from './DailyInfo'
import Revenue from './Revenue'
import Eps from './Eps'
import IncomeSheet from './IncomeSheet'
import ProfitAnalysis from './ProfitAnalysis'
import OperatingExpensesAnalysis from './OperatingExpensesAnalysis'
import { Routes, Route } from 'react-router-dom'
import * as StockerAPI from './utils/StockerAPI'

/**
 * Stocker main compoment.
 */
export default function App () {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stockNum, setStockNum] = useState('2330')

  const handleAuthenticated = (res) => {
    setIsAuth(res.isAuth)
    setIsLoading(false)
    if (res.isAuth) {
      console.log(this.props.history.location)

      const { from } = this.props.history.location.state || { from: { pathname: '/' } }
      this.props.history.replace(from)
    }
  }

  const handleStockNum = stockNum => {
    setStockNum(stockNum)
  }

  useEffect(() => {
    StockerAPI.checkAuth()
      .then(res => res.data)
      .then(data => handleAuthenticated(data))
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route
            exact path="/login"
            element={<Login handleAuthenticated={handleAuthenticated}/>} />
        <Route
            path="/"
            element={
              <StockerLayout
                  isAuth={isAuth}
                  isLoading={isLoading}
                  stockNum={stockNum}
                  handleStockNum={handleStockNum}/>}>
          {['/', '/basic-info/daily-info/:stockNum'].map(path => (
            <Route
                key={path}
                exact
                path={path}
                element={<DailyInfo stockNum={stockNum}/>} />
          ))}
          <Route
              path="/basic-info/company-data/:stockNum"
              element={<p>company data</p>} />
          <Route
              key="news"
              path="/basic-info/news/:stockNum"
              element={<p>news</p>} />
          <Route
              key="comment"
              path="/basic-info/comment/:stockNum"
              element={<p>comment</p>} />
          <Route
              key="revenue"
              path="/financial-stat/revenue/:stockNum"
              element={<Revenue stockNum={stockNum} />} />
          <Route
              key="eps"
              path="/financial-stat/eps/:stockNum"
              element={<Eps stockNum={stockNum} />} />
          <Route
              key="income-sheet"
              path="/financial-stat/income-sheet/:stockNum"
              element={<IncomeSheet stockNum={stockNum} />} />
          <Route
              key="profit-analysis"
              path="/financial-stat/profit-analysis/:stockNum"
              element={<ProfitAnalysis stockNum={stockNum}/>} />
          <Route
              key="operating-expenses-analysis"
              path="/financial-stat/operating-expenses-analysis/:stockNum"
              element={<OperatingExpensesAnalysis stockNum={stockNum} />} />
          <Route path="*" element={<p>no match</p>} />
        </Route>
      </Routes>
    </div>
  )
}
