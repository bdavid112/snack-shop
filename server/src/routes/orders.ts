import { FastifyInstance } from 'fastify'

/* eslint-disable @typescript-eslint/require-await */
export default async function orderRoutes(app: FastifyInstance) {
  /* Create new order */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.post('/orders', async (req, reply) => {
    /* TODO */
  })

  /* List all orders */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/orders', async (req, reply) => {
    /* TODO */
  })
}
/* eslint-enable @typescript-eslint/require-await */
