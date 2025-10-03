"use client"

import { Bell, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { logout } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopNavProps {
  breadcrumbs?: BreadcrumbItem[]
  email: string
}

export function TopNav({ breadcrumbs = [{ label: "Dashboard" }], email }: TopNavProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await logout()
        // Redirect is handled by the logout action
      } catch (error) {
        console.error("[Logout Error]", error)
        // Fallback redirect if action fails
        router.push("/authentication/login")
      }
    })
  }

  return (
    <div className="flex h-full items-center justify-between px-6 bg-white dark:bg-[#0F0F12]">
      {/* Breadcrumbs */}
      <div className="hidden items-center space-x-1 sm:flex">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-500 dark:text-gray-400" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-[#1F1F23]">
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {email}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
              {isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default TopNav
