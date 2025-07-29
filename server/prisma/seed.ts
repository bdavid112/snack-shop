import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

export default async function seed(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await tx.order.deleteMany()
    await tx.product.deleteMany()
    await tx.user.deleteMany()

    const hashedPassword = await bcrypt.hash('password', 10)

    await tx.user.upsert({
      where: { username: 'alice' },
      update: { password: hashedPassword },
      create: {
        id: 1,
        username: 'alice',
        password: hashedPassword,
      },
    })

    await tx.product.createMany({
      data: [
        { id: 1, name: 'Product A', price: 100, stock: 10 },
        { id: 2, name: 'Product B', price: 200, stock: 5 },
      ],
    })
  })
}
