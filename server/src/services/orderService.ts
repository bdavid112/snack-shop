import { FastifyInstance } from 'fastify'
import { OrderInput } from '@shared/schemas/order'

/* Get orders of a user */
export async function getUserOrders(app: FastifyInstance, userId: number) {
  return await app.prisma.order.findMany({ where: { user_id: userId }, include: { items: true } }) // Send back items array in reply
}

/* Get all orders */
export async function getAllOrders(app: FastifyInstance) {
  return await app.prisma.order.findMany({ include: { items: true } }) // Send back items array in reply
}

/* Create order */
export async function createOrder(app: FastifyInstance, input: OrderInput) {
  const { user_id, total, items } = input

  return await app.prisma.order.create({
    data: {
      user_id,
      total,
      items: {
        create: items,
      },
    },
    include: {
      items: true, // Send back items array in reply
    },
  })
}
