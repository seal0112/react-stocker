import { createApiRequest } from 'utils/DomainSetup'

const tokenRequest = createApiRequest('/api/v1/token')

export const getTokens = () =>
  tokenRequest.get('')
    .then((res) => res.data)

export const createToken = (data) =>
  tokenRequest.post('', data)
    .then((res) => res.data)

export const deleteToken = (tokenId) =>
  tokenRequest.delete(`/${tokenId}`)
    .then((res) => res.data)

export const regenerateToken = (tokenId) =>
  tokenRequest.post(`/${tokenId}/regenerate`, {})
    .then((res) => res.data)
