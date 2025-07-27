import { FastifyInstance } from 'fastify'
import { buildServer } from '../../src/server'

let app: FastifyInstance

export const getTestPrisma = async () => {
  if (!app) {
    app = await buildServer()
    await app.ready()
  }
  return app.prisma
}
