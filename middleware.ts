// Middleware: protect all /admin/* routes.
// Checks for a signed session cookie. If missing or invalid, redirects to
// /admin/login. The cookie is set by /api/admin/login after password verification.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOGIN_PATH = '/admin/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page itself through (avoid redirect loop)
  if (pathname === LOGIN_PATH) return NextResponse.next()

  // Check for the session cookie
  const session = request.cookies.get('admin_session')?.value
  const expected = process.env.ADMIN_SESSION_TOKEN

  // ADMIN_SESSION_TOKEN is the pre-computed HMAC stored in Vercel env vars.
  // It's generated once by running: node -e "
  //   const {createHmac}=require('crypto');
  //   console.log(createHmac('sha256',process.env.ADMIN_SECRET).update('admin-session').digest('hex'))
  // "
  // Then stored as ADMIN_SESSION_TOKEN in Vercel. This way the middleware
  // doesn't need to import crypto (Edge Runtime compatible).

  if (!expected || !session || session !== expected) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = LOGIN_PATH
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
