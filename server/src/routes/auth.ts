import { FastifyInstance } from 'fastify'
import { loginUser, registerUser } from '../services'
import { authMiddleware } from '../plugins'
import { handleError } from '../utils'

/* eslint-disable @typescript-eslint/require-await */
export async function authRoutes(app: FastifyInstance) {
  /* Register a new user */
  app.post('/register', async (req, reply) => {
    // Input data
    const { username, password } = req.body as {
      username: string
      password: string
    }

    try {
      const newUser = await registerUser(app, username, password)

      /* Respond with success */
      return reply.status(201).send({ message: 'User created', userId: newUser.id })
    } catch (err) {
      handleError(err, req, reply, {
        'Username already taken': { statusCode: 409 },
      })
    }
  })

  /* Login */
  app.post('/login', async (req, reply) => {
    // Input credentials
    const { username, password } = req.body as {
      username: string
      password: string
    }

    try {
      const result = await loginUser(app, username, password)

      if (!result.authenticated) return reply.status(401).send({ message: 'Not authenticated' })

      /* Set a signed cookie */
      reply.setCookie('session', JSON.stringify({ id: result.id, isAdmin: result.isAdmin }), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        signed: true,
        maxAge: 60 * 60 * 24, // 1 day
      })

      return reply.send(result)
    } catch (err) {
      handleError(err, req, reply, {
        'No user with this username': { statusCode: 401 },
      })
    }
  })

  /* Logout */
  app.post('/logout', async (req, reply) => {
    await authMiddleware(req, reply)
    reply.clearCookie('session', {
      path: '/',
    })

    return reply.send({ message: `Logged out successfully` })
  })

  /* Check if user is logged in and send their data if yes */
  app.get('/me', async (req, reply) => {
    try {
      await authMiddleware(req, reply)

      const raw = req.cookies.session
      if (!raw) return reply.status(401).send({ message: 'Not authenticated' })

      // Remove the "s:" prefix and signature
      const signed = raw.slice(2) // remove "s:"
      const jsonStr = signed.split('.')[0] // before the first '.'

      const user = JSON.parse(jsonStr)
      return reply.send(user)
    } catch (err) {
      req.log.error(err)
      return reply.status(500).send({ message: 'Internal Server Error' })
    }
  })
}
/* eslint-enable @typescript-eslint/require-await */
