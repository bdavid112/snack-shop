import { FastifyInstance } from 'fastify'
import { OrderInput } from '@shared/schemas/order'

/* Get all completed orders of a user */
export async function getUserOrders(app: FastifyInstance, userId: number) {
  return await app.prisma.order.findMany({
    where: { user_id: userId, status: 'completed' },
    include: { items: { include: { product: true } } },
  })
}

/* Get all completed orders */
export async function getAllOrders(app: FastifyInstance) {
  return await app.prisma.order.findMany({
    where: { status: 'completed' },
    include: { items: { include: { product: true } } },
  })
}

/* Get user's active cart */
export async function getUserCart(app: FastifyInstance, userId: number) {
  return await app.prisma.order.findFirst({
    where: { user_id: userId, status: 'cart' },
    include: { items: { include: { product: true } } },
  })
}

export async function getUserCartItems(app: FastifyInstance, userId: number) {
  const cart = await getUserCart(app, userId)
  return cart?.items ?? []
}

/* Create or update user's cart */
export async function upsertUserCart(
  app: FastifyInstance,
  userId: number,
  items: { product_id: number; quantity: number }[]
) {
  const existingCart = await getUserCart(app, userId)

  if (existingCart) {
    // Remove existing cart items
    await app.prisma.orderItem.deleteMany({ where: { order_id: existingCart.id } })

    // Add updated items
    await app.prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id: existingCart.id,
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    })

    // Return updated cart with product info
    return getUserCart(app, userId)
  } else {
    // Create new cart order
    return await app.prisma.order.create({
      data: {
        user_id: userId,
        total: 0,
        status: 'cart',
        items: {
          create: items,
        },
      },
      include: { items: { include: { product: true } } },
    })
  }
}

/* Checkout cart (mark cart as completed with total) */
export async function checkoutCart(app: FastifyInstance, userId: number, total: number) {
  const cart = await getUserCart(app, userId)
  if (!cart) throw new Error('No active cart found')

  return await app.prisma.order.update({
    where: { id: cart.id },
    data: {
      status: 'completed',
      total,
      created_at: new Date(),
    },
    include: { items: { include: { product: true } } },
  })
}

/* Create completed order directly */
export async function createOrder(app: FastifyInstance, input: OrderInput) {
  const { user_id, total, items, status } = input

  return await app.prisma.order.create({
    data: {
      user_id,
      total,
      status: status || 'completed',
      items: {
        create: items,
      },
    },
    include: {
      items: { include: { product: true } }, // include product info
    },
  })
}
