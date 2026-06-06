import { createApiRequest } from 'utils/DomainSetup'

const request = createApiRequest('/api/v0')

export const getAiSetting = () =>
  request.get('/ai_setting').then((res) => res.data)

export const updateAiSetting = (provider, model) =>
  request.put('/ai_setting', { provider, model }).then((res) => res.data)

export const getAiTokens = () =>
  request.get('/ai_setting/token').then((res) => res.data)

export const updateAiToken = (provider, token) =>
  request.put('/ai_setting/token', { provider, token }).then((res) => res.data)
