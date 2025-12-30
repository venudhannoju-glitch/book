import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUser } from '../lib/authClient'

export default function ProtectedRoute({ children }){
  const user = getUser()
  if (!user) return <Navigate to="/auth" replace />
  return children
}