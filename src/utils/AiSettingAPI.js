import { frontendDataRequest } from './StockerAPI'

export const getAiSetting = () =>
  frontendDataRequest.get('/ai_setting').then((res) => res.data)

export const updateAiSetting = (provider) =>
  frontendDataRequest.put('/ai_setting', { provider }).then((res) => res.data)
