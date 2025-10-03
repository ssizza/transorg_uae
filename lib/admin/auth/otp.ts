import { randomBytes } from "crypto"
import { query } from "@/lib/db"

export async function generateOTP(): Promise<string> {
  const otp = randomBytes(6).toString("hex").substring(0, 6)
  return otp
}

export async function saveOTP(email: string, otp: string): Promise<void> {
  await query(
    "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
    [email, otp]
  )
}

interface OtpRecord {
  id: number
  email: string
  otp: string
  expires_at: Date
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const [otpRecord] = await query<OtpRecord>(
    "SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()",
    [email, otp]
  )
  return !!otpRecord
}

export async function sendOTP(email: string, otp: string): Promise<void> {
  //Implementation for sending OTP via email or other methods.  This is a placeholder.
  console.log(`OTP ${otp} sent to ${email}`)
}
