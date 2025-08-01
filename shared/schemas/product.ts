import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative().optional(),
  description: z.string().nullable().optional(),
})

export const ProductCreateSchema = ProductSchema.extend({
  image_url: z.string().url().nullable().optional(),
})

export const ProductResponseSchema = ProductSchema.extend({
  id: z.number().int().positive(),
  image_url: z.string().url().nullable(),
  created_at: z.string(),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>
export type ProductResponse = z.infer<typeof ProductResponseSchema>

export type EditableProduct = (Partial<ProductResponse> & { id: number }) & {
  imageFile?: File | null
}
