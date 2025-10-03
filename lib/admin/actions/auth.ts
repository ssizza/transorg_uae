"use server"

import {
  getAdminByEmail,
  updateAdmin,
  getRolePermissions,
  getAdminByUsername,
} from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { generateOTP, saveOTP, verifyOTP, sendOTP } from "@/lib/admin/auth/otp"

interface Permission {
  name: string
}

interface Admin {
  id: number
  email: string
  password: string
  role_id?: number
  role_name?: string
  status: string
}

export async function login(email: string, password: string) {
  const admin = (await getAdminByEmail(email)) as Admin | undefined

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return { success: false, error: "Invalid credentials" }
  }

  let permissions: Permission[] = []
  if (admin.role_id) {
    permissions = await getRolePermissions(admin.role_id)
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT({
    adminId: admin.id,
    email: admin.email,
    role: admin.role_name,
    permissions: permissions.map((p) => p.name),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  ;(await cookieStore).set("token", "", { 
    expires: new Date(0),
    path: '/admin',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  return { success: true }
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const existingAdmin = (await getAdminByEmail(email)) as Admin | undefined

  if (!existingAdmin || existingAdmin.status !== "invited") {
    throw new Error("Invalid or uninvited email")
  }

  const hashedPassword = bcrypt.hashSync(password, 10)

  await updateAdmin(existingAdmin.id, {
    username,
    password: hashedPassword,
    status: "active",
  })

  return { success: true }
}

export async function initiateOTPVerification(email: string) {
  const otp = await generateOTP()
  await saveOTP(email, otp)
  await sendOTP(email, otp)
  return { success: true }
}

export async function verifyOTPAction(email: string, otp: string) {
  const isValid = await verifyOTP(email, otp)
  if (!isValid) {
    return { success: false, error: "Invalid OTP" }
  }
  return { success: true }
}

export async function checkInvitedEmail(email: string) {
  const admin = (await getAdminByEmail(email)) as Admin | undefined
  if (admin && admin.status === "invited") {
    return { success: true }
  }
  return { success: false }
}

interface UserData {
  email: string
  username: string
  password: string
  fname: string
  sname: string
  dob: string
  position: string
}

export async function registerUser(userData: UserData) {
  const admin = (await getAdminByEmail(userData.email)) as Admin | undefined

  if (!admin || admin.status !== "invited") {
    return { success: false, error: "Invalid or uninvited email" }
  }

  // Check if username already exists
  const existingUsername = await getAdminByUsername(userData.username)
  if (existingUsername) {
    return { success: false, error: "Username already exists" }
  }

  const hashedPassword = bcrypt.hashSync(userData.password, 10)

  try {
    await updateAdmin(admin.id, {
      username: userData.username,
      password: hashedPassword,
      fname: userData.fname,
      sname: userData.sname,
      dob: userData.dob,
      position: userData.position,
      status: "active",
    })
    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}
