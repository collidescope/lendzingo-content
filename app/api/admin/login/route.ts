// POST /api/admin/login
// Verifies the submitted password against ADMIN_PASSWORD env var.
// On success, sets a signed httpOnly session cookie valid for 7 days.
//
// Required env vars:
//   ADMIN_PASSWORD      — the password you choose (set in Vercel)
//   ADMIN_SECRET        — a random secret string used to sign the session token
//   ADMIN_SESSION_TOKEN — pre-computed HMAC of "admin-session" using ADMIN_SECRET
//
// To generate ADMIN_SESSION_TOKEN, run once in a terminal:
//   node -e "
//     const {createHmac}=require('crypto');
//     const secret='YOUR_ADMIN_SECRET_HERE';
//     console.log(createHmac('sha256',secret).update('admin-session').digest('hex'));
//   "
// Then paste the output as the ADMIN_SESSION_TOKEN value in Vercel.

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required.' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    const adminSecret   = process.env.ADMIN_SECRET
    const sessionToken  = process.env.ADMIN_SESSION_TOKEN

    if (!adminPassword || !adminSecret || !sessionToken) {
      console.error('[admin/login] Missing required env vars: ADMIN_PASSWORD, ADMIN_SECRET, or ADMIN_SESSION_TOKEN')
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    // ── Timing-safe password comparison ─────────────────────────────────────
    // Hash both sides so they're always the same length, enabling timingSafeEqual.
    const expected = createHmac('sha256', adminSecret).update(adminPassword).digest()
    const submitted = createHmac('sha256', adminSecret).update(password).digest()

    if (!timingSafeEqual(expected, submitted)) {
      // Small delay to slow brute-force attempts
      await new Promise((r) => setTimeout(r, 400))
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    // ── Set session cookie ────────────────────────────────────────────────────
    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response

  } catch (err) {
    console.error('[admin/login] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
