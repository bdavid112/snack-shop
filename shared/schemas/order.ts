import { z } from 'zod'
import { ProductResponseSchema } from '.'

// Base OrderItem schema
export const OrderItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

export const OrderItemResponseSchema = OrderItemSchema.extend({
  id: z.number().int().positive(),
  order_id: z.number().int().positive(),
})

// OrderItem + product info
export const OrderItemWithProductSchema = OrderItemSchema.extend({
  product: ProductResponseSchema,
})

// Order input schema (for creating orders)
export const OrderSchema = z.object({
  user_id: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  items: z.array(OrderItemSchema).nonempty(),
})

// Full order response schema
export const OrderResponseSchema = OrderSchema.extend({
  id: z.number().int().positive(),
  created_at: z.string().datetime(),
  items: z.array(OrderItemResponseSchema).nonempty(),
})

export type OrderInput = z.infer<typeof OrderSchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>
export type OrderItemInput = z.infer<typeof OrderItemSchema>
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>
export type OrderItemWithProduct = z.infer<typeof OrderItemWithProductSchema>
