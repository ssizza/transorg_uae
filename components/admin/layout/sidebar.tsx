"use client"

import type React from "react"

import {
  Users2,
  Shield,
  Settings,
  HelpCircle,
  Menu,
  Home,
  Gift,
  X,
  Star,
  Calendar,
  List,
  BookOpen,
  ImageIcon,
  Users,
} from "lucide-react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSiteBrandingAction } from "@/lib/actions/system-settings"
import Image from "next/image"

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [siteName, setSiteName] = useState("Admin Panel")
  const [logoData, setLogoData] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    async function fetchBranding() {
      const result = await getSiteBrandingAction()
      if (result.success && result.data) {
        setSiteName(result.data.siteName)
        setLogoData(result.data.logoData)
      }
    }
    fetchBranding()
  }, [])

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false,
  }: {
    href: string
    icon: React.ElementType
    children: React.ReactNode
    isActive?: boolean
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]",
        )}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-[#0F0F12] border shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Sidebar - Fixed position, doesn't push content */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0F0F12] border-r border-gray-200 dark:border-[#1F1F23]",
          "transform transition-transform duration-300 ease-in-out",
          // On desktop: always visible
          "lg:translate-x-0",
          // On mobile: toggle visibility
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-[#1F1F23]">
            <Link href="/admin" className="flex items-center gap-3">
              {logoData ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoData || "/placeholder.svg"}
                    alt={siteName}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{siteName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{siteName}</span>
            </Link>
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {/* General Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  General
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin" icon={Home} isActive={pathname === "/admin"}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/admin/services" icon={Gift} isActive={pathname === "/admin/services"}>
                    Services
                  </NavItem>
                  <NavItem href="/admin/projects" icon={Star} isActive={pathname === "/admin/projects"}>
                    Projects
                  </NavItem>
                  <NavItem href="/admin/events" icon={Calendar} isActive={pathname === "/admin/events"}>
                    Events
                  </NavItem>
                  <NavItem href="/admin/members" icon={Users2} isActive={pathname === "/admin/members"}>
                    Members
                  </NavItem>
                </div>
              </div>

              {/* Content Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Content
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/blog/categories" icon={List} isActive={pathname === "/admin/blog/categories"}>
                    Categories
                  </NavItem>
                  <NavItem href="/admin/blog" icon={BookOpen} isActive={pathname === "/admin/blog"}>
                    Posts
                  </NavItem>
                </div>
              </div>

              {/* Media Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Media
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/media" icon={ImageIcon} isActive={pathname === "/admin/media"}>
                    Library
                  </NavItem>
                  <NavItem href="/admin/gallery" icon={Star} isActive={pathname === "/admin/gallery"}>
                    Gallery
                  </NavItem>
                </div>
              </div>

              {/* System Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  System
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/team" icon={Users} isActive={pathname === "/admin/team"}>
                    Admins
                  </NavItem>
                  <NavItem href="/admin/team_volunters" icon={Users} isActive={pathname === "/admin/team_volunters"}>
                    Volunteers
                  </NavItem>
                  <NavItem href="/admin/subscribers" icon={Shield} isActive={pathname === "/admin/subscribers"}>
                    Subscribers
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/admin/system" icon={Settings} isActive={pathname === "/admin/system"}>
                Settings
              </NavItem>
              <NavItem href="/admin/#" icon={HelpCircle} isActive={pathname === "/admin/#"}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}

export default Sidebar
