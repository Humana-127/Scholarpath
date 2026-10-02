"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { GraduationCap, User, Lock } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const setProfile = useAppStore(state => state.setProfile)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Username validation: only letters, numbers, underscores, 3-30 chars
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      toast.error("Username must be 3–30 characters: letters, numbers, underscore only")
      setIsLoading(false)
      return
    }

    try {
      // Map username to email format for Supabase Auth
      const email = `${username.toLowerCase()}@scholarpath.app`

      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // MOCK MODE
        toast.success(isLogin ? "Logged in successfully! (Mock Mode)" : "Account created! (Mock Mode)")
        setProfile({
          fullName: username,
          email: email,
          phone: "",
          dateOfBirth: "",
          gender: "other",
          category: "general",
          annualIncome: "below-1l",
          educationLevel: "undergraduate",
          stream: "other",
          percentage: 0,
          state: "",
          specialCategory: "none",
          institution: "",
          courseName: "",
          admissionYear: "",
          aadhaarId: ""
        })
        router.push("/scholarships")
        setIsLoading(false)
        return
      }

      // REAL SUPABASE AUTH
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Logged in successfully!")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        })
        if (error) throw error
        toast.success("Account created! You can now log in.")
      }

      router.push("/scholarships")
    } catch (error: any) {
      toast.error(error.message || "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Logo + Title */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">{isLogin ? "Welcome back" : "Create an account"}</h1>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? "Sign in with your username and password"
            : "Choose a username to get started"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              placeholder="e.g. rahul_sharma"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              required
              type="text"
              className="pl-10"
              autoComplete="username"
            />
          </div>
          {!isLogin && (
            <p className="text-xs text-muted-foreground">3–30 characters: letters, numbers, underscore</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          {!isLogin && (
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          )}
        </div>

        <Button className="w-full h-11 text-base font-semibold mt-2" type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm border-t pt-6">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-medium"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}
