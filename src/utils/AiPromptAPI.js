import { createApiRequest } from 'utils/DomainSetup'

const aiPromptRequest = createApiRequest('/api/v0/ai_prompt')

export const listAiPrompts = () =>
  aiPromptRequest.get('').then((res) => res.data)

export const getAiPrompt = (name, provider) => {
  const params = provider ? `?provider=${provider}` : ''
  return aiPromptRequest.get(`/${name}${params}`).then((res) => res.data)
}

export const createAiPrompt = (data) =>
  aiPromptRequest.post('', data).then((res) => res.data)

export const updateAiPrompt = (id, data) =>
  aiPromptRequest.put(`/${id}`, data).then((res) => res.data)

export const deleteAiPrompt = (id) =>
  aiPromptRequest.delete(`/${id}`).then((res) => res.data)
