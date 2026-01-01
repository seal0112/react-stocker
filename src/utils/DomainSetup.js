import axios from 'axios'

export const domain = `https://${process.env.REACT_APP_HOST_DOMAIN}`

export const header = {
  Accept: 'application/json'
}

export const getCsrfToken = () => {
  const match = document.cookie.match(/csrf_access_token=([^;]+)/)
  return match ? match[1] : null
}

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

  return instance
}
