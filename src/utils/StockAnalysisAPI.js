import { createApiRequest } from 'utils/DomainSetup'

const stockAnalysisRequest = createApiRequest('/api/v0/stock_analysis')

export const getStockAnalysis = (stockId) =>
  stockAnalysisRequest.get(`/${stockId}`).then((res) => res.data)
