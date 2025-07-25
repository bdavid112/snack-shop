import { FastifyInstance } from 'fastify'

/* eslint-disable @typescript-eslint/require-await */
export default async function authRoutes(app: FastifyInstance) {
  /* Register a new user */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.post('/register', async (req, reply) => {
    /* TODO */
  })

  /* Login */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.post('/login', async (req, reply) => {
    /* TODO */
  })
}
/* eslint-enable @typescript-eslint/require-await */
