import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import * as StockerAPI from './utils/StockerAPI'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null)
  const [checkIsLogin, setCheckIsLogin] = useState(false)

  const login = (data, callback) => {
    return StockerAPI.login(data).then(token => {
      sessionStorage.setItem('access', token.access)
      sessionStorage.setItem('refresh', token.refresh)
      getAccountData(callback)
    })
  }

  const getAccountData = (callback) => {
    if (user) {
      return user
    } else {
      return StockerAPI.checkAuth().then(data => {
        setUser(data)
        callback()
      }).finally(() => {
        setCheckIsLogin(true)
      })
    }
  }

  const logout = () => {
    sessionStorage.removeItem('access')
    user = {}
    return StockerAPI.logout(() => {
      setUser({})
      sessionStorage.removeItem('access')
    })
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

export { AuthContext, AuthProvider }
