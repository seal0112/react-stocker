import React, { useEffect, useContext } from 'react'
import StockerLayout from './StockerLayout'
import Login from './Login'
import DailyInfo from './DailyInfo'
import Revenue from './Revenue'
import Eps from './Eps'
import IncomeSheet from './IncomeSheet'
import ProfitAnalysis from './ProfitAnalysis'
import OperatingExpensesAnalysis from './OperatingExpensesAnalysis'
import RequireAuth from './RequireAuth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContext, AuthProvider } from './AuthContext'
import { StockProvider } from './StockContext'

export default function App () {
  const auth = useContext(AuthContext)

  useEffect(() => {
    console.log(auth)
    // auth.getAccountData()
  }, [])

  return (
    <div className="App">
      <AuthProvider>
        <StockProvider>
          <BrowserRouter>
            <Routes>
              <Route
                  exact path="/login"
                  element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route
                    path="/"
                    element={
                      <StockerLayout />}>
                  {['/', '/basic-info/daily-info/:stockNum'].map(path => (
                    <Route
                        key={path}
                        exact
                        path={path}
                        element={<DailyInfo />} />
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
                      element={<Revenue />} />
                  <Route
                      key="eps"
                      path="/financial-stat/eps/:stockNum"
                      element={<Eps />} />
                  <Route
                      key="income-sheet"
                      path="/financial-stat/income-sheet/:stockNum"
                      element={<IncomeSheet />} />
                  <Route
                      key="profit-analysis"
                      path="/financial-stat/profit-analysis/:stockNum"
                      element={<ProfitAnalysis />} />
                  <Route
                      key="operating-expenses-analysis"
                      path="/financial-stat/operating-expenses-analysis/:stockNum"
                      element={<OperatingExpensesAnalysis />} />
                  <Route path="*" element={<p>no match</p>} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </StockProvider>
      </AuthProvider>
    </div>
  )
}
