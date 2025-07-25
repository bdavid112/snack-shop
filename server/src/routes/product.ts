import { FastifyInstance } from 'fastify'

/* eslint-disable @typescript-eslint/require-await */
export default async function productRoutes(app: FastifyInstance) {
  /* List all products */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/products', async (req, reply) => {
    /* TODO */
  })

  /* Add new product (admin only) */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  app.post('/products', async (req, reply) => {
    /* TODO */
  })

  /* Update/edit product (admin only) */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  app.put('/products/:id', async (req, reply) => {
    /* TODO */
  })

  /* Delete product (admin only) */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  app.delete('/products/:id', async (req, reply) => {
    /* TODO */
  })
}
/* eslint-enable @typescript-eslint/require-await */
