import { FastifyRequest, FastifyReply } from 'fastify'

type SessionPayload = {
  id: number
  isAdmin: boolean
}

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  /* 1. No cookie? Unauthorized */
  if (!req.cookies.session) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  /* 2. Attempt to unsign */
  const session = req.unsignCookie(req.cookies.session)

  /* 3. Invalid signature or empty payload? Unauthorized */
  if (!session.valid || !session.value) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  /* 4. Parse and attach user */
  req.user = JSON.parse(session.value) as SessionPayload
}

/* Helper function to protect admin-only routes */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  await authMiddleware(req, reply)
  if (!req.user?.isAdmin) return reply.status(401).send({ message: 'Unauthorized' })
}
