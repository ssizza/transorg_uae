"use server"

import { getSiteBranding } from "@/lib/db/system-settings"

/**
 * Get site branding information (logo and name)
 */
export async function getSiteBrandingAction() {
  try {
    const branding = await getSiteBranding()

    if (!branding) {
      return {
        success: false,
        error: "Failed to fetch site branding",
      }
    }

    return {
      success: true,
      data: branding,
    }
  } catch (error) {
    console.error("[Action] Error fetching site branding:", error)
    return {
      success: false,
      error: "An error occurred while fetching site branding",
    }
  }
}
