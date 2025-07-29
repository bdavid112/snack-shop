import { useAuth } from '@context/AuthContext'
import { api } from 'api/api'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export const LoginPage = () => {
  const { user, setUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user?.authenticated) {
    return <Navigate to="/products" replace />
  }

  const handleLogin = () => {
    api
      .post('/login', { username, password }, { withCredentials: true })
      .then((res) => {
        setUser(res.data) // <-- this updates the context
      })
      .catch((err) => {
        console.error(err)
        setError('Login failed')
      })
  }

  return (
    <div className="p-4">
      <h1>Login Page</h1>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="username">Username</label>
        <input
          className="border"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          className="border"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <button className="p-2 mt-4 text-white bg-blue-500 border" onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default LoginPage
