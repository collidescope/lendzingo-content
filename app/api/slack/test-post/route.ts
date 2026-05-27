// GET /api/slack/test-post
// Sends a sample commentary proposal to Slack so you can verify the webhook
// URL is working and preview how the approval message looks.
// Remove or password-protect before going to prod.

import { NextResponse } from 'next/server'
import { postCommentaryProposal } from '@/lib/slack'

export async function GET() {
  try {
    await postCommentaryProposal({
      periodLabel: 'June 1–14, 2026',
      pmmsRate30: 6.81,
      pmmsRate15: 6.22,
      pmmsRatePrev30: 6.94,
      pmmsRatePrev15: 6.35,
      rateSummary:
        'The 30-year fixed rate fell 13 basis points this week, the largest single-week drop since February. ' +
        'A softer-than-expected jobs report eased inflation concerns and pushed Treasury yields lower, ' +
        'which typically pulls mortgage rates down alongside them.',
      outlook:
        'Most forecasters expect rates to hold in the mid-6% range through the summer, ' +
        "with the next significant move likely tied to the Fed's July meeting. " +
        'If inflation data continues to cool, a rate cut later in the year could push ' +
        '30-year mortgages toward the high 5s by Q4.',
    })

    return NextResponse.json({ ok: true, message: 'Test message sent to Slack.' })
  } catch (err: any) {
    console.error('[slack/test-post]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
