"use client"
import { toast as sonnerToast } from "sonner"
import type { ToasterProps, Toaster } from "@/components/ui/sonner"

// Simple wrapper around Sonner's toast function
export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        sonnerToast.dismiss(toastId)
      } else {
        sonnerToast.dismiss()
      }
    },
  }
}

// Export toast function directly for convenience
export { sonnerToast as toast }

// Export types for backward compatibility
export type { ToasterProps, Toaster }
