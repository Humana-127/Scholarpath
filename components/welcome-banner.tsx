"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Bell, Calendar } from "lucide-react"
import { applications, type StudentProfile } from "@/lib/scholarship-data"

export function WelcomeBanner() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  // Calculate upcoming deadlines (within 7 days)
  const upcomingDeadlines = applications.filter((app) => {
    const deadline = new Date(app.deadline)
    const today = new Date()
    const diffDays = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diffDays <= 7 && diffDays > 0 && app.status !== "accepted" && app.status !== "rejected"
  }).length

  const userName = profile?.fullName?.split(" ")[0] || "Student"

  return (
    <motion.div
      className="mb-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {upcomingDeadlines > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-primary">
                  {upcomingDeadlines} deadline{upcomingDeadlines > 1 ? "s" : ""}
                </span>{" "}
                this week!
              </>
            ) : (
              "Track your scholarship applications and funding progress"
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {upcomingDeadlines > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-600">
              <Bell className="h-4 w-4" />
              <span>{upcomingDeadlines} Upcoming</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1.5 text-sm font-medium text-sky-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Data Protected</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-primary/10 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
