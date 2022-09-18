import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import * as StockerAPI from '../utils/StockerAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [checkIsLogin, setCheckIsLogin] = useState(false)

  const login = (data) => {
    return StockerAPI.login(data).then(token => {
      sessionStorage.setItem('access', token.access)
      sessionStorage.setItem('refresh', token.refresh)
      getAccountData()
    })
  }

  const logout = () => {
    return StockerAPI.logout(() => {
      setUser({})
      sessionStorage.removeItem('access')
    })
  }

  const getAccountData = () => {
    if (user) {
      return user
    } else {
      return StockerAPI.checkAuth().then(data => {
        setUser(data)
      }).finally(() => {
        setCheckIsLogin(true)
      })
    }
  }

  const value = { user, checkIsLogin, login, logout, getAccountData }

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
