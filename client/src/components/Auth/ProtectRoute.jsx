import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = ({ children, user, redirect = '/login', allowedRoles }) => {
  if(user)
    return <Navigate to={'/'} />
  if (!user) {
    return <Navigate to={redirect} />
  }
  return children ? children : <Outlet />
}

export default ProtectRoute
