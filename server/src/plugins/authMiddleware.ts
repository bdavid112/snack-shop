import { FastifyRequest, FastifyReply } from 'fastify'

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const session = req.unsignCookie(req.cookies.session)

  if (!session.valid || !session.value) {
    return reply.status(401).send({ message: 'Not authenticated' })
  }

  req.user = { username: session.value }
}
