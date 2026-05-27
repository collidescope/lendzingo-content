// GET /api/cron/rate-commentary
// Runs on the 1st and 15th of every month at 10:00 UTC (configured in vercel.json).
//
// What it does:
//  1. Verifies the request is from Vercel's cron scheduler
//  2. Fetches the latest PMMS mortgage rates
//  3. Looks up the previous approved commentary for the rate comparison
//  4. Calls Claude to draft the rate summary + outlook copy
//  5. Posts the proposal to Slack for approval

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { postCommentaryProposal } from '@/lib/slack'

// ─── Period label helper ───────────────────────────────────────────────────────
// Builds a human-readable label for the current two-week window.
// e.g. "June 1–14, 2026" or "June 15–30, 2026"

function buildPeriodLabel(): string {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
  const year = now.getUTCFullYear()
  const day = now.getUTCDate()
  const isFirstHalf = day <= 14

  const lastDay = new Date(year, now.getUTCMonth() + 1, 0).getDate()
  return isFirstHalf
    ? `${month} 1–14, ${year}`
    : `${month} 15–${lastDay}, ${year}`
}

// ─── AI copy generation ────────────────────────────────────────────────────────

async function generateCommentary(
  rate30: number,
  rate15: number | null,
  prevRate30: number | null,
): Promise<{ rateSummary: string; outlook: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[rate-commentary cron] ANTHROPIC_API_KEY not set — using placeholder copy')
    return {
      rateSummary: `The 30-year fixed rate is currently at ${rate30}%.${prevRate30 ? ` That's a ${rate30 < prevRate30 ? 'decrease' : 'increase'} of ${Math.abs(rate30 - prevRate30).toFixed(2)}% from the previous period.` : ''} Rates continue to be shaped by inflation data and Federal Reserve policy signals.`,
      outlook: 'Most forecasters expect rates to remain relatively stable in the near term, with movement tied to upcoming economic data releases and Fed communications. We\'ll continue monitoring and update you next month.',
    }
  }

  const client = new Anthropic({ apiKey })

  const rateContext = prevRate30
    ? `The 30-year fixed rate moved from ${prevRate30}% to ${rate30}% (${rate30 < prevRate30 ? 'down' : 'up'} ${Math.abs(rate30 - prevRate30).toFixed(2)}%).`
    : `The current 30-year fixed rate is ${rate30}%.`

  const prompt = `You are writing copy for a monthly mortgage rate update email sent to homeowners who are tracking refinance opportunities. Keep the tone clear, honest, and helpful — not salesy.

Current mortgage rate data (Freddie Mac PMMS):
- 30-year fixed: ${rate30}%${rate15 ? `\n- 15-year fixed: ${rate15}%` : ''}
- ${rateContext}

Write two short pieces of copy based on current mortgage market conditions:

1. RATE SUMMARY (2–3 sentences): Plain-English explanation of what happened with mortgage rates this period and the key economic factors that drove the movement. Keep it accessible to a non-expert homeowner.

2. EXPERT OUTLOOK (2–3 sentences): What most housing economists and forecasters currently predict for mortgage rates over the next 4–6 weeks. Be balanced — don't hype a drop or catastrophize a rise.

Respond with valid JSON only, no markdown:
{"rateSummary": "...", "outlook": "..."}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(text)
    if (!parsed.rateSummary || !parsed.outlook) throw new Error('Missing fields')
    return { rateSummary: parsed.rateSummary, outlook: parsed.outlook }
  } catch {
    console.error('[rate-commentary cron] Failed to parse AI response:', text)
    // Fall back to a safe default rather than crashing
    return {
      rateSummary: `The 30-year fixed rate is currently ${rate30}%. ${rateContext}`,
      outlook: 'Forecasters expect rates to remain data-dependent in the near term. We\'ll keep monitoring and update you at the next cycle.',
    }
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  // ── Verify this is a legitimate Vercel cron call ────────────────────────
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('[rate-commentary cron] Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://content.lendzingo.com'

    // ── 1. Fetch current PMMS rates ───────────────────────────────────────
    const pmmsRes = await fetch(`${siteUrl}/api/pmms`)
    if (!pmmsRes.ok) throw new Error(`PMMS fetch failed: ${pmmsRes.status}`)
    const pmms = await pmmsRes.json()
    const rate30: number = pmms.rate30
    const rate15: number | null = pmms.rate15 ?? null

    // ── 2. Get previous approved rate from DB (stubbed) ───────────────────
    // Uncomment when DB is connected:
    //
    // const [rows] = await db.execute(
    //   `SELECT pmms_rate_30, pmms_rate_15 FROM rate_commentary
    //    WHERE status = 'approved' ORDER BY approved_at DESC LIMIT 1`
    // )
    // const prevRate30: number | null = rows[0]?.pmms_rate_30 ?? null
    // const prevRate15: number | null = rows[0]?.pmms_rate_15 ?? null
    const prevRate30: number | null = null  // stub
    const prevRate15: number | null = null  // stub

    // ── 3. Generate AI copy ───────────────────────────────────────────────
    console.log(`[rate-commentary cron] Generating copy for rate30=${rate30}, prevRate30=${prevRate30}`)
    const { rateSummary, outlook } = await generateCommentary(rate30, rate15, prevRate30)

    // ── 4. Build period label ─────────────────────────────────────────────
    const periodLabel = buildPeriodLabel()

    // ── 5. Post to Slack for approval ─────────────────────────────────────
    await postCommentaryProposal({
      periodLabel,
      pmmsRate30: rate30,
      pmmsRate15: rate15,
      pmmsRatePrev30: prevRate30,
      pmmsRatePrev15: prevRate15,
      rateSummary,
      outlook,
    })

    console.log(`[rate-commentary cron] Successfully posted proposal for ${periodLabel} to Slack`)
    return NextResponse.json({ ok: true, periodLabel, rate30 })

  } catch (err: any) {
    console.error('[rate-commentary cron] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
