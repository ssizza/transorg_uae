import { query } from "./index"

export interface SystemSettings {
  id: number
  site_name: string
  logo_data: string | null
  active_template: string
  cur_name: string
  cur_symb: string
  currency_format: number
  email_from: string
  email_from_name: string
  mail_config: string | null
  base_color: string
  secondary_color: string
  multi_lang: number
  force_ssl: number
  maintenance_mode: number
  secure_pass: string | null
  registration: number
  agree: string | null
  socialite_credentials: string | null
  last_cron: string | null
  available_version: string
  systema_customized: number
  created_at: string
  updated_at: string
}

/**
 * Get system settings
 */
export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const results = await query<SystemSettings>("SELECT * FROM system_settings WHERE id = 1 LIMIT 1")
    return results[0] || null
  } catch (error) {
    console.error("[System Settings] Error fetching settings:", error)
    return null
  }
}

/**
 * Get site branding (logo and name)
 */
export async function getSiteBranding(): Promise<{
  siteName: string
  logoData: string | null
} | null> {
  try {
    const results = await query<Pick<SystemSettings, "site_name" | "logo_data">>(
      "SELECT site_name, logo_data FROM system_settings WHERE id = 1 LIMIT 1",
    )

    if (results[0]) {
      return {
        siteName: results[0].site_name,
        logoData: results[0].logo_data,
      }
    }

    return null
  } catch (error) {
    console.error("[System Settings] Error fetching branding:", error)
    return null
  }
}

/**
 * Update system settings
 */
export async function updateSystemSettings(
  settings: Partial<Omit<SystemSettings, "id" | "created_at" | "updated_at">>,
): Promise<boolean> {
  try {
    const fields = Object.keys(settings)
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.values(settings)

    await query(`UPDATE system_settings SET ${fields}, updated_at = NOW() WHERE id = 1`, values)

    return true
  } catch (error) {
    console.error("[System Settings] Error updating settings:", error)
    return false
  }
}
