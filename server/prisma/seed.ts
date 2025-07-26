import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.user.deleteMany() // clear existing users

  const hashedPassword = await bcrypt.hash('SnackBoss2025', 10)
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      is_admin: true,
    },
  })
}

void seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => void prisma.$disconnect())
