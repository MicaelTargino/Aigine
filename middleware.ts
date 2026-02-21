import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token.value, secret)
    if (payload.authenticated === true) {
      return NextResponse.next()
    }
  } catch {
    // Invalid token
  }

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*']
}