import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUser } from '../lib/authClient'

export default function AdminRoute({ children }){
  const user = getUser()
  if (!user) return <Navigate to="/auth" replace />
  if (user.role !== 'admin') return <div className="container py-6">Unauthorized</div>
  return children
}