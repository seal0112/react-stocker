import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Button, Modal, Form, Badge, Alert, Spinner
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { getAllUsers, getAllRoles, updateUserRoles, updateUserStatus } from 'utils/UserManagementAPI'
import { useAuth } from 'hooks/AuthContext'
import 'assets/css/AdminUserManagement.css'

// Role name translations
const ROLE_LABELS = {
  admin: '管理員',
  moderator: '版主',
  user: '一般使用者'
}

const getRoleLabel = (roleName) => ROLE_LABELS[roleName] || roleName

const AdminUserManagement = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [saveLoading, setSaveLoading] = useState(false)

  // Status update loading state
  const [statusLoading, setStatusLoading] = useState({})

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [usersData, rolesData] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ])
      setUsers(usersData.data || [])
      setRoles(rolesData.data || [])
      setError(null)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('permission_denied')
      } else {
        setError('載入使用者資料失敗')
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
    fetchData()
  }, [fetchData, hasRole, navigate])

  const handleEditClick = (user) => {
    setEditingUser(user)
    setSelectedRoles(user.roles || [])
    setShowEditModal(true)
  }

  const handleRoleToggle = (roleName) => {
    if (roleName === 'user') return // Cannot remove user role

    setSelectedRoles(prev => {
      if (prev.includes(roleName)) {
        return prev.filter(r => r !== roleName)
      } else {
        return [...prev, roleName]
      }
    })
  }

  const handleSaveRoles = async () => {
    if (!editingUser) return

    try {
      setSaveLoading(true)
      await updateUserRoles(editingUser.id, selectedRoles)
      setShowEditModal(false)
      setEditingUser(null)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || '更新角色失敗')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleStatusToggle = async (user) => {
    try {
      setStatusLoading(prev => ({ ...prev, [user.id]: true }))
      await updateUserStatus(user.id, !user.active)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || '更新狀態失敗')
    } finally {
      setStatusLoading(prev => ({ ...prev, [user.id]: false }))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('zh-TW')
  }

  const getRoleBadgeVariant = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'danger'
      case 'moderator':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <Container className="admin-user-management">
        <h2>使用者管理</h2>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </Container>
    )
  }

  if (error === 'permission_denied') {
    return (
      <Container className="admin-user-management">
        <h2>使用者管理</h2>
        <Alert variant="danger">
          權限不足，需要管理員權限。
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="admin-user-management">
      <h2>使用者管理</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="user-table-wrapper">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>使用者名稱</th>
              <th>Email</th>
              <th>角色</th>
              <th>狀態</th>
              <th>最後登入</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.profile_pic && (
                    <img
                      src={user.profile_pic}
                      alt=""
                      className="user-avatar"
                    />
                  )}
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td>
                  {user.roles?.map((role) => (
                    <Badge
                      key={role}
                      bg={getRoleBadgeVariant(role)}
                      className="me-1"
                    >
                      {getRoleLabel(role)}
                    </Badge>
                  ))}
                </td>
                <td>
                  <Badge bg={user.active ? 'success' : 'secondary'}>
                    {user.active ? '啟用' : '停用'}
                  </Badge>
                </td>
                <td>{formatDate(user.last_login_at)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                    className="me-1"
                  >
                    編輯角色
                  </Button>
                  <Button
                    variant={user.active ? 'outline-secondary' : 'outline-success'}
                    size="sm"
                    onClick={() => handleStatusToggle(user)}
                    disabled={statusLoading[user.id]}
                  >
                    {statusLoading[user.id]
                      ? <Spinner animation="border" size="sm" />
                      : user.active ? '停用帳號' : '啟用帳號'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-4 text-muted">
          沒有找到使用者
        </div>
      )}

      {/* Edit Roles Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>編輯使用者角色</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <>
              <p className="mb-3">
                <strong>使用者：</strong> {editingUser.username}
                <br />
                <strong>Email：</strong> {editingUser.email}
              </p>
              <Form>
                {roles.map((role) => (
                  <Form.Check
                    key={role.id}
                    type="checkbox"
                    id={`role-${role.id}`}
                    label={
                      <span>
                        <Badge bg={getRoleBadgeVariant(role.name)} className="me-2">
                          {getRoleLabel(role.name)}
                        </Badge>
                        {role.description && (
                          <small className="text-muted">{role.description}</small>
                        )}
                      </span>
                    }
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleToggle(role.name)}
                    disabled={role.name === 'user'}
                    className="mb-2"
                  />
                ))}
                <Form.Text className="text-muted">
                  「一般使用者」角色無法移除。
                </Form.Text>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveRoles}
            disabled={saveLoading}
          >
            {saveLoading ? <Spinner animation="border" size="sm" /> : '儲存'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminUserManagement
