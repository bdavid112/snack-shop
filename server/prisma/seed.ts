import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

export default async function seed(prisma: PrismaClient) {
  /* Users */
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('SnackBoss2025', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: {
      username: 'admin',
      password: hashedPassword,
      is_admin: true,
    },
  })

  /* Products */
  await prisma.product.deleteMany()
  await prisma.product.createMany({
    data: [
      { name: 'Product A', price: 100, stock: 10 },
      { name: 'Product B', price: 200, stock: 5 },
    ],
  })
}
