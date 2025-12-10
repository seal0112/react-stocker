import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import StockerLayout from 'pages/StockerLayout'
import Login from 'pages/Login'
import DailyInfo from 'pages/DailyInfo'
import Revenue from 'pages/Revenue'
import Eps from 'pages/Eps'
import IncomeSheet from 'pages/IncomeSheet'
import ProfitAnalysis from 'pages/ProfitAnalysis'
import OperatingExpensesAnalysis from 'pages/OperatingExpensesAnalysis'
import MarketNews from 'pages/taiwan_market/MarketNews'
import AnnouncementDismantling from 'pages/taiwan_market/AnnouncementDismantling'
import AnnouncementDismantlingList from 'pages/taiwan_market/AnnouncementDismantlingList'
import RecommendStockList from 'pages/RecommendStockList'
import UserInfo from 'pages/UserInfo'
import FollowStockList from 'pages/FollowStockList'
import RequireAuth from 'components/RequireAuth'

export default function App () {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact path="/login"
            element={<Login />}
          />
          <Route element={<RequireAuth />}>
            <Route
              path="/"
              element={
                <StockerLayout />
              }
            >
              {['/', '/basic-info/daily-info/:stockNum'].map(path => (
                <Route
                  key={path}
                  exact
                  path={path}
                  element={<DailyInfo />}
                />
              ))}
              <Route
                path="/basic-info/company-data/:stockNum"
                element={<p>company data</p>}
              />
              <Route
                key="news"
                path="/basic-info/news/:stockNum"
                element={<p>news</p>}
              />
              <Route
                key="comment"
                path="/basic-info/comment/:stockNum"
                element={<p>comment</p>}
              />
              <Route
                key="revenue"
                path="/financial-stat/revenue/:stockNum"
                element={<Revenue />}
              />
              <Route
                key="eps"
                path="/financial-stat/eps/:stockNum"
                element={<Eps />}
              />
              <Route
                key="income-sheet"
                path="/financial-stat/income-sheet/:stockNum"
                element={<IncomeSheet />}
              />
              <Route
                key="profit-analysis"
                path="/financial-stat/profit-analysis/:stockNum"
                element={<ProfitAnalysis />}
              />
              <Route
                key="operating-expenses-analysis"
                path="/financial-stat/operating-expenses-analysis/:stockNum"
                element={<OperatingExpensesAnalysis />}
              />
              <Route path="*" element={<p>no match</p>} />
            </Route>
            <Route
              path=""
              element={
                <StockerLayout />
              }
            >
              <Route
                key="market-news"
                path="/taiwan-stock/news"
                element={<MarketNews />}
              />
              <Route
                key="announcement-dismantling"
                path="/taiwan-stock/announcement-dismantling"
                element={<AnnouncementDismantling />}
              />
              <Route
                key="announcement-dismantling-list"
                path="/taiwan-stock/announcement-dismantling-list"
                element={<AnnouncementDismantlingList />}
              />
              <Route
                key="recommend-stock"
                path="/taiwan-stock/recommend-stock"
                element={<RecommendStockList />}
              />
            </Route>
            <Route
              path=""
              element={
                <StockerLayout />
              }
            >
              <Route
                key="follow-stock-list"
                path="/user"
                element={<UserInfo />}
              />
              <Route
                key="follow-stock-list"
                path="/user/follow-stocks"
                element={<FollowStockList />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
