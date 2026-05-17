import { frontendDataRequest } from './StockerAPI'

export const getAiSetting = () =>
  frontendDataRequest.get('/ai_setting').then((res) => res.data)

export const updateAiSetting = (provider, model) =>
  frontendDataRequest.put('/ai_setting', { provider, model }).then((res) => res.data)
