// GET /api/cron/send-emails
// Runs daily at 10:00 UTC (configured in vercel.json).
// Each user receives their first email 30 days after enrollment, then on
// that same calendar day every subsequent month (stored as send_day_of_month).
//
// Flow:
//  1. Verify Vercel cron auth
//  2. Fetch the active approved rate commentary
//  3. Fetch current PMMS rates
//  4. Query enrollments due today:
//     - send_day_of_month matches today's day (or last day of month for overflow)
//     - enrolled 30+ days ago
//     - not already sent this calendar month
//  5. Calculate each user's personal snapshot
//  6. Build and send their email via SendGrid
//  7. Update their last_pmms_rate and last_savings for next month's delta

import { NextResponse } from 'next/server'
import { calculateSnapshot } from '@/lib/refi-calculator'
import { buildRefiEmail } from '@/lib/email-template'
import { sendEmail, buildUnsubscribeUrl } from '@/lib/sendgrid'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Enrollment {
  id: number
  email: string
  first_name: string | null
  loan_balance: number
  current_rate: number
  monthly_payment: number
  loan_start_month: number
  loan_start_year: number
  original_term: 15 | 30
  new_term: 15 | 30
  target_savings: number
  credit_score: string
  send_day_of_month: number        // day of month this user receives their email
  last_pmms_rate: number | null    // rate used in the previous email
  last_monthly_savings: number | null  // savings from the previous email
}

interface ActiveCommentary {
  period_label: string
  pmms_rate_30: number
  pmms_rate_15: number | null
  pmms_prev_30: number | null
  rate_summary: string
  outlook: string
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  // ── Verify this is a legitimate Vercel cron call ────────────────────────
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('[send-emails cron] Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://content.lendzingo.com'
  const results = { sent: 0, skipped: 0, errors: 0 }

  try {
    // ── 1. Fetch current PMMS rates ─────────────────────────────────────
    const pmmsRes = await fetch(`${siteUrl}/api/pmms`)
    if (!pmmsRes.ok) throw new Error(`PMMS fetch failed: ${pmmsRes.status}`)
    const pmms = await pmmsRes.json()
    const pmmsRate: number = pmms.rate30
    const usingFallback: boolean = pmms.source === 'fallback'
    const weekOf: string | null = pmms.weekOf ?? null

    // ── 2. Fetch active commentary from DB ──────────────────────────────
    // Uncomment when DB is connected:
    //
    // const [commentaryRows] = await db.execute(
    //   `SELECT * FROM rate_commentary WHERE status = 'approved'
    //    ORDER BY approved_at DESC LIMIT 1`
    // )
    // if (!commentaryRows.length) {
    //   console.warn('[send-emails cron] No approved commentary found — aborting')
    //   return NextResponse.json({ error: 'No approved commentary' }, { status: 400 })
    // }
    // const commentary: ActiveCommentary = commentaryRows[0]

    // ── Stub commentary (remove when DB is connected) ───────────────────
    const commentary: ActiveCommentary = {
      period_label: 'June 2026',
      pmms_rate_30: pmmsRate,
      pmms_rate_15: pmms.rate15 ?? null,
      pmms_prev_30: null,
      rate_summary: 'Rate summary pending — commentary not yet approved for this period.',
      outlook: 'Outlook pending — commentary not yet approved for this period.',
    }

    // ── 3. Fetch enrollments due today ──────────────────────────────────
    //
    // Rules:
    //   a) send_day_of_month matches today's day-of-month
    //      OR today is the last day of the month and send_day_of_month > last day
    //      (handles users enrolled on the 29th/30th/31st in shorter months)
    //   b) enrolled at least 30 days ago (first email delay)
    //   c) not already sent this calendar month (dedup)
    //
    // Uncomment when DB is connected:
    //
    // const [enrollments] = await db.execute(
    //   `SELECT * FROM refi_enrollments
    //    WHERE unsubscribed_at IS NULL
    //      AND email IS NOT NULL
    //      AND enrolled_at <= DATE_SUB(NOW(), INTERVAL 30 DAY)
    //      AND (
    //        last_sent_at IS NULL
    //        OR (YEAR(last_sent_at) < YEAR(NOW()))
    //        OR (YEAR(last_sent_at) = YEAR(NOW()) AND MONTH(last_sent_at) < MONTH(NOW()))
    //      )
    //      AND (
    //        send_day_of_month = DAY(CURDATE())
    //        OR (
    //          DAY(CURDATE()) = DAY(LAST_DAY(CURDATE()))
    //          AND send_day_of_month > DAY(LAST_DAY(CURDATE()))
    //        )
    //      )`,
    // )

    // ── Stub enrollment list (remove when DB is connected) ──────────────
    const enrollments: Enrollment[] = [
      // Example — real data comes from DB
      // {
      //   id: 1,
      //   email: 'test@example.com',
      //   first_name: 'Sarah',
      //   loan_balance: 285000,
      //   current_rate: 7.25,
      //   monthly_payment: 2184,
      //   loan_start_month: 6,
      //   loan_start_year: 2022,
      //   original_term: 30,
      //   new_term: 30,
      //   target_savings: 200,
      //   credit_score: '720+',
      //   send_day_of_month: 15,
      //   last_pmms_rate: null,
      //   last_monthly_savings: null,
      // }
    ]

    if (enrollments.length === 0) {
      console.log('[send-emails cron] No active enrollments — nothing to send')
      return NextResponse.json({ ok: true, ...results })
    }

    // ── 4. Build the month label ────────────────────────────────────────
    const now = new Date()
    const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

    // ── 5. Loop through enrollments and send ────────────────────────────
    for (const enrollment of enrollments) {
      try {
        // Calculate this user's personal snapshot
        const snapshot = calculateSnapshot(
          {
            currentBalance: enrollment.loan_balance,
            currentMonthlyPayment: enrollment.monthly_payment,
            currentRate: enrollment.current_rate,
            loanStartMonth: enrollment.loan_start_month,
            loanStartYear: enrollment.loan_start_year,
            originalTerm: enrollment.original_term,
            newTerm: enrollment.new_term,
            targetMonthlySavings: enrollment.target_savings,
            creditScoreTier: enrollment.credit_score,
          },
          pmmsRate,
          usingFallback,
          weekOf,
        )

        // Calculate month-over-month deltas
        const prevMonthlySavings = enrollment.last_monthly_savings ?? null
        const prevNewMonthlyPayment = enrollment.last_pmms_rate !== null
          ? Math.round(
              (enrollment.loan_balance * (enrollment.last_pmms_rate / 100 / 12)) /
              (1 - Math.pow(1 + enrollment.last_pmms_rate / 100 / 12, -(enrollment.new_term * 12)))
            )
          : null

        // Build the email HTML
        const html = buildRefiEmail({
          firstName: enrollment.first_name,
          currentMonthlyPayment: snapshot.currentMonthlyPayment,
          newMonthlyPayment: snapshot.newMonthlyPayment,
          monthlySavings: snapshot.monthlySavings,
          targetMonthlySavings: snapshot.targetMonthlySavings,
          progressPercent: snapshot.progressPercent,
          goalReached: snapshot.goalReached,
          adjustedRate: snapshot.adjustedRate,
          prevMonthlySavings,
          prevNewMonthlyPayment,
          prevPmmsRate30: enrollment.last_pmms_rate,
          pmmsRate30: pmmsRate,
          pmmsRate15: commentary.pmms_rate_15,
          weekOf,
          rateSummary: commentary.rate_summary,
          outlook: commentary.outlook,
          monthLabel,
          siteBaseUrl: siteUrl,
          unsubscribeUrl: buildUnsubscribeUrl(enrollment.email, siteUrl),
        })

        // Send the email
        await sendEmail({
          to: enrollment.email,
          subject: `Your Refi Tracker Update — ${monthLabel}`,
          html,
        })

        // ── Update last_pmms_rate and last_monthly_savings in DB ────────
        // Uncomment when DB is connected:
        //
        // await db.execute(
        //   `UPDATE refi_enrollments
        //    SET last_pmms_rate = ?, last_monthly_savings = ?, last_sent_at = NOW()
        //    WHERE id = ?`,
        //   [pmmsRate, snapshot.monthlySavings, enrollment.id]
        // )

        results.sent++
        console.log(`[send-emails cron] Sent to ${enrollment.email}`)

      } catch (err) {
        results.errors++
        console.error(`[send-emails cron] Failed for ${enrollment.email}:`, err)
        // Continue to next enrollment — don't let one failure stop the batch
      }
    }

    console.log(`[send-emails cron] Done. Sent: ${results.sent}, Skipped: ${results.skipped}, Errors: ${results.errors}`)
    return NextResponse.json({ ok: true, ...results })

  } catch (err: any) {
    console.error('[send-emails cron] Fatal error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
