import { Inter } from "next/font/google"
import "@/app/admin/globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-background flex flex-col`}
      >
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  )
}
