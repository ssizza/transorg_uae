import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// Define protected routes
const protectedRoutes = ["/admin"]
const authRoutes = ["/authentication/login", "/authentication/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  // Verify token
  let session = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      session = payload
    } catch (error) {
      console.error("[Middleware] Token verification failed:", error)
    }
  }

  // Redirect logic
  if (isProtectedRoute && !session) {
    // User is not authenticated, redirect to login
    const url = new URL("/authentication/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && session) {
    // User is already authenticated, redirect to admin
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
