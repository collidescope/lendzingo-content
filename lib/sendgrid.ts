// ─── SendGrid email sending utility ───────────────────────────────────────────

import sgMail from '@sendgrid/mail'
import { createHmac } from 'crypto'

// ─── Send a single email ───────────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not set')

  sgMail.setApiKey(apiKey)

  await sgMail.send({
    to,
    from: {
      email: 'refitracker@lendzingo.com',
      name: 'Lendzingo',
    },
    subject,
    html,
  })
}

// ─── Generate a signed unsubscribe token ──────────────────────────────────────
// Creates a per-email HMAC token so unsubscribe links can't be guessed.
// Requires UNSUBSCRIBE_SECRET env var (any random string you generate).

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET ?? 'change-me-in-production'
  return createHmac('sha256', secret)
    .update(email.toLowerCase().trim())
    .digest('hex')
    .slice(0, 40)
}

export function buildUnsubscribeUrl(email: string, siteUrl: string): string {
  const token = generateUnsubscribeToken(email)
  return `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}
