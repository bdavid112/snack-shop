import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import prismaPlugin from './plugins/prisma'
import cors from '@fastify/cors'
import authRoutes from './routes/auth'
import productRoutes from './routes/product'
import orderRoutes from './routes/orders'

const app = Fastify({ logger: true })

/* Register core plugins */
app.register(cors, {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
})
app.register(cookie)
app.register(prismaPlugin)

/* Register route files */
app.register(authRoutes, { prefix: '/api' })
app.register(productRoutes, { prefix: '/api' })
app.register(orderRoutes, { prefix: '/api' })

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    app.log.info('🚀 Server is running at http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
