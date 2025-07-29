import { FastifyReply, FastifyRequest } from 'fastify'

type ErrorMap = Record<string, { statusCode: number; message?: string }>

/* Helper function to map Error messages to replies */
export function handleError(
  err: unknown,
  req: FastifyRequest,
  reply: FastifyReply,
  errorMap?: ErrorMap
) {
  req.log.error(err)

  if (err instanceof Error) {
    const mapped = errorMap?.[err.message]

    if (mapped) {
      return reply.status(mapped.statusCode).send({ message: mapped.message ?? err.message })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }

  return reply.status(500).send({ message: 'Unexpected error' })
}
