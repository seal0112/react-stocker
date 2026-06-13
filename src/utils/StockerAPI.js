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

export const getRevenue = (stockId, year = 5) =>
  frontendDataRequest.get(`/f/month_revenue/${stockId}?year=${year}`)
    .then((res) => res.data)

export const getEps = (stockId, year = 5) =>
  frontendDataRequest.get(`/f/eps/${stockId}?year=${year}`)
    .then((res) => res.data)

export const getIncomeSheet = (stockId, year = 5) =>
  frontendDataRequest.get(`/f/income_sheet/${stockId}?year=${year}`)
    .then((res) => res.data)

export const getProfit = (stockId, year = 5) =>
  frontendDataRequest.get(`/f/profit_analysis/${stockId}?year=${year}`)
    .then((res) => res.data)

export const getOperatingExpenses = (stockId, year = 5) =>
  frontendDataRequest.get(`/f/op_expense_analysis/${stockId}?year=${year}`)
    .then((res) => res.data)

export const getMonthlyValuation = (stockId, years = 5) =>
  frontendDataRequest.get(`/monthly_valuation?stock=${stockId}&years=${years}`)
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

export const getAnnouncementDismantlingList = (updateDate) => {
  const params = updateDate ? `?update_date=${updateDate}` : ''
  return frontendDataRequest.get(`/feed/announcement_income_sheet_analysis${params}`)
    .then((res) => res.data)
}

export const triggerAnnouncementParsing = (feedId) =>
  frontendDataRequest.post(`/announcement_income_sheet_analysis/trigger?feed_id=${feedId}`)
    .then((res) => res.data)

export const getAnnouncementFeeds = (date) =>
  frontendDataRequest.get(`/feed?starttime=${date}&endtime=${date}`)
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

export const getStockFeed = (stockId, page, pageSize, startDate = null, sources = []) => {
  const params = new URLSearchParams({ page, page_size: pageSize })
  if (startDate) params.append('start_date', startDate)
  const sourceStr = sources.length > 0 ? '&' + sources.map(s => `source=${s}`).join('&') : ''
  return frontendDataRequest.get(`/feed/${stockId}?${params.toString()}${sourceStr}`)
    .then((res) => res.data)
}

export const getEarningsCallList = (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.stock) queryParams.append('stock', params.stock)
  if (params.meeting_date) queryParams.append('meeting_date', params.meeting_date)
  if (params.date_from) queryParams.append('date_from', params.date_from)
  if (params.date_to) queryParams.append('date_to', params.date_to)
  if (params.score_min !== undefined && params.score_min !== '') queryParams.append('score_min', params.score_min)
  if (params.score_max !== undefined && params.score_max !== '') queryParams.append('score_max', params.score_max)
  const queryString = queryParams.toString()
  return frontendDataRequest.get(`/earnings_call${queryString ? '?' + queryString : ''}`)
    .then((res) => res.data)
}

export const getStockEarningsCallList = (stockId, page = 1, pageSize = 15) =>
  frontendDataRequest.get(`/earnings_call?stock=${stockId}&page=${page}&page_size=${pageSize}`)
    .then((res) => res.data)

export const getEarningsCallSummary = (earningsCallId) =>
  frontendDataRequest.get(`/earnings_call/${earningsCallId}/summary`)
    .then((res) => res.data)

export const triggerEarningsCallSummary = (earningsCallId) =>
  frontendDataRequest.post(`/earnings_call/${earningsCallId}/summary`)
    .then((res) => res.data)

export const getEarningsCallBoundFeeds = (earningsCallId) =>
  frontendDataRequest.get(`/earnings_call/${earningsCallId}/bound_feeds`)
    .then((res) => res.data)
