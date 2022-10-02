import axios from 'axios'

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
  baseURL: api + '/api/v0/f',
  withCredentials: true,
  mode: 'no-cors'
})

// for user authiciate
export const login = (data) =>
  authRequest.post('/login', data).then((res) => res.data)

export const logout = () => authRequest.get('/logout')
export const checkAuth = () => authRequest.get('/check_auth')

// for front-end data request
export const checkStockExist = (stockId) =>
  frontendDataRequest.get(`/check_stock_exist/${stockId}`)

export const getStockInfoAndCommodity = (stockId) =>
  frontendDataRequest.get(`/stock_info_commodity/${stockId}`)
    .then((res) => res.data)

export const getStockCommodity = (stockId) =>
  frontendDataRequest.get(`/stock_commodity/${stockId}`)
    .then((res) => res.data)

export const getDailyInfo = (stockId) =>
  frontendDataRequest.get(`/daily_info/${stockId}`)
    .then((res) => res.data)

export const getRevenue = (stockId) =>
  frontendDataRequest.get(`/month_revenue/${stockId}`)
    .then((res) => res.data)

export const getEps = (stockId) =>
  frontendDataRequest.get(`/eps/${stockId}`)
    .then((res) => res.data)

export const getIncomeSheet = (stockId) =>
  frontendDataRequest.get(`/income_sheet/${stockId}`)
    .then((res) => res.data)

export const getProfit = (stockId) =>
  frontendDataRequest.get(`/profit_analysis/${stockId}`)
    .then((res) => res.data)

export const getOperatingExpenses = (stockId) =>
  frontendDataRequest.get(`/op_expense_analysis/${stockId}`)
    .then((res) => res.data)

export const getMarketFeed = (targetDate, feedType) =>
  frontendDataRequest.get(`/feed?targetDate=${targetDate}&feedType=${feedType}`)
    .then((res) => res.data)
