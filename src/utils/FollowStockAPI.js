import axios from 'axios'

const api = `https://${process.env.REACT_APP_HOST_DOMAIN}`
const header = {
  Accept: 'application/json'
}

const followStockRequest = axios.create({
  headers: header,
  baseURL: api + '/api/v0',
  withCredentials: true,
  mode: 'no-cors'
})

export const getFollowStockList = () =>
  followStockRequest.get('/follow_stock/')
    .then((res) => res.data)

export const addFollowStock = (followStockData) =>
  followStockRequest.post('/follow_stock/', followStockData)
    .then((res) => res.data)

export const getFollowStock = (stockId) =>
  followStockRequest.get(`/follow_stock/${stockId}`)
    .then((res) => res.data)

export const updateFollowStock = (followStockId, followStockData) =>
  followStockRequest.patch(`/follow_stock/${followStockId}`, followStockData)
    .then((res) => res.data)

export const deleteFollowStock = (followStockId) =>
  followStockRequest.delete(`/follow_stock/${followStockId}`)
    .then((res) => res.data)
