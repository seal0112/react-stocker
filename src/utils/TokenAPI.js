import axios from 'axios'

import { domain, header } from 'utils/DomainSetup'

const tokenRequest = axios.create({
  headers: header,
  baseURL: domain + '/api/v1/token',
  withCredentials: true,
  mode: 'no-cors'
})

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
