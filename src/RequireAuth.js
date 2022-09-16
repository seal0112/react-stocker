import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const RequireAuth = ({ redirectPath = '/login' }) => {
  const auth = useContext(AuthContext)
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <Outlet />
}

RequireAuth.propTypes = {
  redirectPath: PropTypes.string
}

export default RequireAuth
