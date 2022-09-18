import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StockerLayout from './pages/StockerLayout'
import Login from './pages/Login'
import DailyInfo from './pages/DailyInfo'
import Revenue from './pages/Revenue'
import Eps from './pages/Eps'
import IncomeSheet from './pages/IncomeSheet'
import ProfitAnalysis from './pages/ProfitAnalysis'
import OperatingExpensesAnalysis from './pages/OperatingExpensesAnalysis'
import RequireAuth from './components/RequireAuth'
import { useAuth } from './hooks/AuthContext'

export default function App () {
  const auth = useAuth()

  useEffect(() => {
    if (auth) {
      auth.getAccountData()
    }
  }, [])

  return (
    <div className="App">
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
    </div>
  )
}
