import axios from 'axios'

export const domain = `https://${process.env.REACT_APP_HOST_DOMAIN}`

export const header = {
  Accept: 'application/json'
}

export const getCsrfToken = () => {
  const match = document.cookie.match(/csrf_access_token=([^;]+)/)
  return match ? match[1] : null
}

// Separate instance for token refresh — must not go through the response interceptor
// to avoid infinite loops when the refresh token itself is expired.
const refreshAxios = axios.create({
  headers: header,
  baseURL: domain + '/api/auth',
  withCredentials: true,
  mode: 'no-cors'
})

let isRefreshing = false
let pendingRequests = []

export const createApiRequest = (basePath) => {
  const instance = axios.create({
    headers: header,
    baseURL: domain + basePath,
    withCredentials: true,
    mode: 'no-cors'
  })

  instance.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config
      if (error.response?.status !== 401 || originalConfig._retry) {
        return Promise.reject(error)
      }

      originalConfig._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject, config: originalConfig })
        })
      }

      isRefreshing = true
      try {
        await refreshAxios.get('/refresh')
        isRefreshing = false

        const csrfToken = getCsrfToken()
        pendingRequests.forEach(({ resolve, config }) => {
          if (csrfToken) config.headers['X-CSRF-TOKEN'] = csrfToken
          resolve(instance(config))
        })
        pendingRequests = []

        if (csrfToken) originalConfig.headers['X-CSRF-TOKEN'] = csrfToken
        return instance(originalConfig)
      } catch (refreshError) {
        isRefreshing = false
        pendingRequests.forEach(({ reject }) => reject(refreshError))
        pendingRequests = []
        return Promise.reject(refreshError)
      }
    }
  )

  return instance
}
