import { execSync } from 'child_process'
import { beforeEach } from 'vitest'

beforeEach(() => {
  /* Run the seed script before each tests */
  execSync('ts-node prisma/seed.ts')
})
