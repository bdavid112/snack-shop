import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
  interface FastifyRequest {
    user?: {
      id: number
      isAdmin: boolean
    }
    parts: () => AsyncIterableIterator<MultipartFile>
  }
}
