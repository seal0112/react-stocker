import { createApiRequest } from 'utils/DomainSetup'

const usersRequest = createApiRequest('/api/v1/users')
const rolesRequest = createApiRequest('/api/v1/roles')

export const getAllUsers = () =>
  usersRequest.get('')
    .then((res) => res.data)

export const getUserById = (userId) =>
  usersRequest.get(`/${userId}`)
    .then((res) => res.data)

export const updateUserRoles = (userId, roleNames) =>
  usersRequest.patch(`/${userId}/roles`, { role_names: roleNames })
    .then((res) => res.data)

export const getAllRoles = () =>
  rolesRequest.get('')
    .then((res) => res.data)
