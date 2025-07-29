import { buildServer } from '../../src/server'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

export const getTestApp = async (): Promise<FastifyInstance> => {
  if (!app) {
    app = await buildServer()
    await app.ready()
  }

  return app
}
