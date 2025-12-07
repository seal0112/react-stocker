import axios from 'axios'

import { getToken } from 'utils/StockerTool'
import { domain, header } from 'utils/DomainSetup'

const authRequest = axios.create({
  headers: header,
  baseURL: domain + '/api/auth',
  withCredentials: true,
  mode: 'no-cors'
})

// for user authiciate
export const login = (data) =>
  authRequest.post('/login', data)
    .then((res) => res.data)

export const refreshToken = () =>
  authRequest.get('/refresh')
    .then((res) => res.data)

export const logout = () => authRequest.get('/logout')

export const userInfo = () => authRequest.get('/user_info', {
  headers: {
    authorization: `Bearer ${getToken()}`
  }
}).then(res => res.data)
  .catch(async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const response = await axios.get(`${domain}/api/auth/refresh`)
        .then(res => res.data)
        .catch(() => null)
      if (!response?.access_token) {
        return null
      }
      localStorage.setItem('access', response.access_token)
      originalRequest.headers.authorization = `Bearer ${response.access_token}`

      return authRequest(originalRequest)
    }
    return null
  })
