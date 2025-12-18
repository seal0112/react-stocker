import axios from 'axios'

import { getToken } from 'utils/StockerTool'
import { domain, header } from 'utils/DomainSetup'

const tokenRequest = axios.create({
  headers: header,
  baseURL: domain + '/api/v1/token',
  withCredentials: true,
  mode: 'no-cors'
})

const getAuthHeader = () => ({
  headers: {
    authorization: `Bearer ${getToken()}`
  }
})

export const getTokens = () =>
  tokenRequest.get('/', getAuthHeader())
    .then((res) => res.data)

export const createToken = (data) =>
  tokenRequest.post('/', data, getAuthHeader())
    .then((res) => res.data)

export const deleteToken = (tokenId) =>
  tokenRequest.delete(`/${tokenId}`, getAuthHeader())
    .then((res) => res.data)

export const regenerateToken = (tokenId) =>
  tokenRequest.post(`/${tokenId}/regenerate`, {}, getAuthHeader())
    .then((res) => res.data)
