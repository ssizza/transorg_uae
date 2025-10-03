"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DynamicLoginForm = dynamic(
  () => import("@/components/auth/LoginForm"),
  {
    ssr: false,
  }
)

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicLoginForm />
      </Suspense>
    </div>
  )
}
