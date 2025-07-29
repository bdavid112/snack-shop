import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../plugins'
import { createOrder, getAllOrders, getUserOrders } from '../services'
import { OrderInput, OrderSchema } from '../types'
import { validateRequest } from '../utils'
import { handleError } from '../utils'

/* eslint-disable @typescript-eslint/require-await */
export async function orderRoutes(app: FastifyInstance) {
  /* Create new order */
  app.post('/orders', async (req, reply) => {
    await authMiddleware(req, reply)

    // Validate req body
    const validated = await validateRequest<OrderInput>(req, reply, OrderSchema)
    if (!validated) return

    try {
      const order = await createOrder(app, validated)

      return reply.status(201).send(order)
    } catch (err) {
      handleError(err, req, reply)
    }
  })

  /* List all orders (admin only) */

  app.get('/orders', async (req, reply) => {
    /* Check auth */
    await authMiddleware(req, reply)

    /* Retrieve all orders if user is admin */
    if (req.user?.isAdmin) {
      const orders = getAllOrders(app)
      return reply.send(orders)
    }

    /* Only retrieve user's orders otherwise */
    const orders = await getUserOrders(app, req.user!.id)

    return reply.send(orders)
  })
}
/* eslint-enable @typescript-eslint/require-await */
