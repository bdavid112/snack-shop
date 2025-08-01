import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import multipart from '@fastify/multipart'
import * as signature from 'cookie-signature'
import cors from '@fastify/cors'
import { authRoutes } from '@routes/auth'
import { prisma } from './plugins'
import { cartRoutes, orderRoutes } from '@routes/orders'
import { productRoutes } from '@routes/products'
import fastifyStatic from '@fastify/static'
import path from 'path'

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
  app.register(multipart)
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
    prefix: '/',
  })

  /* Register routes */
  app.register(authRoutes, { prefix: '/api' })
  app.register(productRoutes, { prefix: '/api' })
  app.register(orderRoutes, { prefix: '/api' })
  app.register(cartRoutes, { prefix: '/api' })

  await app.ready()

  return app
}
