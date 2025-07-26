import { describe, it, expect, beforeAll, vi, afterAll } from 'vitest'
import request from 'supertest'
import { buildServer } from '../src/server'
import * as userService from '../src/services/userService'

let app: Awaited<ReturnType<typeof buildServer>>

beforeAll(async () => {
  app = await buildServer()
})

afterAll(async () => {
  await app.close()
})

describe('Auth', () => {
  describe('Registration', () => {
    it('registers a new user successfully and returns status 201', async () => {
      const response = await request(app.server)
        .post('/api/register')
        .send({ username: 'testuser', password: '123456' })

      expect(response.status).toBe(201)
      expect(response.text).toContain('User created')
    })

    it('returns 409 if username is already taken', async () => {
      const response = await request(app.server)
        .post('/api/register')
        .send({ username: 'admin', password: '123456' })

      expect(response.status).toBe(409)
      expect(response.text).toContain('Username already taken')
    })

    it('returns 500 if registration service throws an error', async () => {
      // Mock the service to throw an error
      vi.spyOn(userService, 'registerUser').mockImplementationOnce(() => {
        throw new Error('Database failure')
      })

      const response = await request(app.server)
        .post('/api/register')
        .send({ username: 'failuser', password: '123456' })

      expect(response.status).toBe(500)
      expect(response.text).toContain('Internal server error')
    })
  })

  describe('Login', () => {
    it('authenticates valid user credentials and returns status 200', async () => {
      const response = await request(app.server)
        .post('/api/login')
        .send({ username: 'admin', password: 'SnackBoss2025' })

      expect(response.status).toBe(200)
      expect(response.text).toContain(['"authenticated":true', '"isAdmin":true'])
    })

    it('returns 401 on invalid user credentials', async () => {
      let response = await request(app.server)
        .post('/api/login')
        .send({ username: 'failuser', password: 'SnackBoss2025' })

      expect(response.status).toBe(401)
      expect(response.text).toContain('Not authenticated')

      response = await request(app.server)
        .post('/api/login')
        .send({ username: 'admin', password: 'failpass' })

      expect(response.status).toBe(401)
      expect(response.text).toContain('Not authenticated')
    })

    it('returns 500 if login service throws an error', async () => {
      // Mock the service to throw an error
      vi.spyOn(userService, 'loginUser').mockImplementationOnce(() => {
        throw new Error('Database failure')
      })

      const response = await request(app.server)
        .post('/api/login')
        .send({ username: 'admin', password: 'SnackBoss2025' })

      expect(response.status).toBe(500)
      expect(response.text).toContain('Internal server error')
    })
  })
})

describe('Session Authentication', () => {
  it('sets a signed session cookie on successful login and allows access to protected routes', async () => {
    const response = await request(app.server)
      .post('/api/login')
      .send({ username: 'admin', password: 'SnackBoss2025' })

    expect(response.status).toBe(200)
    expect(response.headers['set-cookie']).toBeDefined()

    const cookie = response.headers['set-cookie'][0]

    const protectedRes = await request(app.server)
      .post('/api/orders') // <-- update this to a real protected route
      .set('Cookie', cookie)

    expect(protectedRes.status).toBe(200)
    expect((protectedRes.body as { user: { username: string } }).user).toEqual({
      username: 'admin',
    })
  })

  it('clears the session cookie on logout', async () => {
    // 1. Login
    const loginRes = await request(app.server)
      .post('/api/login')
      .send({ username: 'admin', password: 'SnackBoss2025' })

    const cookie = loginRes.headers['set-cookie'][0]

    // 2. Logout
    const logoutRes = await request(app.server).post('/api/logout').set('Cookie', cookie)

    expect(logoutRes.status).toBe(200)
    expect(logoutRes.body as { message: string }).toBe('Logged out successfully')
    expect(logoutRes.headers['set-cookie']).toBeDefined()
    expect(logoutRes.headers['set-cookie'][0]).toMatch(/session=;/)
  })
})
