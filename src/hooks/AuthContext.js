import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

import * as AuthAPI from 'utils/AuthAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (data) => {
    return AuthAPI.login(data).then(() => {
      getAccountData()
    })
  }

  const logout = () => {
    return AuthAPI.logout().then(() => {
      setUser({})
    })
  }

  const getAccountData = () => {
    if (user) {
      return Promise.resolve(user)
    } else {
      return AuthAPI.userInfo().then(data => {
        if (data) {
          setUser(data)
        }
        return data
      })
    }
  }

  const hasRole = (roleName) => {
    return user?.roles?.includes(roleName) || false
  }

  const canManageTokens = () => {
    return hasRole('admin') || hasRole('moderator')
  }

  const value = { user, login, logout, getAccountData, hasRole, canManageTokens }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired
}

export const useAuth = () => {
  return useContext(AuthContext)
}
