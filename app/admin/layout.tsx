import type React from "react"
import { Inter } from "next/font/google"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/admin/layout/sidebar"
import TopNav from "@/components/admin/layout/topnav"
import { ThemeProvider } from "@/components/admin/layout/theme-provider"
import { getSession } from "@/lib/auth/session"

const inter = Inter({ subsets: ["latin"] })

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/authentication/login")
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Sidebar - Fixed position, doesn't affect layout */}
          <Sidebar />

          {/* Main content area - Fixed left margin to account for sidebar */}
          <div className="lg:ml-64">
            {/* Sticky Header */}
            <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-[#1F1F23] bg-white dark:bg-[#0F0F12]">
              <TopNav email={session.email} />
            </header>

            {/* Scrollable Main Content */}
            <main className="p-6 min-h-screen bg-white dark:bg-[#0F0F12]">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
