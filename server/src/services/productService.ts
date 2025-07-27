import { FastifyInstance } from 'fastify'
import { ProductInput } from '../types/product'

export async function getAllProducts(app: FastifyInstance) {
  return await app.prisma.product.findMany()
}

export async function createProduct(app: FastifyInstance, input: ProductInput) {
  const { name } = input

  // Check for existing product
  const existingProduct = await app.prisma.product.findUnique({
    where: { name },
  })

  if (existingProduct) throw new Error('Product with this name already exists')

  /* Create and return new Product */
  return await app.prisma.product.create({
    data: input,
  })
}
