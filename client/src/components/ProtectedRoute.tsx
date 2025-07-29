import { Navigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { JSX } from 'react'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    // You can customize this with a spinner or skeleton if desired
    return <div>Loading...</div>
  }

  if (!user?.authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
