import { createApiRequest } from 'utils/DomainSetup'

const request = createApiRequest('/api/v0')

export const getAiSetting = () =>
  request.get('/ai_setting').then((res) => res.data)

export const updateAiSetting = (provider, model) =>
  request.put('/ai_setting', { provider, model }).then((res) => res.data)
