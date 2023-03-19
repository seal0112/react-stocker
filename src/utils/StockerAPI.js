import axios from 'axios'

import { getToken } from './StockerTool'

const api = `https://${process.env.REACT_APP_HOST_DOMAIN}`
const header = {
  Accept: 'application/json'
}

const authRequest = axios.create({
  headers: header,
  baseURL: api + '/api/auth',
  withCredentials: true,
  mode: 'no-cors'
})

const frontendDataRequest = axios.create({
  headers: header,
  baseURL: api + '/api/v0',
  withCredentials: true,
  mode: 'no-cors'
})

frontendDataRequest.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

// for user authiciate
export const login = (data) =>
  authRequest.post('/login', data).then((res) => res.data)

export const logout = () => authRequest.get('/logout')
export const checkAuth = () => authRequest.get('/check_auth')
export const userInfo = () => authRequest.get('/user_info', {
  headers: {
    authorization: `Bearer ${getToken()}`
  }
})

// for front-end data request
export const checkStockExist = (stockId) =>
  frontendDataRequest.get(`/f/check_stock_exist/${stockId}`)

export const getStockInfoAndCommodity = (stockId) =>
  frontendDataRequest.get(`/f/stock_info_commodity/${stockId}`)
    .then((res) => res.data)

export const getStockCommodity = (stockId) =>
  frontendDataRequest.get(`/f/stock_commodity/${stockId}`)
    .then((res) => res.data)

export const getDailyInfo = (stockId) =>
  frontendDataRequest.get(`/f/daily_info/${stockId}`)
    .then((res) => res.data)

export const getRevenue = (stockId) =>
  frontendDataRequest.get(`/f/month_revenue/${stockId}`)
    .then((res) => res.data)

export const getEps = (stockId) =>
  frontendDataRequest.get(`/f/eps/${stockId}`)
    .then((res) => res.data)

export const getIncomeSheet = (stockId) =>
  frontendDataRequest.get(`/f/income_sheet/${stockId}`)
    .then((res) => res.data)

export const getProfit = (stockId) =>
  frontendDataRequest.get(`/f/profit_analysis/${stockId}`)
    .then((res) => res.data)

export const getOperatingExpenses = (stockId) =>
  frontendDataRequest.get(`/f/op_expense_analysis/${stockId}`)
    .then((res) => res.data)

export const getMarketFeed = (targetDate, feedType, page, pageSize) =>
  frontendDataRequest.get(
    '/f/feed?' +
    `targetDate=${targetDate}&` +
    `feedType=${feedType}&` +
    `page=${page}&` +
    `page_size=${pageSize}`
  ).then((res) => res.data)

export const getAnnouncementDismantling = (announcementDate) =>
  frontendDataRequest.post('/incomesheet_announce', announcementDate)
    .then((res) => res.data)
