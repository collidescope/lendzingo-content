import { NextResponse } from 'next/server'

// POST /api/rate-commentary
// Saves approved/edited commentary to the database.
// Called by /admin/rate-commentary AdminForm on submit.

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { periodLabel, pmmsRate30, pmmsRate15, pmmsRatePrev30, rateSummary, outlook } = body

    if (!rateSummary?.trim() || !outlook?.trim()) {
      return NextResponse.json({ error: 'rateSummary and outlook are required' }, { status: 400 })
    }

    // ── DB INSERT GOES HERE ────────────────────────────────────────────────
    // Uncomment when DB connection is available:
    //
    // await db.execute(
    //   `INSERT INTO rate_commentary
    //    (period_label, pmms_rate_30, pmms_rate_15, pmms_prev_30,
    //     rate_summary, outlook, status, approved_at)
    //    VALUES (?, ?, ?, ?, ?, ?, 'approved', NOW())`,
    //   [periodLabel, pmmsRate30, pmmsRate15 ?? null, pmmsRatePrev30 ?? null,
    //    rateSummary.trim(), outlook.trim()]
    // )
    //
    // -- Deactivate any previously active commentary --
    // await db.execute(
    //   `UPDATE rate_commentary SET status = 'superseded'
    //    WHERE status = 'approved' AND id != LAST_INSERT_ID()`
    // )
    // ──────────────────────────────────────────────────────────────────────

    console.log('[rate-commentary] Saved (stub):', { periodLabel, pmmsRate30, rateSummary: rateSummary.slice(0, 60) })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[rate-commentary] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
