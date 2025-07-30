import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import { UserInput } from '@shared/schemas/user'

export async function registerUser(app: FastifyInstance, input: UserInput) {
  const { username, password } = input

  /* Check if user already exists */
  const existingUser = await app.prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    throw new Error('Username already taken')
  }

  /* Hash password */
  const hashedPassword = await bcrypt.hash(password, 10)

  /* Create user */
  const newUser = await app.prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })

  return newUser
}

export async function loginUser(app: FastifyInstance, input: UserInput) {
  const { username, password } = input

  /* Search user */
  const user = await app.prisma.user.findUnique({
    where: { username },
  })

  /* Throw error if user doesn't exist */
  if (!user) throw new Error('No user with this username')

  /* Try authenticating */
  const authenticated = await bcrypt.compare(password, user.password)
  const userId = user.id
  const isAdmin = user.is_admin

  return { id: userId, authenticated, isAdmin }
}
