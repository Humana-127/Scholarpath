"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  scholarships,
  type StudentProfile,
  type Scholarship,
  calculateEligibilityScore,
} from "@/lib/scholarship-data"

export function Recommendations() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [recommendations, setRecommendations] = useState<
    Array<{ scholarship: Scholarship; score: number }>
  >([])

  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile(parsedProfile)

      // Get top 3 scholarships by eligibility score
      const scored = scholarships
        .map((s) => ({
          scholarship: s,
          score: calculateEligibilityScore(parsedProfile, s).score,
        }))
        .filter((s) => s.score >= 50)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)

      setRecommendations(scored)
    }
  }, [])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-accent" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Complete your profile to get personalized scholarship recommendations
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/profile">Create Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-accent" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length > 0 ? (
          <>
            {recommendations.map(({ scholarship, score }) => (
              <div
                key={scholarship.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-medium text-foreground">
                      {scholarship.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-sky-500/30 bg-sky-500/10 text-sky-600"
                    >
                      {score}% Match
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    {formatAmount(scholarship.amount)}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/scholarships">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/scholarships?matched=true">
                View All Matches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No matching scholarships found. Try updating your profile.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
