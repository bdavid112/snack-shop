import { beforeAll, describe, it, expect } from 'vitest'
import { sign } from 'cookie-signature'
import { getSignedSessionCookie } from './utils'
import { ProductResponse, ProductResponseSchema } from '../src/types/product'
import z from 'zod'
import { getTestApp } from './utils/getApp'

let app: Awaited<ReturnType<typeof getTestApp>>

beforeAll(async () => {
  app = await getTestApp()
})

describe('🛒 Product API', () => {
  // ─── AUTH CHECKS ───────────────────────────────────────────────────────────────
  describe('🔐 Authentication', () => {
    it('rejects unauthenticated product creation', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        payload: { name: 'testproduct', price: 199, stock: 15 },
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toContain('Unauthorized')
    })

    it('rejects non-admin user from creating a product', async () => {
      const signed =
        's:' + sign(JSON.stringify({ username: 'user', isAdmin: false }), 'super-secret-key')

      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: `session=${signed}` },
        payload: { name: 'testproduct', price: 199, stock: 15 },
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toContain('Unauthorized')
    })

    it('rejects tampered or invalid cookie', async () => {
      const fakeSigned = 's:{"username":"admin","isAdmin":true}.invalidsig'

      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: `session=${fakeSigned}` },
        payload: { name: 'fake', price: 123, stock: 3 },
      })

      expect(res.statusCode).toBe(401)
    })
  })

  // ─── READ PRODUCTS ─────────────────────────────────────────────────────────────
  describe('📦 Product listing', () => {
    it('returns an array of products with expected fields', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/products',
      })

      expect(res.statusCode).toBe(200)

      const parsed = z.array(ProductResponseSchema).safeParse(res.json())

      expect(parsed.success).toBe(true)
    })

    it('allows non-admin users to read products', async () => {
      const cookie = getSignedSessionCookie({ username: 'user', isAdmin: false })

      const res = await app.inject({
        method: 'GET',
        url: '/api/products',
        headers: { cookie },
      })

      expect(res.statusCode).toBe(200)
    })
  })

  // ─── CREATE PRODUCT ────────────────────────────────────────────────────────────
  describe('✅ Product creation', () => {
    const adminCookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    it('creates a product when user is admin', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { name: 'testproduct', price: 299, stock: 20 },
      })

      expect(res.statusCode).toBe(201)
      expect(res.body).toContain('testproduct')
    })

    it('returns 400 if required fields are missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { price: 299 }, // Missing name and stock
      })

      expect(res.statusCode).toBe(400)
      expect(res.body).toContain('Invalid input data')
    })

    it('returns 409 if product with same name already exists', async () => {
      await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { name: 'dupe', price: 100, stock: 10 },
      })

      const res = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { name: 'dupe', price: 100, stock: 10 },
      })

      expect(res.statusCode).toBe(409)
      expect(res.body).toContain('Product with this name already exists')
    })
  })

  // ─── UPDATE PRODUCT ────────────────────────────────────────────────────────────
  describe('✏️ Product update', () => {
    const adminCookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    it('updates a product when user is admin', async () => {
      const created = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { name: 'update-me', price: 100, stock: 10 },
      })

      const product: ProductResponse = await created.json()

      const res = await app.inject({
        method: 'PUT',
        url: `/api/products/${product.id}`,
        headers: { cookie: adminCookie },
        payload: { name: 'updated-product', price: 150, stock: 5 },
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toContain('updated-product')
    })

    it('returns 404 if product to update is not found', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/products/-1',
        headers: { cookie: adminCookie },
        payload: { name: 'not-found', price: 100, stock: 1 },
      })

      expect(res.statusCode).toBe(404)
      expect(res.body).toContain('Product not found')
    })

    it('returns 401 if user is not admin', async () => {
      const cookie = getSignedSessionCookie({ username: 'user', isAdmin: false })

      const res = await app.inject({
        method: 'PUT',
        url: '/api/products/1',
        headers: { cookie },
        payload: { name: 'unauthorized-update', price: 50, stock: 2 },
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toContain('Unauthorized')
    })
  })

  // ─── DELETE PRODUCT ────────────────────────────────────────────────────────────
  describe('❌ Product deletion', () => {
    const adminCookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    it('deletes a product when user is admin', async () => {
      const created = await app.inject({
        method: 'POST',
        url: '/api/products',
        headers: { cookie: adminCookie },
        payload: { name: 'delete-me', price: 80, stock: 3 },
      })

      const product: ProductResponse = await created.json()

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/products/${product.id}`,
        headers: { cookie: adminCookie },
      })

      expect(res.statusCode).toBe(204)

      const confirm = await app.inject({
        method: 'GET',
        url: `/api/products/${product.id}`,
      })

      expect(confirm.statusCode).toBe(404)
    })

    it('returns 404 if product to delete is not found', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/api/products/9999',
        headers: { cookie: adminCookie },
      })

      expect(res.statusCode).toBe(404)
      expect(res.body).toContain('Product not found')
    })

    it('returns 401 if user is not admin', async () => {
      const cookie = getSignedSessionCookie({ username: 'user', isAdmin: false })

      const res = await app.inject({
        method: 'DELETE',
        url: '/api/products/1',
        headers: { cookie },
      })

      expect(res.statusCode).toBe(401)
    })
  })
})
