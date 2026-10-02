"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Sparkles, User, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScholarshipCard } from "@/components/scholarship-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import {
  amountRanges,
  calculateEligibilityScore,
} from "@/lib/scholarship-data"
import { extendedScholarships as scholarships } from "@/lib/scholarships-extended"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export function ScholarshipsList() {
  const searchParams = useSearchParams()
  const isMatched = searchParams.get("matched") === "true"
  const isSavedView = searchParams.get("saved") === "true"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAmountRange, setSelectedAmountRange] = useState(0)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showEligibleOnly, setShowEligibleOnly] = useState(isMatched)
  const profile = useAppStore(state => state.profile)
  const savedScholarships = useAppStore(state => state.savedScholarships)

  const filteredAndSortedScholarships = useMemo(() => {
    let filtered = scholarships.filter((scholarship) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          scholarship.name.toLowerCase().includes(query) ||
          scholarship.organization.toLowerCase().includes(query) ||
          scholarship.description.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(scholarship.category)) return false
      }

      // Amount filter
      if (selectedAmountRange > 0) {
        const range = amountRanges[selectedAmountRange]
        if (scholarship.amount < range.min || scholarship.amount > range.max) {
          return false
        }
      }

      // Saved filter
      if (isSavedView) {
        if (!savedScholarships.includes(scholarship.id)) return false
      }

      // Eligibility filter
      if (showEligibleOnly && profile) {
        const { score } = calculateEligibilityScore(profile, scholarship)
        if (score < 50) return false
      }

      return true
    })

    // Sort by eligibility score if profile exists
    if (profile) {
      filtered = filtered.sort((a, b) => {
        const scoreA = calculateEligibilityScore(profile, a).score
        const scoreB = calculateEligibilityScore(profile, b).score
        return scoreB - scoreA
      })
    }

    return filtered
  }, [searchQuery, selectedCategories, selectedAmountRange, showEligibleOnly, profile, isSavedView, savedScholarships])

  const eligibleCount = useMemo(() => {
    if (!profile) return 0
    return scholarships.filter((s) => {
      const { score } = calculateEligibilityScore(profile, s)
      return score >= 50
    }).length
  }, [profile])

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isSavedView ? "Saved Scholarships" : isMatched && profile ? "Your Matched Scholarships" : "Available Scholarships"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {filteredAndSortedScholarships.length} scholarships
              {profile && ` (${eligibleCount} you&apos;re eligible for)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant={showEligibleOnly ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => setShowEligibleOnly(!showEligibleOnly)}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  {showEligibleOnly ? "Showing Eligible" : "Show All"}
                </Badge>
                <Link href="/profile">
                  <Badge variant="outline" className="cursor-pointer px-3 py-1.5">
                    <User className="mr-1 h-3 w-3" />
                    Edit Profile
                  </Badge>
                </Link>
              </div>
            ) : (
              <Link href="/profile">
                <Button variant="default" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Profile to Match
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Saved scholarships banner */}
        {isSavedView && (
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-primary/5 to-accent/10 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
              Your Saved Scholarships
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {savedScholarships.length === 0
                ? "You haven't saved any scholarships yet. Click the bookmark icon on any scholarship to save it."
                : `You have ${savedScholarships.length} saved scholarship${savedScholarships.length > 1 ? 's' : ''}.`}
            </p>
          </div>
        )}

        {/* Profile Match Banner */}
        {isMatched && profile && (
          <div className="mb-8 rounded-xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-primary/5 to-accent/10 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  Welcome, {profile.fullName}!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on your profile, we found {eligibleCount} scholarships you may be eligible for.
                  Scholarships are sorted by match percentage.
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-sky-500" />
                  <span className="text-muted-foreground">80%+ Match</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">50-79% Match</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Below 50%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedAmountRange={selectedAmountRange}
            setSelectedAmountRange={setSelectedAmountRange}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
          />

          {/* Scholarship Grid */}
          <div className="flex-1">
            {filteredAndSortedScholarships.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    profile={profile}
                    showEligibility={!!profile}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <p className="text-lg font-medium text-foreground">
                  No scholarships found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters to find more opportunities
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategories([])
                    setSelectedAmountRange(0)
                    setShowEligibleOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
