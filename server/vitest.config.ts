import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

// Load .env.test before tests run
dotenv.config({ path: '.env.test' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    fileParallelism: false, // Disable file parallelism to avoid issues with shared resources
  },
})
