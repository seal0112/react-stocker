import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Button, Modal, Form, Badge, Alert, Spinner
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { listAiPrompts, createAiPrompt, updateAiPrompt, deleteAiPrompt } from 'utils/AiPromptAPI'
import { listAiApiKeys } from 'utils/AiApiKeyAPI'
import { useAuth } from 'hooks/AuthContext'

const PROVIDER_LABELS = {
  gemini: 'Gemini',
  claude: 'Claude'
}

const PROMPT_TYPES = {
  'earnings-call-summary': {
    label: '法說會摘要',
    placeholders: ['{stock_id}', '{meeting_date}', '{feeds_content}'],
    description: '分析法說會相關新聞，產生 AI 摘要與評分'
  }
}

const EMPTY_FORM = { name: '', nameType: '', provider: 'gemini', content: '', description: '', is_active: true, api_key_id: '' }

const AiPromptManager = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [prompts, setPrompts] = useState([])
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null) // null = 新增模式
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [deletingId, setDeletingId] = useState(null)

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true)
      const [promptData, keyData] = await Promise.all([listAiPrompts(), listAiApiKeys()])
      setPrompts(Array.isArray(promptData) ? promptData : [])
      setApiKeys(Array.isArray(keyData) ? keyData.filter(k => k.is_active) : [])
      setError(null)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('permission_denied')
      } else {
        setError('載入 AI Prompt 資料失敗')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/')
      return
    }
    fetchPrompts()
  }, [hasRole, navigate, fetchPrompts])

  const openCreate = () => {
    setEditingPrompt(null)
    setForm(EMPTY_FORM)
    setSaveError(null)
    setShowModal(true)
  }

  const openEdit = (prompt) => {
    setEditingPrompt(prompt)
    setForm({
      name: prompt.name,
      nameType: prompt.name,
      provider: prompt.provider || '',
      content: prompt.content,
      description: prompt.description || '',
      is_active: prompt.is_active,
      api_key_id: prompt.api_key_id || ''
    })
    setSaveError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      setSaveError('名稱與 Prompt 內容為必填')
      return
    }
    try {
      setSaving(true)
      setSaveError(null)
      const payload = {
        ...form,
        provider: form.provider || null
      }
      if (editingPrompt) {
        const updated = await updateAiPrompt(editingPrompt.id, {
          content: payload.content,
          description: payload.description,
          is_active: payload.is_active,
          api_key_id: payload.api_key_id || null
        })
        setPrompts(prev => prev.map(p => p.id === updated.id ? updated : p))
      } else {
        const created = await createAiPrompt({
          ...payload,
          api_key_id: payload.api_key_id || null
        })
        setPrompts(prev => [...prev, created])
      }
      setShowModal(false)
    } catch (err) {
      setSaveError(err.response?.data?.error || '儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (prompt) => {
    if (!window.confirm(`確定要刪除「${prompt.name}」(${prompt.provider || '通用'})？`)) return
    try {
      setDeletingId(prompt.id)
      await deleteAiPrompt(prompt.id)
      setPrompts(prev => prev.filter(p => p.id !== prompt.id))
    } catch (err) {
      alert(err.response?.data?.error || '刪除失敗')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (str) => {
    if (!str) return '-'
    return new Date(str).toLocaleString('zh-TW')
  }

  if (loading) {
    return (
      <Container className="py-4">
        <h2>AI Prompt 管理</h2>
        <div className="text-center py-5"><Spinner animation="border" /></div>
      </Container>
    )
  }

  if (error === 'permission_denied') {
    return (
      <Container className="py-4">
        <h2>AI Prompt 管理</h2>
        <Alert variant="danger">權限不足，需要管理員權限。</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">AI Prompt 管理</h2>
        <Button variant="primary" onClick={openCreate}>新增 Prompt</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>用途</th>
            <th>名稱</th>
            <th>Provider</th>
            <th>API Key</th>
            <th>說明</th>
            <th>狀態</th>
            <th>最後更新</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => {
            const typeInfo = PROMPT_TYPES[prompt.name]
            return (
              <tr key={prompt.id}>
                <td>
                  {typeInfo
                    ? <span className="fw-bold">{typeInfo.label}</span>
                    : <span className="text-muted">—</span>}
                </td>
                <td><code style={{ fontSize: '0.82rem' }}>{prompt.name}</code></td>
                <td>
                  {prompt.provider
                    ? <Badge bg="info">{PROVIDER_LABELS[prompt.provider] || prompt.provider}</Badge>
                    : <Badge bg="secondary">通用</Badge>}
                </td>
                <td className="small text-muted">
                  {prompt.api_key_name
                    ? <code style={{ fontSize: '0.8rem' }}>{prompt.api_key_name}</code>
                    : '—'}
                </td>
                <td className="text-muted small">{prompt.description || '-'}</td>
                <td>
                  <Badge bg={prompt.is_active ? 'success' : 'secondary'}>
                    {prompt.is_active ? '啟用' : '停用'}
                  </Badge>
                </td>
                <td className="small">{formatDate(prompt.updated_at || prompt.created_at)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => openEdit(prompt)}
                  >
                    編輯
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(prompt)}
                    disabled={deletingId === prompt.id}
                  >
                    {deletingId === prompt.id ? <Spinner animation="border" size="sm" /> : '刪除'}
                  </Button>
                </td>
              </tr>
            )
          })}
          {prompts.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-muted py-4">尚無 Prompt</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 新增 / 編輯 Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPrompt ? '編輯 Prompt' : '新增 Prompt'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && <Alert variant="danger">{saveError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>用途 <span className="text-danger">*</span></Form.Label>
              {editingPrompt
                ? (
                    <Form.Control
                      value={PROMPT_TYPES[form.name] ? PROMPT_TYPES[form.name].label : form.name}
                      disabled
                    />
                  )
                : (
                    <Form.Select
                      value={form.nameType}
                      onChange={(e) => {
                        const val = e.target.value
                        setForm(f => ({
                          ...f,
                          nameType: val,
                          name: val === '__custom__' ? '' : val,
                          description: val !== '__custom__' && PROMPT_TYPES[val]
                            ? PROMPT_TYPES[val].description
                            : f.description
                        }))
                      }}
                    >
                      <option value="">請選擇用途</option>
                      {Object.entries(PROMPT_TYPES).map(([key, info]) => (
                        <option key={key} value={key}>{info.label}</option>
                      ))}
                      <option value="__custom__">自訂</option>
                    </Form.Select>
                  )}
            </Form.Group>

            {!editingPrompt && form.nameType === '__custom__' && (
              <Form.Group className="mb-3">
                <Form.Label>名稱 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="例：stock-news-summary"
                />
                <Form.Text className="text-muted">建立後無法修改名稱</Form.Text>
              </Form.Group>
            )}

            {editingPrompt && (
              <Form.Group className="mb-3">
                <Form.Label>名稱</Form.Label>
                <Form.Control value={form.name} disabled />
                <Form.Text className="text-muted">建立後無法修改名稱</Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Provider</Form.Label>
              <Form.Select
                value={form.provider}
                onChange={(e) => setForm(f => ({ ...f, provider: e.target.value }))}
                disabled={!!editingPrompt}
              >
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
                <option value="">通用（不指定）</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>API Key</Form.Label>
              <Form.Select
                value={form.api_key_id}
                onChange={(e) => setForm(f => ({ ...f, api_key_id: e.target.value }))}
              >
                <option value="">不指定（使用預設）</option>
                {apiKeys.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.name}{k.owner ? ` (${k.owner})` : ''}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">指定此 Prompt 使用的 API Key，留空使用 Lambda 預設</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>說明</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="簡短說明此 Prompt 的用途"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prompt 內容 <span className="text-danger">*</span></Form.Label>
              {(() => {
                const typeInfo = PROMPT_TYPES[form.name]
                return (
                  <Form.Text className="text-muted d-block mb-1">
                    {typeInfo
                      ? <>可用 placeholder：{typeInfo.placeholders.map((p, i) => (
                        <code key={i} className="me-1">{p}</code>
                      ))}</>
                      : '可在 Prompt 中使用 {placeholder} 格式插入動態內容'
                    }
                  </Form.Text>
                )
              })()}
              <Form.Control
                as="textarea"
                rows={14}
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="switch"
                id="is-active-switch"
                label="啟用"
                checked={form.is_active}
                onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : '儲存'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AiPromptManager
