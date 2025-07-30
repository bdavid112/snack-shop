import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  discount: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(), // 👈 matches API
})

export const ProductResponseSchema = ProductSchema.extend({
  id: z.number().int().positive(),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type ProductResponse = z.infer<typeof ProductResponseSchema>
