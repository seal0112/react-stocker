import { createApiRequest } from 'utils/DomainSetup'

const request = createApiRequest('/api/v0/ai_api_key')

export const listAiApiKeys = () =>
  request.get('').then((res) => res.data)

export const createAiApiKey = (data) =>
  request.post('', data).then((res) => res.data)

export const updateAiApiKey = (id, data) =>
  request.put(`/${id}`, data).then((res) => res.data)

export const deleteAiApiKey = (id) =>
  request.delete(`/${id}`).then((res) => res.data)
