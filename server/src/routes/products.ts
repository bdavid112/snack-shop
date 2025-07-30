import { FastifyInstance } from 'fastify'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '@services/productService'
import { ProductInput, ProductSchema } from '@shared/schemas/product'
import { requireAdmin } from '@plugins/authMiddleware'
import { handleError } from '@utils/handleError'
import { validateRequest } from '@utils/validate'

/* eslint-disable @typescript-eslint/require-await */
export async function productRoutes(app: FastifyInstance) {
  /* List all products */
  app.get('/products', async (_req, reply) => {
    const products = await getAllProducts(app)
    return reply.send(products)
  })

  /* Add new product (admin only) */

  app.post('/products', async (req, reply) => {
    await requireAdmin(req, reply) // Check if the user is authorized

    const validated = await validateRequest<ProductInput>(req, reply, ProductSchema)

    // Try to create new Product
    try {
      const newProduct = await createProduct(app, validated!)

      return reply.status(201).send(newProduct) // Return 201 and the new Product
    } catch (err) {
      handleError(err, req, reply, {
        'Product with this name already exists': { statusCode: 409 },
      })
    }
  })

  /* Update/edit product (admin only) */

  app.put<{ Params: { id: string } }>('/products/:id', async (req, reply) => {
    await requireAdmin(req, reply)

    const parseResult = ProductSchema.safeParse(req.body) // Try to parse request body according to model schema

    if (!parseResult.success) {
      // Return 400 on missing values
      return reply.status(400).send({
        message: 'Invalid product input',
        errors: parseResult.error.flatten().fieldErrors,
      })
    }

    // Check if provided ID is valid
    const productId = Number(req.params.id)
    if (isNaN(productId)) {
      return reply.status(400).send({ message: 'Invalid product ID' })
    }

    // Try to update existing Product
    try {
      const updated = await updateProduct(app, productId, parseResult.data)
      return reply.status(200).send(updated)
    } catch (err) {
      handleError(err, req, reply, {
        'Product not found': { statusCode: 404 },
      })
    }
  })

  /* Delete product (admin only) */

  app.delete<{ Params: { id: string } }>('/products/:id', async (req, reply) => {
    await requireAdmin(req, reply)

    // Check if provided ID is valid
    const productId = Number(req.params.id)
    if (isNaN(productId)) {
      return reply.status(400).send({ message: 'Invalid product ID' })
    }

    // Try to delete existing Product
    try {
      const deleted = await deleteProduct(app, productId)
      return reply.status(204).send(deleted)
    } catch (err) {
      handleError(err, req, reply, {
        'Product not found': { statusCode: 404 },
      })
    }
  })
}
/* eslint-enable @typescript-eslint/require-await */
