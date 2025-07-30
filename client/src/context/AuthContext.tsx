import axios from 'axios'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { UserResponse } from '@shared/schemas/user'

type AuthContextType = {
  user: UserResponse | null
  setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get<UserResponse>('/api/me', { withCredentials: true })
      .then((res) => setUser(res.data))
      .then(console.log)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
