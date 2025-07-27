import { FastifyInstance } from 'fastify'
import { createProduct, getAllProducts } from '../services/productService'
import { ProductSchema } from '../types/product'
import { requireAdmin } from '../plugins/authMiddleware'

/* eslint-disable @typescript-eslint/require-await */
export default async function productRoutes(app: FastifyInstance) {
  /* List all products */
  app.get('/products', async (_req, reply) => {
    const products = await getAllProducts(app)
    return reply.send(products)
  })

  /* Add new product (admin only) */

  app.post('/products', async (req, reply) => {
    try {
      await requireAdmin(req, reply) // Check if the user is authorized

      const parseResult = ProductSchema.safeParse(req.body) // Try to parse request body according to model schema

      if (!parseResult.success) {
        // Return 400 on missing values
        return reply.status(400).send({
          message: 'Invalid product input',
          errors: parseResult.error.flatten().fieldErrors,
        })
      }

      // Create new Product if everything went well
      const data = parseResult.data
      const newProduct = await createProduct(app, data)

      return reply.status(201).send(newProduct) // Return 201 and the new Product
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Product with this name already exists') {
          return reply.status(409).send('Product with this name already exists')
        }
      }
    }
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
