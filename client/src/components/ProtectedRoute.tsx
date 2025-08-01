import { Navigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { JSX } from 'react'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  console.log('ProtectedRoute user:', user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
