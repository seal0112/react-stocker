import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from 'hooks/AuthContext'

const RequireAuth = ({ redirectPath = '/login' }) => {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

RequireAuth.propTypes = {
  redirectPath: PropTypes.string
}

export default RequireAuth
