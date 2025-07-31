import { useState } from 'react'
import { api } from '@api/api'
import { useAuth } from '@context/AuthContext'
import { UserResponse, UserSchema } from '@shared/schemas/user'
import { AxiosError } from 'axios'

type AuthFormOptions = {
  endpoint: '/login' | '/register'
  onSuccessRedirect?: (data: unknown) => void
}

export const useAuthForm = ({ endpoint, onSuccessRedirect }: AuthFormOptions) => {
  const { setUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'username' | 'password', string>>>(
    {}
  )
  const [validating, setValidating] = useState(false)

  const handleSubmit = () => {
    setValidating(true)
    setFieldErrors({})
    setFormError('')

    const result = UserSchema.safeParse({ username, password })

    if (!result.success) {
      const zodFieldErrors = result.error.flatten().fieldErrors
      setFieldErrors({
        username: zodFieldErrors.username?.[0] || '',
        password: zodFieldErrors.password?.[0] || '',
      })
      setValidating(false)
      return
    }

    api
      .post<UserResponse>(endpoint, result.data, { withCredentials: true })
      .then((res) => {
        setUser(res.data)
        onSuccessRedirect?.(res.data)
      })
      .catch((err: unknown) => {
        console.error(err)

        if ((err as AxiosError).isAxiosError && (err as AxiosError).response?.data) {
          const message = (err as AxiosError<{ message: string }>).response?.data?.message
          setFormError(message || 'Something went wrong')
        } else {
          setFormError('Something went wrong')
        }
      })
      .finally(() => {
        setValidating(false)
      })
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    formError,
    fieldErrors,
    validating,
    handleSubmit,
  }
}
