import { beforeEach, afterEach } from 'vitest'
import { getTestPrisma } from './test/utils/getPrisma'

import seed from './prisma/seed'

let prisma: Awaited<ReturnType<typeof getTestPrisma>>

beforeEach(async () => {
  prisma = await getTestPrisma()
  await prisma.$executeRawUnsafe('BEGIN')
  await seed(prisma)
})

afterEach(async () => {
  await prisma.$executeRawUnsafe('ROLLBACK')
})
