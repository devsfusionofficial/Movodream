import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * Next.js 16 Proxy Middleware convention.
 * Redirects unauthenticated requests away from /admin to /admin/login.
 */
export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Allow login page, auth APIs, and static assets unconditionally
    if (
      pathname === '/admin/login' ||
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next')
    ) {
      return NextResponse.next()
    }

    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Proxy auth check error:', err)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
