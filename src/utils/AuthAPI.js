import axios from 'axios'

import { domain, header } from 'utils/DomainSetup'

const authRequest = axios.create({
  headers: header,
  baseURL: domain + '/api/auth',
  withCredentials: true,
  mode: 'no-cors'
})

// for user authenticate
export const login = (data) =>
  authRequest.post('/login', data)
    .then((res) => res.data)

export const refreshToken = () =>
  authRequest.get('/refresh')
    .then((res) => res.data)

export const logout = () => authRequest.get('/logout')

export const userInfo = () => authRequest.get('/user_info')
  .then(res => res.data)
  .catch(async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const response = await authRequest.get('/refresh')
        .then(res => res.data)
        .catch(() => null)
      if (!response?.access_token) {
        return null
      }
      return authRequest(originalRequest)
    }
    return null
  })
