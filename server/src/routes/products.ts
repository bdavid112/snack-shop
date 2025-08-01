import { FastifyInstance } from 'fastify'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '@services/productService'
import { ProductCreateSchema, ProductSchema } from '@shared/schemas/product'
import { requireAdmin } from '@plugins/authMiddleware'
import { handleError } from '@utils/handleError'
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'

/* eslint-disable @typescript-eslint/require-await */
export async function productRoutes(app: FastifyInstance) {
  /* List all products */
  app.get('/products', async (_req, reply) => {
    const products = await getAllProducts(app)
    return reply.send(products)
  })

  /* Add new product (admin only) */

  app.post('/products', async (req, reply) => {
    await requireAdmin(req, reply)
    if (reply.sent) return

    const parts = req.parts()

    const fields: Record<string, string> = {}
    let imageUrl: string | null = null

    for await (const part of parts) {
      console.log('Received part:', {
        fieldname: part.fieldname,
        type: part.type,
        filename: part.filename,
      })

      if (part.type === 'file' && part.fieldname === 'imageFile') {
        const filename = `${randomUUID()}-${part.filename}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const filePath = path.join(uploadDir, filename)

        try {
          await pipeline(part.file, fs.createWriteStream(filePath))
        } catch (err) {
          console.error('Error writing file:', err)
          return reply.status(500).send({ error: 'Failed to save image file' })
        }

        imageUrl = `/uploads/${filename}`
      } else if (part.type === 'field') {
        fields[part.fieldname] = part.value as string
        console.log(`Got field: ${part.fieldname} = ${part.value}`)
      }
    }

    const parsedInput = {
      name: fields.name,
      price: parseInt(fields.price, 10),
      stock: parseInt(fields.stock, 10),
      discount: fields.discount ? parseInt(fields.discount, 10) : null,
      description: fields.description ?? null,
    }

    // Validate input
    const result = ProductSchema.safeParse(parsedInput)
    console.log(result)

    if (!result.success) {
      return reply.status(400).send({ error: result.error.flatten() })
    }

    try {
      const newProduct = await createProduct(app, {
        ...result.data,
        image_url: imageUrl,
      })

      return reply.status(201).send(newProduct)
    } catch (err) {
      return handleError(err, req, reply, {
        'Product with this name already exists': { statusCode: 409 },
      })
    }
  })

  /* Update/edit product (admin only) */

  app.put<{ Params: { id: string } }>('/products/:id', async (req, reply) => {
    await requireAdmin(req, reply)
    if (reply.sent) return

    const productId = Number(req.params.id)
    if (isNaN(productId)) {
      return reply.status(400).send({ message: 'Invalid product ID' })
    }

    const parts = req.parts()
    const fields: Record<string, string> = {}
    let imageUrl: string | null = null

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'image') {
        const filename = `${randomUUID()}-${part.filename}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const filePath = path.join(uploadDir, filename)

        try {
          await pipeline(part.file, fs.createWriteStream(filePath))
        } catch (err) {
          console.error('Error writing file:', err)
          return reply.status(500).send({ error: 'Failed to save image file' })
        }

        imageUrl = `/uploads/${filename}`
      } else if (part.type === 'field') {
        fields[part.fieldname] = part.value as string
        console.log(`Got field: ${part.fieldname} = ${part.value}`)
      }
    }

    const parsedInput = {
      name: fields.name,
      price: parseInt(fields.price, 10),
      stock: parseInt(fields.stock, 10),
      discount: fields.discount ? parseInt(fields.discount, 10) : null,
      description: fields.description ?? null,
    }

    const result = ProductCreateSchema.safeParse(parsedInput)

    if (!result.success) {
      return reply.status(400).send({
        message: 'Invalid product input',
        errors: result.error.flatten().fieldErrors,
      })
    }

    try {
      const updated = await updateProduct(app, productId, {
        ...result.data,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      })
      return reply.status(200).send(updated)
    } catch (err) {
      return handleError(err, req, reply, {
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
