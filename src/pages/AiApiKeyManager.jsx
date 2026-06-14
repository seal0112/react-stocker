import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Button, Modal, Form, Badge, Alert, Spinner
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { listAiApiKeys, createAiApiKey, updateAiApiKey, deleteAiApiKey } from 'utils/AiApiKeyAPI'
import { useAuth } from 'hooks/AuthContext'

const PROVIDER_LABELS = { gemini: 'Gemini', claude: 'Claude' }
const PROVIDER_BADGE = { gemini: 'info', claude: 'secondary' }

const EMPTY_FORM = {
  name: '', provider: 'gemini', owner: '', key_value: '', is_active: true
}

const AiApiKeyManager = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listAiApiKeys()
      setKeys(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError(err.response?.status === 403 ? 'permission_denied' : '載入失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasRole('admin')) { navigate('/'); return }
    fetchKeys()
  }, [hasRole, navigate, fetchKeys])

  const openCreate = () => {
    setEditingKey(null)
    setForm(EMPTY_FORM)
    setSaveError(null)
    setShowModal(true)
  }

  const openEdit = (key) => {
    setEditingKey(key)
    setForm({
      name: key.name,
      provider: key.provider,
      owner: key.owner || '',
      key_value: '',
      is_active: key.is_active
    })
    setSaveError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!editingKey && (!form.name.trim() || !form.key_value.trim())) {
      setSaveError('名稱與 API Key 值為必填')
      return
    }
    try {
      setSaving(true)
      setSaveError(null)
      if (editingKey) {
        const payload = { owner: form.owner, is_active: form.is_active }
        if (form.key_value.trim()) payload.key_value = form.key_value
        const updated = await updateAiApiKey(editingKey.id, payload)
        setKeys(prev => prev.map(k => k.id === updated.id ? updated : k))
      } else {
        const created = await createAiApiKey(form)
        setKeys(prev => [...prev, created])
      }
      setShowModal(false)
    } catch (err) {
      setSaveError(err.response?.data?.error || '儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (key) => {
    if (!window.confirm(`確定要刪除「${key.name}」？此操作同時會刪除 SSM 中的 key 值。`)) return
    try {
      setDeletingId(key.id)
      await deleteAiApiKey(key.id)
      setKeys(prev => prev.filter(k => k.id !== key.id))
    } catch (err) {
      alert(err.response?.data?.error || '刪除失敗')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (str) => str ? new Date(str).toLocaleString('zh-TW') : '-'

  if (loading) {
    return (
      <Container className="py-4">
        <h2>API Key 管理</h2>
        <div className="text-center py-5"><Spinner animation="border" /></div>
      </Container>
    )
  }

  if (error === 'permission_denied') {
    return (
      <Container className="py-4">
        <h2>API Key 管理</h2>
        <Alert variant="danger">權限不足，需要管理員權限。</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">API Key 管理</h2>
        <Button variant="primary" onClick={openCreate}>新增 Key</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>名稱</th>
            <th>Provider</th>
            <th>擁有者</th>
            <th>SSM 路徑</th>
            <th>狀態</th>
            <th>建立時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td><strong>{key.name}</strong></td>
              <td>
                <Badge bg={PROVIDER_BADGE[key.provider] || 'secondary'}>
                  {PROVIDER_LABELS[key.provider] || key.provider}
                </Badge>
              </td>
              <td className="text-muted">{key.owner || '-'}</td>
              <td><code style={{ fontSize: '0.8rem' }}>{key.ssm_path}</code></td>
              <td>
                <Badge bg={key.is_active ? 'success' : 'secondary'}>
                  {key.is_active ? '啟用' : '停用'}
                </Badge>
              </td>
              <td className="small">{formatDate(key.created_at)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => openEdit(key)}
                >
                  編輯
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(key)}
                  disabled={deletingId === key.id}
                >
                  {deletingId === key.id ? <Spinner animation="border" size="sm" /> : '刪除'}
                </Button>
              </td>
            </tr>
          ))}
          {keys.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">尚無 API Key</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingKey ? '編輯 API Key' : '新增 API Key'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && <Alert variant="danger">{saveError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>名稱 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="例：userb-gemini-test"
                disabled={!!editingKey}
              />
              {!editingKey && (
                <Form.Text className="text-muted">
                  SSM 路徑將自動設為 /stocker/ai_key/{'{'名稱{'}'}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Provider <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.provider}
                onChange={(e) => setForm(f => ({ ...f, provider: e.target.value }))}
                disabled={!!editingKey}
              >
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>擁有者</Form.Label>
              <Form.Control
                value={form.owner}
                onChange={(e) => setForm(f => ({ ...f, owner: e.target.value }))}
                placeholder="例：User B"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                API Key 值
                {!editingKey && <span className="text-danger"> *</span>}
              </Form.Label>
              <Form.Control
                type="password"
                value={form.key_value}
                onChange={(e) => setForm(f => ({ ...f, key_value: e.target.value }))}
                placeholder={editingKey ? '留空則不更新 key 值' : '輸入實際的 API Key'}
              />
              <Form.Text className="text-muted">值會加密存入 AWS SSM Parameter Store</Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="switch"
                id="key-active-switch"
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

export default AiApiKeyManager
