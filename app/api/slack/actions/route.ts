// POST /api/slack/actions
// Receives interactive component payloads from Slack (button clicks).
// Slack requires a 200 response within 3 seconds.

import { NextResponse } from 'next/server'
import { verifySlackSignature, updateSlackMessage } from '@/lib/slack'
import type { CommentaryProposal } from '@/lib/slack'

export async function POST(request: Request) {
  const rawBody = await request.text()

  // ── Verify the request is genuinely from Slack ────────────────────────────
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (signingSecret) {
    const timestamp = request.headers.get('x-slack-request-timestamp') ?? ''
    const signature = request.headers.get('x-slack-signature') ?? ''
    const valid = verifySlackSignature(signingSecret, rawBody, timestamp, signature)
    if (!valid) {
      console.warn('[slack/actions] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } else {
    console.warn('[slack/actions] SLACK_SIGNING_SECRET not set — skipping verification')
  }

  // ── Parse the Slack payload ───────────────────────────────────────────────
  // Slack sends form-encoded data with a JSON payload field
  const params = new URLSearchParams(rawBody)
  const payloadRaw = params.get('payload')
  if (!payloadRaw) {
    return NextResponse.json({ error: 'No payload' }, { status: 400 })
  }

  let slackPayload: any
  try {
    slackPayload = JSON.parse(payloadRaw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const action = slackPayload?.actions?.[0]
  const actionId: string = action?.action_id ?? ''
  const responseUrl: string = slackPayload?.response_url ?? ''

  // ── Handle: Approve ───────────────────────────────────────────────────────
  if (actionId === 'approve_commentary') {
    try {
      const proposal: CommentaryProposal = JSON.parse(
        Buffer.from(action.value, 'base64').toString('utf-8'),
      )

      // ── DB INSERT GOES HERE ─────────────────────────────────────────────
      // When the DB connection is ready, uncomment and adapt:
      //
      // await db.execute(
      //   `INSERT INTO rate_commentary
      //    (period_label, pmms_rate_30, pmms_rate_15, pmms_prev_30, pmms_prev_15,
      //     rate_summary, outlook, status, approved_at)
      //    VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', NOW())
      //    ON DUPLICATE KEY UPDATE
      //      rate_summary = VALUES(rate_summary),
      //      outlook = VALUES(outlook),
      //      status = 'approved',
      //      approved_at = NOW()`,
      //   [proposal.periodLabel, proposal.pmmsRate30, proposal.pmmsRate15,
      //    proposal.pmmsRatePrev30, proposal.pmmsRatePrev15,
      //    proposal.rateSummary, proposal.outlook]
      // )
      // ───────────────────────────────────────────────────────────────────

      console.log('[slack/actions] Commentary approved:', {
        period: proposal.periodLabel,
        pmmsRate30: proposal.pmmsRate30,
      })

      // Replace the Slack message with a confirmation
      if (responseUrl) {
        await updateSlackMessage(
          responseUrl,
          `✅ *Commentary approved for ${proposal.periodLabel}.* It's now active for all Refi Tracker emails until the next update.`,
        )
      }
    } catch (err) {
      console.error('[slack/actions] Approve error:', err)
    }

    return NextResponse.json({ ok: true })
  }

  // ── Handle: Edit (link button — Slack opens the URL directly) ────────────
  // The Edit button uses a Slack link_button which opens the admin page in
  // the browser. No server-side handling needed — Slack just opens the URL.
  if (actionId === 'edit_commentary') {
    return NextResponse.json({ ok: true })
  }

  // ── Handle: Admin form save (from /admin/rate-commentary) ────────────────
  if (actionId === 'save_commentary') {
    // This is triggered when Scott submits the admin edit form.
    // Handled directly by the admin form POST, not from Slack.
    return NextResponse.json({ ok: true })
  }

  console.warn('[slack/actions] Unknown action_id:', actionId)
  return NextResponse.json({ ok: true })
}
