import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import request from 'supertest'
import { buildServer } from '../src/server'
import { sign } from 'cookie-signature'
import { getSignedSessionCookie } from './utils'
import { Product } from '../src/types/product'

let app: Awaited<ReturnType<typeof buildServer>>

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
})

describe('Products', () => {
  // 🔐 Authentication checks

  it('returns 401 if unauthenticated user tries to create a product', async () => {
    const response = await request(app.server)
      .post('/api/products')
      .send({ name: 'testproduct', price: 199, stock: 15 })

    expect(response.status).toBe(401)
    expect(response.text).toContain('Unauthorized')
  })

  it('returns 401 if signed-in non-admin user tries to create a product', async () => {
    const sessionPayload = JSON.stringify({ username: 'user', isAdmin: false })
    const signed = 's:' + sign(sessionPayload, 'super-secret-key')

    const response = await request(app.server)
      .post('/api/products')
      .set('Cookie', [`session=${signed}`])
      .send({ name: 'testproduct', price: 199, stock: 15 })

    expect(response.status).toBe(401)
    expect(response.text).toContain('Unauthorized')
  })

  it('returns 401 if cookie is tampered or invalidly signed', async () => {
    const fakeSigned = 's:{"username":"admin","isAdmin":true}.invalidsig'

    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { cookie: `session=${fakeSigned}` },
      payload: { name: 'fake', price: 123, stock: 3 },
    })

    expect(response.statusCode).toBe(401)
  })

  // 📦 Product reading

  it('returns an array of products with expected fields', async () => {
    const response = await request(app.server).get('/api/products').send()

    expect(response.status).toBe(200)
    const products = JSON.parse(response.text) as Product[]

    expect(Array.isArray(products)).toBe(true)
    expect(products[0].name).toBeDefined()
    expect(products[0].price).toBeDefined()
    expect(products[0].stock).toBeDefined()
  })

  it('allows signed-in non-admin users to read products', async () => {
    const cookie = getSignedSessionCookie({ username: 'someuser', isAdmin: false })

    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
      headers: { cookie },
    })

    expect(response.statusCode).toBe(200)
  })

  // ✅ Product creation

  it('creates a product if user is admin', async () => {
    const cookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { cookie },
      payload: { name: 'testproduct', price: 299, stock: 20 },
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toContain('testproduct')
  })

  it('returns 400 if required fields are missing when admin creates product', async () => {
    const cookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { cookie },
      payload: {
        // Missing required fields: name or stock
        price: 299,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Invalid product input')
  })

  it('returns 409 if product with the same name already exists', async () => {
    const cookie = getSignedSessionCookie({ username: 'admin', isAdmin: true })

    await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { cookie },
      payload: { name: 'dupe', price: 100, stock: 10 },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { cookie },
      payload: { name: 'dupe', price: 100, stock: 10 },
    })

    expect(response.statusCode).toBe(409)
    expect(response.body).toContain('Product with this name already exists')
  })
})
