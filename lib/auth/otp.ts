import { randomBytes } from "crypto"
import { createOtp, verifyOtp as verifyOtpDb } from "@/lib/db/otp"

/**
 * Generates a 6-character OTP.
 */
export function generateOTP(): string {
  return randomBytes(3).toString("hex").toUpperCase()
}

/**
 * Saves an OTP to the database with 10-minute expiration.
 */
export async function saveOTP(email: string, otp: string): Promise<void> {
  await createOtp(email, otp)
}

/**
 * Verifies an OTP for an email.
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const otpRecord = await verifyOtpDb(email, otp)
  return !!otpRecord
}

/**
 * Sends an OTP via email.
 * TODO: Implement actual email sending logic.
 */
export async function sendOTP(email: string, otp: string): Promise<void> {
  // TODO: Implement email sending using your preferred email service
  // For now, just log it
  console.log(`[OTP] Sending OTP ${otp} to ${email}`)

  // Example implementation with nodemailer or similar:
  // await emailService.send({
  //   to: email,
  //   subject: "Your OTP Code",
  //   text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
  // })
}
