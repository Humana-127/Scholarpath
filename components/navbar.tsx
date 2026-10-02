"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GraduationCap, Menu, X, ShieldCheck, Bell, User, LogOut, RefreshCw, LayoutDashboard, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { ModeToggle } from "@/components/theme-toggle"
import { extendedScholarships } from "@/lib/scholarships-extended"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/scholarships", label: "Scholarships" },
  { href: "/profile", label: "My Profile" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { profile, notifications, generateDeadlineNotifications, clearSession } = useAppStore()
  const unreadCount = notifications.filter(n => !n.read).length

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    generateDeadlineNotifications(extendedScholarships)
  }, [generateDeadlineNotifications])

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setDropdownOpen(false), 200)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearSession()
    setDropdownOpen(false)
    router.push("/login")
    router.refresh()
  }

  const handleSwitchAccount = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearSession()
    setDropdownOpen(false)
    router.push("/login")
    router.refresh()
  }

  const initials = profile?.fullName
    ? profile.fullName.trim().split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            ScholarPath
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure &amp; Encrypted</span>
          </div>
          <ModeToggle />

          {mounted && profile ? (
            <div className="flex items-center gap-3">
              {/* Bell */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/dashboard" className="group">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Link>
              </Button>

              {/* Avatar with hover dropdown */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Avatar */}
                <button
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm ring-2 ring-transparent hover:ring-primary/40 transition-all cursor-pointer select-none"
                  aria-label="Account menu"
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  {initials}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-11 w-60 rounded-xl border bg-popover shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-foreground truncate">{profile.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{profile.email || "No email set"}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        View Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        My Dashboard
                      </Link>
                      <Link
                        href="/scholarships?saved=true"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                        Saved Scholarships
                      </Link>
                    </div>

                    <div className="border-t py-1">
                      <button
                        onClick={handleSwitchAccount}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        Switch Account
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : mounted ? (
            <>
              <Button variant="ghost" size="sm" asChild><Link href="/login">Sign In</Link></Button>
              <Button size="sm" asChild><Link href="/login">Get Started</Link></Button>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure &amp; Encrypted</span>
              </div>
              {mounted && profile ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary/50">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{profile.fullName}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSwitchAccount}>
                    <RefreshCw className="h-4 w-4" /> Switch Account
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
