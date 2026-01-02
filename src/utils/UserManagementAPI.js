import { createApiRequest } from 'utils/DomainSetup'

const usersRequest = createApiRequest('/api/v1/users')
const rolesRequest = createApiRequest('/api/v1/roles')

export const getAllUsers = (page, perPage) => {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (perPage) params.append('per_page', perPage)
  const queryString = params.toString()
  return usersRequest.get(queryString ? `?${queryString}` : '')
    .then((res) => res.data)
}

export const getUserById = (userId) =>
  usersRequest.get(`/${userId}`)
    .then((res) => res.data)

export const updateUserRoles = (userId, roleNames) =>
  usersRequest.patch(`/${userId}/roles`, { role_names: roleNames })
    .then((res) => res.data)

export const updateUserStatus = (userId, active) =>
  usersRequest.patch(`/${userId}/status`, { active })
    .then((res) => res.data)

export const getAllRoles = () =>
  rolesRequest.get('')
    .then((res) => res.data)
