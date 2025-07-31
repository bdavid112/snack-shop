import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
// @ts-expect-error - tailwindcss/vite has no types
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

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
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
