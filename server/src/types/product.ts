import { z } from 'zod'

export type Product = {
  name: string
  price: number
  stock: number
  discount: number
  description: string
  imgUrl: string
}

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  discount: z.number().optional(),
  description: z.string().optional(),
  img_url: z.string().url().optional(),
})

export type ProductInput = z.infer<typeof ProductSchema>
