import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma'
import authRoutes from './routes/auth'
import productRoutes from './routes/product'
import orderRoutes from './routes/orders'

export async function buildServer() {
  const app = Fastify({ logger: true })

  /* Register core plugins */
  app.register(cors, {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
  app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'super-secret-key',
    parseOptions: {},
  })
  app.register(prismaPlugin)

  /* Register routes */
  app.register(authRoutes, { prefix: '/api' })
  app.register(productRoutes, { prefix: '/api' })
  app.register(orderRoutes, { prefix: '/api' })

  await app.ready()

  return app
}
