import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * Optimistic check only: reads the session cookie, does not hit the DB.
 * Redirects unauthenticated requests away from /admin before any Server
 * Component renders. The real permission check happens in Server Actions
 * via lib/auth-guard.ts's requirePermission() — this is a fast-path UX
 * improvement, not the security boundary.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
