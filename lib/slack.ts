// ─── Slack integration utilities ──────────────────────────────────────────────
//
// Handles:
//  - Posting the bi-weekly commentary proposal to Slack for approval
//  - Verifying incoming Slack request signatures (for the /api/slack/actions endpoint)
//  - Sending follow-up messages via response_url (no bot token required)

import { createHmac, timingSafeEqual } from 'crypto'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommentaryProposal {
  periodLabel: string       // e.g. "June 1–14, 2026"
  pmmsRate30: number
  pmmsRate15: number | null
  pmmsRatePrev30: number | null
  pmmsRatePrev15: number | null
  rateSummary: string
  outlook: string
}

// ─── Signature verification ───────────────────────────────────────────────────
// Called by /api/slack/actions to confirm requests are genuinely from Slack.

export function verifySlackSignature(
  signingSecret: string,
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  // Reject requests older than 5 minutes (replay attack protection)
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10))
  if (age > 300) return false

  const baseString = `v0:${timestamp}:${rawBody}`
  const expected = 'v0=' + createHmac('sha256', signingSecret).update(baseString).digest('hex')

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

// ─── Post commentary proposal to Slack ───────────────────────────────────────

export async function postCommentaryProposal(proposal: CommentaryProposal): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) throw new Error('SLACK_WEBHOOK_URL is not set')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://content.lendzingo.com'

  const rateMovement = proposal.pmmsRatePrev30 !== null
    ? proposal.pmmsRate30 < proposal.pmmsRatePrev30
      ? `↓ down ${(proposal.pmmsRatePrev30 - proposal.pmmsRate30).toFixed(2)}% from ${proposal.pmmsRatePrev30}%`
      : proposal.pmmsRate30 > proposal.pmmsRatePrev30
      ? `↑ up ${(proposal.pmmsRate30 - proposal.pmmsRatePrev30).toFixed(2)}% from ${proposal.pmmsRatePrev30}%`
      : 'unchanged from last period'
    : ''

  // Encode proposal in the button value so the actions endpoint can read it
  // without needing a DB lookup (keeps things stateless for now)
  const encodedProposal = Buffer.from(JSON.stringify(proposal)).toString('base64')

  // Build the admin edit URL with the proposal pre-filled
  const editUrl = `${siteUrl}/admin/rate-commentary?data=${encodeURIComponent(encodedProposal)}`

  const body = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 Refi Tracker: Rate Commentary Ready for Approval',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [
            `*Period:* ${proposal.periodLabel}`,
            `*30-yr fixed:* ${proposal.pmmsRate30}% ${rateMovement}`,
            proposal.pmmsRate15 ? `*15-yr fixed:* ${proposal.pmmsRate15}%` : null,
          ].filter(Boolean).join('\n'),
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Proposed Rate Summary:*\n> ${proposal.rateSummary}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Proposed Outlook:*\n> ${proposal.outlook}`,
        },
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'This copy will go out in every Refi Tracker email until the next update. Approve to activate it, or Edit to make changes first.',
          },
        ],
      },
      {
        type: 'actions',
        block_id: 'commentary_actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅  Approve', emoji: true },
            style: 'primary',
            action_id: 'approve_commentary',
            value: encodedProposal,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '✏️  Edit', emoji: true },
            action_id: 'edit_commentary',
            url: editUrl,
          },
        ],
      },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Slack webhook failed (${res.status}): ${text}`)
  }
}

// ─── Update a Slack message via response_url ──────────────────────────────────
// Used after Approve/Edit to replace the original message with a status update.

export async function updateSlackMessage(
  responseUrl: string,
  text: string,
): Promise<void> {
  await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      replace_original: true,
      text,
    }),
  })
}
