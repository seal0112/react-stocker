import { createApiRequest } from 'utils/DomainSetup'

const aiReportRequest = createApiRequest('/api/v0/ai_report')

export const listAiReports = (params = {}) => {
  const q = new URLSearchParams()
  if (params.report_type) q.append('report_type', params.report_type)
  if (params.subject) q.append('subject', params.subject)
  if (params.processing_status) q.append('processing_status', params.processing_status)
  if (params.date_from) q.append('date_from', params.date_from)
  if (params.date_to) q.append('date_to', params.date_to)
  if (params.page) q.append('page', params.page)
  if (params.page_size) q.append('page_size', params.page_size)
  const qs = q.toString()
  return aiReportRequest.get(qs ? `?${qs}` : '').then((res) => res.data)
}

export const getAiReport = (id) =>
  aiReportRequest.get(`/${id}`).then((res) => res.data)

export const createAiReport = (data) =>
  aiReportRequest.post('', data).then((res) => res.data)

export const updateAiReport = (id, data) =>
  aiReportRequest.put(`/${id}`, data).then((res) => res.data)
