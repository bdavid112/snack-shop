import { FastifyInstance } from 'fastify'
import { OrderInput, OrderSchema } from '@shared/schemas/order'
import { handleError } from '@utils/handleError'
import { validateRequest } from '@utils/validate'
import {
  checkoutCart,
  createOrder,
  getAllOrders,
  getUserCart,
  getUserCartItems,
  getUserOrders,
  upsertUserCart,
} from '@services/orderService'
import { authMiddleware } from '@plugins/authMiddleware'

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
      const orders = await getAllOrders(app)
      return reply.send(orders)
    }

    /* Only retrieve user's orders otherwise */
    const orders = await getUserOrders(app, req.user!.id)

    return reply.send(orders)
  })
}

export async function cartRoutes(app: FastifyInstance) {
  /* Get user's active cart */
  app.get('/cart', async (req, reply) => {
    await authMiddleware(req, reply)
    if (reply.sent) return

    try {
      const user = req.user!
      const items = await getUserCartItems(app, user.id)
      return reply.send(items)
    } catch (err) {
      handleError(err, req, reply)
    }
  })

  /* Update or create user's cart */
  app.put('/cart', async (req, reply) => {
    await authMiddleware(req, reply)
    if (reply.sent) return

    const { items } = req.body as { items: { product_id: number; quantity: number }[] }

    if (!items || !Array.isArray(items)) {
      return reply.status(400).send({ error: 'Invalid items format' })
    }

    try {
      const updatedCart = await upsertUserCart(app, req.user!.id, items)
      return reply.send(updatedCart)
    } catch (err) {
      handleError(err, req, reply)
    }
  })

  /* Checkout user's cart */
  app.post('/cart/checkout', async (req, reply) => {
    await authMiddleware(req, reply)
    if (reply.sent) return

    const { total } = req.body as { total: number }

    if (typeof total !== 'number' || total < 0) {
      return reply.status(400).send({ error: 'Invalid total amount' })
    }

    try {
      const completedOrder = await checkoutCart(app, req.user!.id, total)
      return reply.status(201).send(completedOrder)
    } catch (err) {
      handleError(err, req, reply)
    }
  })
}
/* eslint-enable @typescript-eslint/require-await */
