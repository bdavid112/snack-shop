import { describe, it, expect, beforeAll, vi } from 'vitest'
import * as userService from '../src/services/userService'
import { getTestApp } from './utils'

let app: Awaited<ReturnType<typeof getTestApp>>

beforeAll(async () => {
  app = await getTestApp()
})

describe('🔐 Authentication API', () => {
  // ─── REGISTRATION ──────────────────────────────────────────────────────────────
  describe('📝 Registration', () => {
    it('registers a new user successfully and returns 201', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'testuser', password: '123456' },
      })

      expect(res.statusCode).toBe(201)
      expect(res.body).toContain('User created')
    })

    it('returns 409 if username is already taken', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'alice', password: '123456' },
      })

      expect(res.statusCode).toBe(409)
      expect(res.body).toContain('Username already taken')
    })

    it('returns 500 if registration service throws an error', async () => {
      vi.spyOn(userService, 'registerUser').mockImplementationOnce(() => {
        throw new Error('Database failure')
      })

      const res = await app.inject({
        method: 'POST',
        url: '/api/register',
        payload: { username: 'failuser', password: '123456' },
      })

      expect(res.statusCode).toBe(500)
      expect(res.body).toContain('Internal server error')
    })
  })

  // ─── LOGIN ─────────────────────────────────────────────────────────────────────
  describe('🔑 Login', () => {
    it('authenticates valid credentials and returns 200', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'alice', password: 'password' },
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toContain('"authenticated":true')
      expect(res.body).toContain('"isAdmin":false')
    })

    it('returns 401 on invalid credentials', async () => {
      const res1 = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'failuser', password: 'password' },
      })

      expect(res1.statusCode).toBe(401)
      expect(res1.body).toContain('No user with this username')

      const res2 = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'alice', password: 'wrongpass' },
      })

      expect(res2.statusCode).toBe(401)
      expect(res2.body).toContain('Not authenticated')
    })

    it('returns 500 if login service throws an error', async () => {
      vi.spyOn(userService, 'loginUser').mockImplementationOnce(() => {
        throw new Error('Database failure')
      })

      const res = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'alice', password: 'password' },
      })

      expect(res.statusCode).toBe(500)
      expect(res.body).toContain('Internal server error')
    })
  })

  // ─── SESSION ───────────────────────────────────────────────────────────────────
  describe('🍪 Session Management', () => {
    it('sets a session cookie on login and grants access to protected route', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'alice', password: 'password' },
      })

      expect(loginRes.statusCode).toBe(200)
      const cookie = loginRes.cookies.find((c) => c.name === 'session')
      expect(cookie).toBeDefined()

      const protectedRes = await app.inject({
        method: 'GET',
        url: '/api/orders',
        cookies: { session: cookie!.value },
      })

      expect(protectedRes.statusCode).toBe(200)
    })

    it('clears session cookie on logout', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/login',
        payload: { username: 'alice', password: 'password' },
      })

      const cookie = loginRes.cookies.find((c) => c.name === 'session')

      const logoutRes = await app.inject({
        method: 'POST',
        url: '/api/logout',
        cookies: { session: cookie!.value },
      })

      expect(logoutRes.statusCode).toBe(200)

      const body: { message: string } = await logoutRes.json()
      expect(body.message).toBe('Logged out successfully')

      const cleared = logoutRes.cookies.find((c) => c.name === 'session')
      expect(cleared?.value).toBe('')
    })
  })
})
