import { FastifyInstance } from 'fastify'
import { loginUser, registerUser } from '../services/userService'
import { authMiddleware } from '../plugins/authMiddleware'

/* eslint-disable @typescript-eslint/require-await */
export default async function authRoutes(app: FastifyInstance) {
  /* Register a new user */
  app.post('/register', async (req, reply) => {
    const { username, password } = req.body as {
      username: string
      password: string
    }

    try {
      const newUser = await registerUser(app, username, password)

      /* Respond with success */
      return reply.status(201).send({ message: 'User created', userId: newUser.id })
    } catch (err) {
      req.log.error(err)

      if (err instanceof Error) {
        if (err.message === 'Username already taken') {
          return reply.status(409).send({ message: err.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }

      return reply.status(500).send({ message: 'Unexpected error' })
    }
  })

  /* Login */
  app.post('/login', async (req, reply) => {
    const { username, password } = req.body as {
      username: string
      password: string
    }

    try {
      const result = await loginUser(app, username, password)

      if (!result.authenticated) return reply.status(401).send({ message: 'Not authenticated' })

      /* Set a signed cookie */
      reply.setCookie('session', JSON.stringify({ username, isAdmin: result.isAdmin }), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        signed: true,
        maxAge: 60 * 60 * 24, // 1 day
      })

      return reply.send(result)
    } catch (err) {
      req.log.error(err)

      if (err instanceof Error) {
        if (err.message === 'No user with this username') {
          return reply.status(401).send({ message: 'Not authenticated' })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }

      return reply.status(500).send({ message: 'Unexpected error' })
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
}
/* eslint-enable @typescript-eslint/require-await */
