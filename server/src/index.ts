import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import cors from 'fastify-cors'
import authRoutes from './routes/auth'
import productRoutes from './routes/product'
import orderRoutes from './routes/orders'

const app = Fastify({ logger: true })

/* Register core plugins */
app.register(cors, { origin: true, credentials: true })
app.register(cookie)

/* Register route files */
app.register(authRoutes, { prefix: '/api' })
app.register(productRoutes, { prefix: '/api' })
app.register(orderRoutes, { prefix: '/api' })

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
