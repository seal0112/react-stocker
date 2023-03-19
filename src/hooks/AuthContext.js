import React, { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import * as StockerAPI from '../utils/StockerAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [checkIsLogin, setCheckIsLogin] = useState(false)

  const login = (data) => {
    return StockerAPI.login(data).then(token => {
      localStorage.setItem('access', token.access_token)
      getAccountData()
    })
  }

  const logout = () => {
    return StockerAPI.logout(() => {
      setUser({})
      localStorage.removeItem('access')
    })
  }

  const getAccountData = () => {
    if (user) {
      return user
    } else {
      return StockerAPI.userInfo().then(data => {
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
