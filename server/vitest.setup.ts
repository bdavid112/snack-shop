import { beforeEach, beforeAll, afterAll } from 'vitest'
import { getTestApp } from './test/utils/getApp'

import seed from './prisma/seed'

let app: Awaited<ReturnType<typeof getTestApp>>

beforeAll(async () => {
  app = await getTestApp()
})

afterAll(async () => {
  await app.prisma.$disconnect()
  await app.close()
})

beforeEach(async () => {
  const prisma = app.prisma
  if (prisma) {
    await seed(prisma)
  }
})
