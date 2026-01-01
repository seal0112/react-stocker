import { createApiRequest } from 'utils/DomainSetup'

const authRequest = createApiRequest('/api/auth')
const frontendDataRequest = createApiRequest('/api/v0')

frontendDataRequest.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 404) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const response = await authRequest.get('/refresh')
        .then(res => res.data)
        .catch(() => null)

      if (!response?.access_token) {
        return null
      }
      return frontendDataRequest(originalRequest)
    }
    if (error.response?.status === 403) {
      window.location.href = '/login'
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

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

export const getMarketFeed = (targetDate, feedSource, page, pageSize) =>
  frontendDataRequest.get(
    '/f/feed?' +
    `targetDate=${targetDate}&` +
    `page=${page}&` +
    `page_size=${pageSize}&` +
    feedSource.map((source) => `source=${source}`).join('&')
  ).then((res) => res.data)

export const getAnnouncementDismantling = (announcementDate) =>
  frontendDataRequest.post('/incomesheet_announce', announcementDate)
    .then((res) => res.data)

export const getStockOptions = (query) =>
  frontendDataRequest.get(`/f/autocomplete?search_stock=${query}`)
    .then((res) => res.data)

export const getPushNotification = () =>
  frontendDataRequest.get('/push_notification/')
    .then((res) => res.data)

export const updatePushNotification = (pushNotificationData) =>
  frontendDataRequest.put('/push_notification/', pushNotificationData)
    .then((res) => res.data)

export const getEarningsCallList = (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.stock) queryParams.append('stock', params.stock)
  if (params.meeting_date) queryParams.append('meeting_date', params.meeting_date)
  const queryString = queryParams.toString()
  return frontendDataRequest.get(`/earnings_call${queryString ? '?' + queryString : ''}`)
    .then((res) => res.data)
}
