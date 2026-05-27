// GET /api/email-preview
// Renders the monthly refi email with realistic sample data so you can
// preview it in a browser. Remove or password-protect before going to prod.

import { NextResponse } from 'next/server'
import { buildRefiEmail } from '@/lib/email-template'

export async function GET() {
  const html = buildRefiEmail({
    firstName: 'Sarah',

    // Snapshot
    currentMonthlyPayment: 2_184,
    newMonthlyPayment: 2_041,
    monthlySavings: 143,
    targetMonthlySavings: 200,
    progressPercent: 71.5,
    goalReached: false,
    adjustedRate: 6.68,

    // Month-over-month (remove these two lines to preview a first-send)
    prevMonthlySavings: 120,
    prevNewMonthlyPayment: 2_064,
    prevPmmsRate30: 6.94,

    // Live rates
    pmmsRate30: 6.81,
    pmmsRate15: 6.22,
    weekOf: 'May 22, 2026',

    // Commentary — placeholder until Slack approval flow is wired up
    rateSummary:
      'The 30-year fixed rate fell 13 basis points this week, the largest single-week drop since February. ' +
      'A softer-than-expected jobs report eased inflation concerns and pushed Treasury yields lower, ' +
      'which typically pulls mortgage rates down alongside them.',

    outlook:
      'Most forecasters expect rates to hold in the mid-6% range through the summer, ' +
      'with the next significant move likely tied to the Fed\'s July meeting. ' +
      'If inflation data continues to cool, a rate cut later in the year could push ' +
      '30-year mortgages toward the high 5s by Q4.',

    monthLabel: 'June 2026',
    siteBaseUrl: 'https://content.lendzingo.com',
    unsubscribeUrl: 'https://content.lendzingo.com/unsubscribe?token=preview',
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
