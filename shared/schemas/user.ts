import { z } from 'zod'

export const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const UserResponseSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  isAdmin: z.boolean(),
  authenticated: z.boolean(),
})

export const SafeUserSchema = UserResponseSchema

export type UserInput = z.infer<typeof UserSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type SafeUser = z.infer<typeof SafeUserSchema>
