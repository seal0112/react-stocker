import axios from 'axios'
import { getToken } from 'utils/StockerTool'

const api = `https://${process.env.REACT_APP_HOST_DOMAIN}`
const header = {
  Accept: 'application/json'
}

const recommendStockRequest = axios.create({
  headers: header,
  baseURL: api + '/api/v0',
  withCredentials: true,
  mode: 'no-cors'
})

recommendStockRequest.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

export const getRecommendStockList = (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.date) queryParams.append('date', params.date)
  if (params.filterModel) queryParams.append('filter_model', params.filterModel)
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.detail) queryParams.append('detail', params.detail)

  const queryString = queryParams.toString()
  const url = queryString ? `/recommended_stock?${queryString}` : '/recommended_stock'

  return recommendStockRequest.get(url)
    .then((res) => res.data)
}

export const getFilterModels = () =>
  recommendStockRequest.get('/recommended_stock/filter-models')
    .then((res) => res.data)

export const getStatistics = (date) => {
  const url = date
    ? `/recommended_stock/statistics?date=${date}`
    : '/recommended_stock/statistics'

  return recommendStockRequest.get(url)
    .then((res) => res.data)
}
