import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disabled auth check
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/basics/:path*',
    '/chat/:path*',
    '/documents/:path*',
    '/vectors/:path*',
    '/advanced/:path*',
  ],
} 