import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../plugins/authMiddleware'

/* eslint-disable @typescript-eslint/require-await */
export default async function orderRoutes(app: FastifyInstance) {
  /* Create new order */
  app.post('/orders', async (req, reply) => {
    await authMiddleware(req, reply)
    return reply.send({ user: req.user })
  })

  /* List all orders */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/orders', async (req, reply) => {
    /* TODO */
  })
}
/* eslint-enable @typescript-eslint/require-await */
