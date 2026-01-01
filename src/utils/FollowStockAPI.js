import { createApiRequest } from 'utils/DomainSetup'

const followStockRequest = createApiRequest('/api/v0')

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
