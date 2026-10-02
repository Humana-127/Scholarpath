"use client"

import { Trophy, Star, Target, Award, Zap, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { applications } from "@/lib/scholarship-data"

type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  earned: boolean
  color: string
}

export function Achievements() {
  const totalApplied = applications.length
  const totalAccepted = applications.filter((a) => a.status === "accepted").length
  const hasSubmitted = applications.some((a) => a.status === "submitted" || a.status === "under-review" || a.status === "accepted")
  const profileComplete = true // Assume profile is complete for demo

  const achievements: Achievement[] = [
    {
      id: "first-app",
      title: "First Application",
      description: "Submitted your first scholarship application",
      icon: Trophy,
      earned: totalApplied > 0,
      color: "text-amber-500",
    },
    {
      id: "profile-complete",
      title: "Profile Complete",
      description: "Completed your student profile",
      icon: Star,
      earned: profileComplete,
      color: "text-sky-500",
    },
    {
      id: "five-apps",
      title: "5 Scholarships Applied",
      description: "Applied to 5 different scholarships",
      icon: Target,
      earned: totalApplied >= 5,
      color: "text-purple-500",
    },
    {
      id: "first-win",
      title: "First Win",
      description: "Got accepted for your first scholarship",
      icon: Award,
      earned: totalAccepted > 0,
      color: "text-emerald-500",
    },
    {
      id: "quick-apply",
      title: "Quick Starter",
      description: "Submitted an application within a week",
      icon: Zap,
      earned: hasSubmitted,
      color: "text-orange-500",
    },
    {
      id: "ten-apps",
      title: "10 Applications",
      description: "Reached 10 scholarship applications",
      icon: FileCheck,
      earned: totalApplied >= 10,
      color: "text-pink-500",
    },
  ]

  const earnedCount = achievements.filter((a) => a.earned).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Achievements</span>
          <span className="text-sm font-normal text-muted-foreground">
            {earnedCount}/{achievements.length} Earned
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`flex flex-col items-center rounded-lg border p-3 text-center transition-all ${
                  achievement.earned
                    ? "border-primary/20 bg-primary/5"
                    : "border-dashed opacity-50"
                }`}
              >
                <div
                  className={`mb-2 rounded-full p-2 ${
                    achievement.earned ? "bg-background" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      achievement.earned ? achievement.color : "text-muted-foreground"
                    }`}
                  />
                </div>
                <p className="text-xs font-medium text-foreground">
                  {achievement.title}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
