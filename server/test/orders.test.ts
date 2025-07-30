import { beforeAll, describe, it, expect } from 'vitest'
import { z } from 'zod'
import { getSignedSessionCookie } from './utils'
import { OrderResponseSchema } from '@shared/schemas/order'
import { getTestApp } from './utils/getApp'

let app: Awaited<ReturnType<typeof getTestApp>>

beforeAll(async () => {
  app = await getTestApp()
})

describe('🛒 Orders API', () => {
  // ─── AUTHENTICATION ────────────────────────────────────────────────────────────
  describe('🔐 Auth Guard', () => {
    it('returns 401 if unauthenticated user tries to create an order', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: {},
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toContain('Unauthorized')
    })

    it('returns 401 if unauthenticated user tries to list orders', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/orders',
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toContain('Unauthorized')
    })
  })

  // ─── ORDER CREATION ────────────────────────────────────────────────────────────
  describe('📦 Create Order', () => {
    it('creates a new order for authenticated user', async () => {
      const cookie = getSignedSessionCookie({ id: 1, username: 'alice', isAdmin: false })

      const orderPayload = {
        user_id: 1,
        total: 2997,
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 },
        ],
      }

      const res = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderPayload,
        headers: { cookie },
      })

      expect(res.statusCode).toBe(201)

      const parsed = OrderResponseSchema.parse(await res.json())

      expect(parsed).toHaveProperty('id')
      expect(parsed).toMatchObject({
        user_id: orderPayload.user_id,
        total: orderPayload.total,
      })

      expect(Array.isArray(parsed.items)).toBe(true)
      expect(parsed.items.length).toBe(orderPayload.items.length)
      expect(parsed.items[0]).toHaveProperty('product_id')
      expect(parsed.items[0]).toHaveProperty('quantity')
    })
  })

  // ─── ORDER LISTING ─────────────────────────────────────────────────────────────
  describe('📄 List Orders', () => {
    it('returns empty list if user has no orders', async () => {
      const cookie = getSignedSessionCookie({ username: 'newuser', isAdmin: false })

      const res = await app.inject({
        method: 'GET',
        url: '/api/orders',
        headers: { cookie },
      })

      expect(res.statusCode).toBe(200)

      const parsed = z.array(OrderResponseSchema).parse(await res.json())
      expect(parsed.length).toBe(0)
    })

    it('returns list of user’s own orders', async () => {
      const cookie = getSignedSessionCookie({ id: 1, username: 'bob', isAdmin: false })

      const orderPayload = {
        user_id: 1,
        total: 2997,
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 },
        ],
      }

      await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderPayload,
        headers: { cookie },
      })

      await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderPayload,
        headers: { cookie },
      })

      const res = await app.inject({
        method: 'GET',
        url: '/api/orders',
        headers: { cookie },
      })

      expect(res.statusCode).toBe(200)

      const parsed = z.array(OrderResponseSchema).parse(await res.json())
      expect(parsed.length).toBeGreaterThanOrEqual(2)

      for (const order of parsed) {
        expect(order).toHaveProperty('items')
        expect(Array.isArray(order.items)).toBe(true)
      }
    })

    it('does not return orders of other users', async () => {
      const cookie1 = getSignedSessionCookie({ id: 2, username: 'charlie', isAdmin: false })
      const cookie2 = getSignedSessionCookie({ id: 3, username: 'eve', isAdmin: false })

      await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: {
          user_id: 2,
          total: 999,
          items: [{ product_id: 3, quantity: 1 }],
        },
        headers: { cookie: cookie1 },
      })

      const res = await app.inject({
        method: 'GET',
        url: '/api/orders',
        headers: { cookie: cookie2 },
      })

      expect(res.statusCode).toBe(200)

      const parsed = z.array(OrderResponseSchema).parse(await res.json())
      expect(parsed.length).toBe(0)
    })
  })
})
