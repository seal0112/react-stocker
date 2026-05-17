import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks/AuthContext'
import { getAiSetting, updateAiSetting } from 'utils/AiSettingAPI'

const PROVIDERS = [
  { value: 'gemini', label: 'Gemini (Google)', description: 'gemini-2.5-flash-preview-05-20' },
  { value: 'claude', label: 'Claude (Anthropic)', description: 'claude-opus-4-7' },
]

const AdminSettings = () => {
  const { hasRole } = useAuth()
  const navigate = useNavigate()

  const [setting, setSetting] = useState(null)
  const [selected, setSelected] = useState('')
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
        setSelected(data.provider)
      })
      .catch(() => setMsg({ variant: 'danger', text: '載入失敗' }))
      .finally(() => setLoading(false))
  }, [hasRole, navigate])

  const handleSave = () => {
    setSaving(true)
    setMsg(null)
    updateAiSetting(selected)
      .then(data => {
        setSetting(data)
        setSelected(data.provider)
        setMsg({ variant: 'success', text: `已切換至 ${data.provider}，下次 Lambda 執行時生效` })
      })
      .catch(() => setMsg({ variant: 'danger', text: '儲存失敗，請稍後再試' }))
      .finally(() => setSaving(false))
  }

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
              選擇法說會 AI 摘要使用的模型，設定於下次 Lambda 啟動時生效。
            </p>

            {PROVIDERS.map(p => (
              <Form.Check
                key={p.value}
                type="radio"
                id={`provider-${p.value}`}
                name="provider"
                className="mb-2"
                label={
                  <span>
                    <strong>{p.label}</strong>
                    <small className="text-muted ms-2">{p.description}</small>
                    {setting?.provider === p.value && (
                      <Badge bg="success" className="ms-2">目前使用中</Badge>
                    )}
                  </span>
                }
                value={p.value}
                checked={selected === p.value}
                onChange={() => setSelected(p.value)}
              />
            ))}

            {msg && (
              <Alert variant={msg.variant} className="mt-3 mb-0 py-2">
                {msg.text}
              </Alert>
            )}

            <div className="mt-3">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving || selected === setting?.provider}
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
