import { cookies } from "next/headers"
import { jwtVerify, SignJWT, type JWTPayload } from "jose"
import { cache } from "react"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export interface SessionData extends JWTPayload {
  adminId: number
  email: string
  role: string
  permissions: string[]
}

/**
 * Creates a JWT token and sets it as an httpOnly cookie.
 */
export async function createSession(data: SessionData): Promise<void> {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .setIssuedAt()
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

/**
 * Verifies and decodes the JWT token from cookies.
 * Uses React cache to prevent multiple verifications in the same request.
 */
export const getSession = cache(async (): Promise<SessionData | null> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionData
  } catch (error) {
    console.error("Session verification failed:", error)
    return null
  }
})

/**
 * Destroys the session by clearing the auth cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}

/**
 * Checks if user has a specific permission.
 */
export async function hasPermission(permissionName: string): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return session.permissions.includes(permissionName)
}

/**
 * Checks if user has any of the specified permissions.
 */
export async function hasAnyPermission(permissionNames: string[]): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return permissionNames.some((permission) => session.permissions.includes(permission))
}

/**
 * Checks if user has all of the specified permissions.
 */
export async function hasAllPermissions(permissionNames: string[]): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return permissionNames.every((permission) => session.permissions.includes(permission))
}
