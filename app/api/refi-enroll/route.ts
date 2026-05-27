import { NextResponse } from 'next/server'

// TODO: Replace stub with real DB insert once connection details are available.
// Expected payload shape:
// {
//   firstName: string | null
//   email: string
//   loanBalance: number | null
//   currentRate: number | null
//   monthlyPayment: number | null
//   loanStartMonth: number | null
//   loanStartYear: number | null
//   originalTerm: number | null       // 15 or 30
//   newTerm: number | null            // 15 or 30
//   targetSavings: number | null
//   creditScore: string | null        // e.g. "720+"
// }

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── DB INSERT GOES HERE ────────────────────────────────────────────────────
    // MySQL example (uncomment when connection string is available):
    //
    // import mysql from 'mysql2/promise'
    // const conn = await mysql.createConnection(process.env.DATABASE_URL!)
    // await conn.execute(
    //   `INSERT INTO refi_enrollments
    //    (first_name, email, loan_balance, current_rate, monthly_payment,
    //     loan_start_month, loan_start_year, original_term, new_term,
    //     target_savings, credit_score, enrolled_at, send_day_of_month)
    //    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), DAY(NOW()))`,
    //   [body.firstName, body.email, body.loanBalance, body.currentRate,
    //    body.monthlyPayment, body.loanStartMonth, body.loanStartYear,
    //    body.originalTerm, body.newTerm, body.targetSavings, body.creditScore]
    // )
    // await conn.end()
    //
    // send_day_of_month: stores the day-of-month the user enrolled (1–31).
    // The daily cron uses this to send each user their email on that same
    // calendar day every month, starting 30 days after enrollment.
    // Edge case: users enrolled on day 29/30/31 will receive their email on
    // the last day of shorter months (handled in the cron query via LAST_DAY).
    // ──────────────────────────────────────────────────────────────────────────

    console.log('[refi-enroll] New enrollment (stub):', {
      email: body.email,
      firstName: body.firstName,
      loanBalance: body.loanBalance,
      currentRate: body.currentRate,
      targetSavings: body.targetSavings,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[refi-enroll] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
