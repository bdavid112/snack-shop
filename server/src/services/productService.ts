import { FastifyInstance } from 'fastify'
import { ProductCreateInput, ProductInput } from '@shared/schemas/product'

/* Get product by its ID */
export async function getProduct(app: FastifyInstance, productId: number) {
  return await app.prisma.product.findUnique({
    where: { id: productId },
  })
}

/* Get all products */
export async function getAllProducts(app: FastifyInstance) {
  return await app.prisma.product.findMany()
}

/* Create product */
export async function createProduct(app: FastifyInstance, input: ProductCreateInput) {
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

/* Update product */
export async function updateProduct(
  app: FastifyInstance,
  productId: number,
  input: ProductCreateInput
) {
  // Try to retrieve product by its ID
  const product = await getProduct(app, productId)

  // Throw error if not found
  if (!product) throw new Error('Product not found')

  // Update Product
  const updated = await app.prisma.product.update({
    where: { id: productId },
    data: input,
  })

  return updated
}

/* Delete product */
export async function deleteProduct(app: FastifyInstance, productId: number) {
  // Try to retrieve product by its ID
  const product = await getProduct(app, productId)

  // Throw error if not found
  if (!product) throw new Error('Product not found')

  // Delete Product
  const deleted = await app.prisma.product.delete({
    where: { id: productId },
  })

  return deleted
}
