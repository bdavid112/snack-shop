import signature from 'cookie-signature'

export function getSignedSessionCookie(sessionPayload: object): string {
  const raw = JSON.stringify(sessionPayload)
  const signed = signature.sign(raw, 'super-secret-key')
  return `session=s:${signed}` // prefix here only once
}
