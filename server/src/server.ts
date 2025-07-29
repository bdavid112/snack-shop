import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import * as signature from 'cookie-signature'
import cors from '@fastify/cors'
import { authRoutes, productRoutes, orderRoutes } from './routes'
import { prisma } from './plugins'

export async function buildServer() {
  const app = Fastify({
    logger:
      process.env.NODE_ENV === 'test'
        ? { level: 'silent' } // or false to silence completely
        : { level: 'info' },
  })

  /* Register core plugins */
  app.register(cors, {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })

  /* Override Cookie signing for testing */
  app.register(cookie, {
    secret: {
      sign: (value) =>
        's:' + signature.sign(value, process.env.COOKIE_SECRET || 'super-secret-key'),
      unsign: (value) => {
        if (!value.startsWith('s:')) {
          return { valid: false, renew: false, value: null }
        }

        const str = value.slice(2)
        const unsigned = signature.unsign(str, process.env.COOKIE_SECRET || 'super-secret-key')

        if (unsigned === false) {
          return { valid: false, renew: false, value: null }
        }

        return { valid: true, renew: false, value: unsigned }
      },
    },
  })

  app.register(prisma)

  /* Register routes */
  app.register(authRoutes, { prefix: '/api' })
  app.register(productRoutes, { prefix: '/api' })
  app.register(orderRoutes, { prefix: '/api' })

  await app.ready()

  return app
}
