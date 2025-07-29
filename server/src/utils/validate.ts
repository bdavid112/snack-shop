import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodType } from 'zod'

export async function validateRequest<T>(
  req: FastifyRequest,
  reply: FastifyReply,
  schema: ZodType<T>
): Promise<T | null> {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))

    return reply.status(400).send({
      message: 'Invalid input data',
      errors,
    })
  }

  return result.data
}
