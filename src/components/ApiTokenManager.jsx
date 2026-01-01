import React, { useState, useEffect, useCallback } from 'react'
import {
  Button, Modal, Form, Badge, Alert, Spinner
} from 'react-bootstrap'

import { getTokens, createToken, deleteToken } from 'utils/TokenAPI'
import 'assets/css/ApiTokenManager.css'

const MAX_TOKENS = 3

const ApiTokenManager = () => {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create token modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')

  // Token created modal state
  const [showTokenCreatedModal, setShowTokenCreatedModal] = useState(false)
  const [createdToken, setCreatedToken] = useState(null)
  const [copied, setCopied] = useState(false)

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tokenToDelete, setTokenToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTokens()
      setTokens(data)
      setError(null)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('permission_denied')
      } else {
        setError('無法載入 Token 列表')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  const handleCreateToken = async (e) => {
    e.preventDefault()
    if (!tokenName.trim()) return

    try {
      setCreateLoading(true)
      const data = {
        name: tokenName.trim()
      }
      if (expiresInDays && parseInt(expiresInDays) > 0) {
        data.expires_in_days = parseInt(expiresInDays)
      }
      const newToken = await createToken(data)
      setCreatedToken(newToken)
      setShowCreateModal(false)
      setShowTokenCreatedModal(true)
      setTokenName('')
      setExpiresInDays('')
      fetchTokens()
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || '已達到 Token 數量上限 (3 個)')
      } else if (err.response?.status === 403) {
        alert('權限不足，需要 admin 或 moderator 角色')
      } else {
        alert('建立 Token 失敗')
      }
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteToken = async () => {
    if (!tokenToDelete) return

    try {
      setDeleteLoading(true)
      await deleteToken(tokenToDelete.id)
      setShowDeleteModal(false)
      setTokenToDelete(null)
      fetchTokens()
    } catch (err) {
      alert('刪除 Token 失敗')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCopyToken = async () => {
    if (!createdToken?.token) return

    try {
      await navigator.clipboard.writeText(createdToken.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('複製失敗，請手動複製')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('zh-TW')
  }

  const canCreateMore = tokens.filter(t => t.is_active).length < MAX_TOKENS

  if (loading) {
    return (
      <div className="api-token-manager">
        <h4>API Token 管理</h4>
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </div>
      </div>
    )
  }

  if (error === 'permission_denied') {
    return (
      <div className="api-token-manager">
        <h4>API Token 管理</h4>
        <Alert variant="secondary">
          此功能僅限 admin 或 moderator 角色使用。
          <br />
          <small className="text-muted">API Token 可用於程式自動化存取 Stocker API。</small>
        </Alert>
      </div>
    )
  }

  return (
    <div className="api-token-manager">
      <div className="token-header">
        <h4>API Token 管理</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateMore}
        >
          建立 Token
        </Button>
      </div>

      {!canCreateMore && (
        <Alert variant="info" className="py-2">
          已達到 Token 數量上限 ({MAX_TOKENS} 個)
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="token-list">
        {tokens.length === 0
          ? (
              <div className="empty-state">
                <p>尚未建立任何 API Token</p>
                <p className="small">API Token 可用於程式自動化存取</p>
              </div>
            )
          : (
              tokens.map((token) => (
                <div
                  key={token.id}
                  className={`token-item ${!token.is_active ? 'token-inactive' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span className="token-name">{token.name}</span>
                      {!token.is_active && (
                        <Badge bg="secondary" className="ms-2">已停用</Badge>
                      )}
                    </div>
                    <span className="token-prefix">{token.token_prefix}...</span>
                  </div>
                  <div className="token-meta">
                    <div>建立時間: {formatDate(token.created_at)}</div>
                    <div>最後使用: {formatDate(token.last_used_at)}</div>
                    {token.expires_at && (
                      <div>過期時間: {formatDate(token.expires_at)}</div>
                    )}
                  </div>
                  {token.is_active && (
                    <div className="token-actions">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setTokenToDelete(token)
                          setShowDeleteModal(true)
                        }}
                      >
                        撤銷
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
      </div>

      {/* Create Token Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>建立 API Token</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateToken}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Token 名稱 / 用途</Form.Label>
              <Form.Control
                type="text"
                placeholder="例如：自動化腳本、第三方整合"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                maxLength={100}
                required
              />
              <Form.Text className="text-muted">
                描述這個 Token 的用途，方便日後管理
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>有效天數 (選填)</Form.Label>
              <Form.Control
                type="number"
                placeholder="留空表示永不過期"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                min={1}
                max={365}
              />
              <Form.Text className="text-muted">
                1-365 天，留空表示永不過期
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={createLoading || !tokenName.trim()}
            >
              {createLoading ? <Spinner animation="border" size="sm" /> : '建立'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Token Created Modal */}
      <Modal
        show={showTokenCreatedModal}
        onHide={() => {
          setShowTokenCreatedModal(false)
          setCreatedToken(null)
          setCopied(false)
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Token 建立成功</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            請立即複製此 Token，關閉視窗後將無法再次查看完整內容！
          </Alert>
          <Form.Label>您的 API Token:</Form.Label>
          <div className="token-display">
            {createdToken?.token}
          </div>
          <div className="copy-btn-wrapper">
            <Button
              variant={copied ? 'success' : 'outline-primary'}
              onClick={handleCopyToken}
            >
              {copied ? '已複製!' : '點擊複製'}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowTokenCreatedModal(false)
              setCreatedToken(null)
              setCopied(false)
            }}
          >
            我已複製，關閉視窗
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>確認撤銷 Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>確定要撤銷 Token「{tokenToDelete?.name}」嗎？</p>
          <p className="text-muted small">
            撤銷後，使用此 Token 的所有應用程式將無法繼續存取 API。
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteToken}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner animation="border" size="sm" /> : '撤銷'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApiTokenManager
