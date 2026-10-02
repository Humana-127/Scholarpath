"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const profile = useAppStore((state) => state.profile)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const isLoginRoute = pathname.startsWith('/login')
      const isPublicRoute = pathname === '/' || pathname.startsWith('/scholarships')

      // User is authenticated via Supabase session OR local Zustand store profile (Mock Mode)
      const isAuthenticated = !!session || !!profile

      if (!isAuthenticated && !isLoginRoute && !isPublicRoute) {
        // Not logged in and accessing protected page -> Kick to Login Page
        router.replace('/login')
      } else if (isAuthenticated && isLoginRoute) {
        // Logged in but viewing login -> Send to Dashboard
        router.replace('/dashboard')
      } else {
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [pathname, router, profile])

  const isPublicRoute = pathname === '/' || pathname.startsWith('/scholarships') || pathname.startsWith('/login')

  // Prevent UI flashing before auth is verified on protected routes
  if (!isAuthorized && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4 text-center">
        <h2 className="text-xl animate-pulse text-muted-foreground">Verifying secure access...</h2>
      </div>
    )
  }

  return <>{children}</>
}

