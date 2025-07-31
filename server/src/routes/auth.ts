import { FastifyInstance } from 'fastify'
import { loginUser, registerUser } from '@services/userService'
import { authMiddleware } from '@plugins/authMiddleware'
import { handleError } from '@utils/handleError'
import { validateRequest } from '@utils/validate'
import { UserInput, UserSchema } from '@shared/schemas/user'

/* eslint-disable @typescript-eslint/require-await */
export async function authRoutes(app: FastifyInstance) {
  /* Register a new user */
  app.post('/register', async (req, reply) => {
    // Validate req body
    const validated = await validateRequest<UserInput>(req, reply, UserSchema)
    if (!validated) return

    try {
      const newUser = await registerUser(app, validated)

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
    // Validate req body
    const validated = await validateRequest<UserInput>(req, reply, UserSchema)
    if (!validated) return

    try {
      const result = await loginUser(app, validated)

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

      const user = req.unsignCookie(req.cookies.session)
      if (!user.valid) {
        return reply.status(401).send({ message: 'Not authenticated' })
      }

      return reply.send(user.value)
    } catch (err) {
      req.log.error(err)
      return reply.status(500).send({ message: 'Internal Server Error' })
    }
  })
}
/* eslint-enable @typescript-eslint/require-await */
