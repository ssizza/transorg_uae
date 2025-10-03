import { query } from "./index"

export interface OtpRecord {
  id: number
  email: string
  otp: string
  expires_at: Date
  created_at: string
}

/**
 * Creates an OTP entry for an email.
 */
export async function createOtp(email: string, otp: string): Promise<void> {
  await query("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [
    email,
    otp,
  ])
}

/**
 * Verifies an OTP for an email, checking if it's valid and not expired.
 */
export async function verifyOtp(email: string, otp: string): Promise<OtpRecord | null> {
  const results = await query<OtpRecord>("SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()", [
    email,
    otp,
  ])
  return results[0] || null
}

/**
 * Deletes an OTP by its ID.
 */
export async function deleteOtp(id: number): Promise<void> {
  await query("DELETE FROM otps WHERE id = ?", [id])
}

/**
 * Deletes all expired OTPs (cleanup function).
 */
export async function deleteExpiredOtps(): Promise<void> {
  await query("DELETE FROM otps WHERE expires_at < NOW()")
}
