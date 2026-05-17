import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks/AuthContext'
import { getAiSetting, updateAiSetting } from 'utils/AiSettingAPI'

const PROVIDERS = [
  {
    value: 'gemini',
    label: 'Gemini (Google)',
    models: [
      { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash', price: '$0.15 / $0.60' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', price: '$0.10 / $0.40' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', price: '$0.075 / $0.30' }
    ]
  },
  {
    value: 'claude',
    label: 'Claude (Anthropic)',
    models: [
      { value: 'claude-opus-4-7', label: 'Claude Opus 4.7', price: '$15 / $75' },
      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', price: '$3 / $15' },
      { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', price: '$0.80 / $4' }
    ]
  }
]

const defaultModel = (providerValue) =>
  PROVIDERS.find(p => p.value === providerValue)?.models[0]?.value || ''

const AdminSettings = () => {
  const { hasRole } = useAuth()
  const navigate = useNavigate()

  const [setting, setSetting] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/')
      return
    }
    getAiSetting()
      .then(data => {
        setSetting(data)
        setSelectedProvider(data.provider)
        setSelectedModel(data.model || defaultModel(data.provider))
      })
      .catch(() => setMsg({ variant: 'danger', text: '載入失敗' }))
      .finally(() => setLoading(false))
  }, [hasRole, navigate])

  const handleProviderChange = (providerValue) => {
    setSelectedProvider(providerValue)
    setSelectedModel(defaultModel(providerValue))
    setMsg(null)
  }

  const isDirty = selectedProvider !== setting?.provider ||
    selectedModel !== (setting?.model || defaultModel(setting?.provider))

  const handleSave = () => {
    setSaving(true)
    setMsg(null)
    updateAiSetting(selectedProvider, selectedModel)
      .then(data => {
        setSetting(data)
        setSelectedProvider(data.provider)
        setSelectedModel(data.model || defaultModel(data.provider))
        setMsg({ variant: 'success', text: `已切換至 ${data.provider} / ${data.model || 'default'}，下次 Lambda 執行時生效` })
      })
      .catch(() => setMsg({ variant: 'danger', text: '儲存失敗，請稍後再試' }))
      .finally(() => setSaving(false))
  }

  const currentProviderModels = PROVIDERS.find(p => p.value === selectedProvider)?.models || []

  if (loading) {
    return (
      <main>
        <Container className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      </main>
    )
  }

  return (
    <main>
      <Container className="py-4" style={{ maxWidth: 600 }}>
        <h4 className="mb-4">系統設定</h4>

        <Card>
          <Card.Header><strong>AI 分析 Provider</strong></Card.Header>
          <Card.Body>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              選擇法說會 AI 摘要使用的 Provider 與模型版本，設定於下次 Lambda 啟動時生效。
              <br />
              <small>費用單位：USD / 1M input tokens &nbsp;/&nbsp; 1M output tokens</small>
            </p>

            <Form.Group className="mb-3">
              <Form.Label><strong>Provider</strong></Form.Label>
              {PROVIDERS.map(p => (
                <Form.Check
                  key={p.value}
                  type="radio"
                  id={`provider-${p.value}`}
                  name="provider"
                  className="mb-1"
                  label={
                    <span>
                      {p.label}
                      {setting?.provider === p.value && (
                        <Badge bg="success" className="ms-2">使用中</Badge>
                      )}
                    </span>
                  }
                  value={p.value}
                  checked={selectedProvider === p.value}
                  onChange={() => handleProviderChange(p.value)}
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>模型版本</strong></Form.Label>
              <Form.Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {currentProviderModels.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label} — {m.price} per 1M tokens
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {msg && (
              <Alert variant={msg.variant} className="mt-3 mb-0 py-2">
                {msg.text}
              </Alert>
            )}

            <div className="mt-3">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving || !isDirty}
              >
                {saving ? <><Spinner animation="border" size="sm" className="me-1" />儲存中...</> : '儲存設定'}
              </Button>
            </div>

            {setting?.updated_by && (
              <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.8rem' }}>
                最後修改：{setting.updated_by}
                {setting.updated_at ? `，${setting.updated_at.slice(0, 16).replace('T', ' ')}` : ''}
              </p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}

export default AdminSettings
