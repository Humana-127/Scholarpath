"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Calendar,
  Building2,
  ArrowRight,
  Heart,
  Share2,
  CheckCircle2,
  XCircle,
  FileText,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from "@/lib/store"
import type { Scholarship, StudentProfile } from "@/lib/scholarship-data"
import { calculateEligibilityScore } from "@/lib/scholarship-data"

type ScholarshipCardProps = {
  scholarship: Scholarship
  profile?: StudentProfile | null
  showEligibility?: boolean
}

const categoryColors: Record<string, string> = {
  Government: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Merit: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  STEM: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Women: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  Minority: "bg-accent/10 text-accent border-accent/20",
  Corporate: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Research: "bg-primary/10 text-primary border-primary/20",
  "Differently Abled": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Regional: "bg-chart-3/10 text-chart-3 border-chart-3/20",
}

export function ScholarshipCard({
  scholarship,
  profile,
  showEligibility = false,
}: ScholarshipCardProps) {
  const { savedScholarships, toggleSavedScholarship } = useAppStore()

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDeadline = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilDeadline(scholarship.deadline)

  // Calculate eligibility if profile exists
  const eligibilityResult = profile
    ? calculateEligibilityScore(profile, scholarship)
    : null

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-sky-500 text-white"
    if (score >= 50) return "bg-amber-500 text-white"
    return "bg-red-500 text-white"
  }

  const getMatchBorderColor = (score: number) => {
    if (score >= 80) return "ring-sky-500/30"
    if (score >= 50) return "ring-amber-500/30"
    return "ring-red-500/30"
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: scholarship.name,
        text: `Check out this scholarship: ${scholarship.name} - ${formatAmount(scholarship.amount)}`,
        url: window.location.href,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`group flex h-full flex-col transition-all hover:shadow-lg hover:shadow-primary/5 ${
          showEligibility && eligibilityResult
            ? `ring-2 ${getMatchBorderColor(eligibilityResult.score)}`
            : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`${categoryColors[scholarship.category] || "bg-secondary text-secondary-foreground"} border`}
              >
                {scholarship.category}
              </Badge>
              {showEligibility && eligibilityResult && (
                <Badge className={`${getMatchColor(eligibilityResult.score)} font-semibold`}>
                  {eligibilityResult.score}% Match
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleSavedScholarship(scholarship.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${savedScholarships.includes(scholarship.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {savedScholarships.includes(scholarship.id) ? "Remove from saved" : "Save scholarship"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share scholarship</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Eligibility Status Banner */}
          {showEligibility && eligibilityResult && (
            <div
              className={`mt-3 flex items-center gap-2 rounded-md px-3 py-2 ${
                eligibilityResult.score >= 80
                  ? "bg-sky-500/10 text-sky-700"
                  : eligibilityResult.score >= 50
                  ? "bg-amber-500/10 text-amber-700"
                  : "bg-red-500/10 text-red-700"
              }`}
            >
              {eligibilityResult.score >= 80 ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">You are Eligible!</span>
                </>
              ) : eligibilityResult.score >= 50 ? (
                <>
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">Partially Eligible</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Not Eligible</span>
                </>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-6 px-2 text-xs"
                  >
                    Why?
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-3">
                    <h4 className="font-medium">Eligibility Details</h4>
                    {eligibilityResult.matchedCriteria.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-sky-600">
                          Criteria Met:
                        </p>
                        <ul className="space-y-1">
                          {eligibilityResult.matchedCriteria.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3 w-3 text-sky-500" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {eligibilityResult.unmatchedCriteria.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-red-600">
                          Not Met:
                        </p>
                        <ul className="space-y-1">
                          {eligibilityResult.unmatchedCriteria.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                            >
                              <XCircle className="h-3 w-3 text-red-500" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="mt-3 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
              {scholarship.name}
            </h3>
            <span className="shrink-0 text-xl font-bold text-primary">
              {formatAmount(scholarship.amount)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{scholarship.organization}</span>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {scholarship.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {scholarship.eligibility.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Documents Required */}
          {scholarship.documentsRequired && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-start gap-2 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Required Documents ({scholarship.documentsRequired.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <h4 className="mb-2 font-medium">Documents Required</h4>
                <ul className="space-y-1">
                  {scholarship.documentsRequired.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDeadline(scholarship.deadline)}
            </span>
            {daysLeft <= 14 && daysLeft > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {daysLeft}d left
              </Badge>
            )}
          </div>
          <Button size="sm" className="group/btn" asChild>
            <Link href={`/scholarships/${scholarship.id}`}>
              Apply
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
