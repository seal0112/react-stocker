import React, { useState, useEffect, useCallback } from 'react'
import {
  Container, Table, Button, Modal, Form, Badge, Alert, Spinner, Pagination
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { getAllUsers, getAllRoles, updateUserRoles, updateUserStatus } from 'utils/UserManagementAPI'
import { useAuth } from 'hooks/AuthContext'
import 'assets/css/AdminUserManagement.css'

// Role name translations
const ROLE_LABELS = {
  admin: '管理員',
  moderator: '協同管理',
  user: '一般使用者'
}

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100]

const getRoleLabel = (roleName) => ROLE_LABELS[roleName] || roleName

const AdminUserManagement = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [saveLoading, setSaveLoading] = useState(false)

  // Status update loading state
  const [statusLoading, setStatusLoading] = useState({})

  const fetchUsers = useCallback(async (page, size) => {
    try {
      setLoading(true)
      const usersData = await getAllUsers(page, size)
      setUsers(usersData.data || [])
      setTotalUsers(usersData.total || 0)
      setTotalPages(usersData.pages || Math.ceil((usersData.total || 0) / size))
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

  const fetchRoles = useCallback(async () => {
    try {
      const rolesData = await getAllRoles()
      setRoles(rolesData.data || [])
    } catch (err) {
      console.error('Failed to fetch roles:', err)
    }
  }, [])

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/')
      return
    }
    fetchRoles()
  }, [hasRole, navigate, fetchRoles])

  useEffect(() => {
    if (hasRole('admin')) {
      fetchUsers(currentPage, perPage)
    }
  }, [currentPage, perPage, hasRole, fetchUsers])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value, 10)
    setPerPage(newPerPage)
    setCurrentPage(1) // Reset to first page when changing page size
  }

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
      const updatedUser = await updateUserRoles(editingUser.id, selectedRoles)
      setShowEditModal(false)
      setEditingUser(null)
      // Update local state
      setUsers(prev => prev.map(u =>
        u.id === updatedUser.id ? { ...u, roles: updatedUser.roles } : u
      ))
    } catch (err) {
      alert(err.response?.data?.error || '更新角色失敗')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleStatusToggle = async (user) => {
    const newStatus = !user.active
    try {
      setStatusLoading(prev => ({ ...prev, [user.id]: true }))
      await updateUserStatus(user.id, newStatus)
      // Update local state without refetching
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, active: newStatus } : u
      ))
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

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const items = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    )
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    )

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />)
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      )
    }

    if (endPage < totalPages) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />)
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    )
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    )

    return <Pagination className="mb-0">{items}</Pagination>
  }

  if (loading && users.length === 0) {
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <span className="me-2">每頁顯示：</span>
          <Form.Select
            size="sm"
            value={perPage}
            onChange={handlePerPageChange}
            style={{ width: 'auto' }}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size} 筆</option>
            ))}
          </Form.Select>
          <span className="ms-3 text-muted">
            共 {totalUsers} 位使用者
          </span>
        </div>
        {loading && <Spinner animation="border" size="sm" />}
      </div>

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

      {users.length === 0 && !loading && (
        <div className="text-center py-4 text-muted">
          沒有找到使用者
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
        {renderPagination()}
      </div>

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
