"use server"

import { getAdminByEmail, getAdminByUsername, updateAdmin, updateLastLogin } from "@/lib/db/admins"
import { getRolePermissions } from "@/lib/db/permissions"
import { createSession, destroySession } from "@/lib/auth/session"
import { generateOTP, saveOTP, verifyOTP, sendOTP } from "@/lib/auth/otp"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

interface ActionResult {
  success: boolean
  error?: string
  message?: string
}

/**
 * Login action - authenticates user and creates session.
 */
export async function login(email: string, password: string): Promise<ActionResult> {
  try {
    // Validate input
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    // Fetch admin by email
    const admin = await getAdminByEmail(email)

    if (!admin) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if admin is active
    if (admin.status !== "active") {
      return {
        success: false,
        error: `Account is ${admin.status}. Please contact administrator.`,
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Fetch permissions
    const permissions = admin.role_id ? await getRolePermissions(admin.role_id) : []

    // Create session
    await createSession({
      adminId: admin.id,
      email: admin.email,
      role: admin.role_name || "user",
      permissions: permissions.map((p) => p.name),
    })

    // Update last login
    await updateLastLogin(admin.id)

    return { success: true, message: "Login successful" }
  } catch (error) {
    console.error("[Login Error]", error)
    return { success: false, error: "An error occurred during login" }
  }
}

/**
 * Logout action - destroys session and redirects to login.
 */
export async function logout(): Promise<void> {
  await destroySession()
  redirect("/authentication/login")
}

/**
 * Checks if an email has been invited.
 */
export async function checkInvitedEmail(email: string): Promise<ActionResult> {
  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    const admin = await getAdminByEmail(email)

    if (!admin) {
      return { success: false, error: "Email not found in our system" }
    }

    if (admin.status !== "invited") {
      return {
        success: false,
        error: "This email is not eligible for registration",
      }
    }

    return { success: true, message: "Email verified successfully" }
  } catch (error) {
    console.error("[Check Invited Email Error]", error)
    return { success: false, error: "An error occurred while verifying email" }
  }
}

/**
 * Registers a new user (updates invited admin to active).
 */
export async function registerUser(userData: {
  email: string
  username: string
  password: string
  fname: string
  sname: string
  dob: string
  position: string
}): Promise<ActionResult> {
  try {
    // Validate input
    if (!userData.email || !userData.username || !userData.password) {
      return { success: false, error: "Email, username, and password are required" }
    }

    // Check if email is invited
    const admin = await getAdminByEmail(userData.email)

    if (!admin) {
      return { success: false, error: "Email not found in our system" }
    }

    if (admin.status !== "invited") {
      return { success: false, error: "This email is not eligible for registration" }
    }

    // Check if username already exists
    const existingUsername = await getAdminByUsername(userData.username)
    if (existingUsername) {
      return { success: false, error: "Username already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Update admin record
    await updateAdmin(admin.id, {
      username: userData.username,
      password: hashedPassword,
      fname: userData.fname,
      sname: userData.sname,
      dob: userData.dob,
      position: userData.position,
      status: "active",
    })

    return { success: true, message: "Registration successful" }
  } catch (error) {
    console.error("[Register User Error]", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

/**
 * Initiates OTP verification by generating and sending OTP.
 */
export async function initiateOTPVerification(email: string): Promise<ActionResult> {
  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    const otp = generateOTP()
    await saveOTP(email, otp)
    await sendOTP(email, otp)

    return { success: true, message: "OTP sent successfully" }
  } catch (error) {
    console.error("[Initiate OTP Error]", error)
    return { success: false, error: "Failed to send OTP" }
  }
}

/**
 * Verifies an OTP code.
 */
export async function verifyOTPAction(email: string, otp: string): Promise<ActionResult> {
  try {
    if (!email || !otp) {
      return { success: false, error: "Email and OTP are required" }
    }

    const isValid = await verifyOTP(email, otp)

    if (!isValid) {
      return { success: false, error: "Invalid or expired OTP" }
    }

    return { success: true, message: "OTP verified successfully" }
  } catch (error) {
    console.error("[Verify OTP Error]", error)
    return { success: false, error: "An error occurred while verifying OTP" }
  }
}
