import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

import * as AuthAPI from '../utils/AuthAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (data) => {
    return AuthAPI.login(data).then(token => {
      localStorage.setItem('access', token.access_token)
      getAccountData()
    })
  }

  const logout = () => {
    return AuthAPI.logout(() => {
      setUser({})
      localStorage.removeItem('access')
    })
  }

  const getAccountData = () => {
    if (user) {
      return user
    } else {
      return AuthAPI.userInfo().then(data => {
        if (data) {
          setUser(data)
        }
        return data
      })
    }
  }

  const value = { user, login, logout, getAccountData }

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
