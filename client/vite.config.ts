import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
// @ts-expect-error - tailwindcss/vite has no types
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // or whatever port Fastify is on
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
