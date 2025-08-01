import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@components/Button/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@components/Card'
import { Input } from '@components/Input'
import { useAuth } from '@context/AuthContext'
import { useAuthForm } from '@hooks/useAuthForm'

export const LoginPage = () => {
  const { user } = useAuth()

  const {
    username,
    setUsername,
    password,
    setPassword,
    fieldErrors,
    formError,
    validating,
    handleSubmit,
  } = useAuthForm({ endpoint: '/login' })

  const [scaleUpTitle, setScaleUpTitle] = useState(false)
  const [slideUpTitle, setSlideUpTitle] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const runAnimation = async () => {
      await new Promise((r) => setTimeout(r, 100))
      setScaleUpTitle(true)

      await new Promise((r) => setTimeout(r, 600))
      setSlideUpTitle(true)

      await new Promise((r) => setTimeout(r, 400))
      setShowForm(true)
    }

    void runAnimation()
  }, [])

  if (user) {
    return <Navigate to="/products" replace />
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center px-4 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{
          opacity: scaleUpTitle ? 1 : 0,
          scale: scaleUpTitle ? 1 : 0.8,
          y: slideUpTitle ? -160 : 0,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        }}
        className="absolute text-center text-white text-displaySm font-[Praise] font-normal"
      >
        Snack Shop
      </motion.h1>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-sm mt-28"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="w-full"
              autoComplete="on"
              noValidate
            >
              <Card variant="elevated" className="w-full">
                <CardHeader className="text-center">
                  <p className="font-bold text-h4 leading-h4 text-primary">Login</p>
                </CardHeader>

                <CardBody>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="username"
                      label="Username"
                      size="sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      helperText={fieldErrors.username}
                      state={formError || fieldErrors.username ? 'error' : 'default'}
                      autoComplete="username"
                      required
                    />
                    <Input
                      id="password"
                      label="Password"
                      type="password"
                      size="sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      helperText={fieldErrors.password}
                      state={
                        formError || fieldErrors.password
                          ? 'error'
                          : validating
                            ? 'validating'
                            : 'default'
                      }
                      autoComplete="current-password"
                      required
                    />
                    {formError && (
                      <span className="mt-2 text-xs text-red-600 text-destructive">
                        {formError}
                      </span>
                    )}
                  </div>
                </CardBody>

                <CardFooter className="text-center">
                  <Button
                    disabled={validating}
                    size="sm"
                    className="w-full"
                    shape="pill"
                    type="submit"
                  >
                    {validating ? 'Logging in…' : 'Login'}
                  </Button>
                  <span className="block mt-6 text-sm leading-sm">
                    Don’t have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                      Register
                    </Link>
                  </span>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoginPage
