import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Button, Modal, Form, Badge, Alert, Spinner
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { listAiPrompts, createAiPrompt, updateAiPrompt, deleteAiPrompt } from 'utils/AiPromptAPI'
import { useAuth } from 'hooks/AuthContext'

const PROVIDER_LABELS = {
  gemini: 'Gemini',
  claude: 'Claude',
}

const PLACEHOLDER_HINT = '可用 placeholder：{stock_id}、{meeting_date}、{feeds_content}'

const EMPTY_FORM = { name: '', provider: 'gemini', content: '', description: '', is_active: true }

const AiPromptManager = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [prompts, setPrompts] = useState([])
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
      const data = await listAiPrompts()
      setPrompts(Array.isArray(data) ? data : [])
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
      provider: prompt.provider || '',
      content: prompt.content,
      description: prompt.description || '',
      is_active: prompt.is_active,
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
        provider: form.provider || null,
      }
      if (editingPrompt) {
        const updated = await updateAiPrompt(editingPrompt.id, {
          content: payload.content,
          description: payload.description,
          is_active: payload.is_active,
        })
        setPrompts(prev => prev.map(p => p.id === updated.id ? updated : p))
      } else {
        const created = await createAiPrompt(payload)
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
            <th>名稱</th>
            <th>Provider</th>
            <th>說明</th>
            <th>狀態</th>
            <th>最後更新</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt.id}>
              <td><code>{prompt.name}</code></td>
              <td>
                {prompt.provider
                  ? <Badge bg="info">{PROVIDER_LABELS[prompt.provider] || prompt.provider}</Badge>
                  : <Badge bg="secondary">通用</Badge>}
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
          ))}
          {prompts.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">尚無 Prompt</td>
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
              <Form.Label>名稱 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="例：earnings-call-summary"
                disabled={!!editingPrompt}
              />
              <Form.Text className="text-muted">建立後無法修改名稱</Form.Text>
            </Form.Group>

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
              <Form.Label>說明</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="簡短說明此 Prompt 的用途"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prompt 內容 <span className="text-danger">*</span></Form.Label>
              <Form.Text className="text-muted d-block mb-1">{PLACEHOLDER_HINT}</Form.Text>
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
