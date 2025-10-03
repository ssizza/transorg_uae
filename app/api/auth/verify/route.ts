import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ authenticated: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.adminId,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      },
    })
  } catch (error) {
    console.error("[Auth Verify Error]", error)
    return NextResponse.json({ authenticated: false, error: "Verification failed" }, { status: 500 })
  }
}
