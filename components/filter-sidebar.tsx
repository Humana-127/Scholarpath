"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { categories, amountRanges } from "@/lib/scholarship-data"
import { cn } from "@/lib/utils"

type FilterSidebarProps = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedAmountRange: number
  setSelectedAmountRange: (range: number) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function FilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedAmountRange,
  setSelectedAmountRange,
  isMobileOpen,
  setIsMobileOpen,
}: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setSelectedCategories([])
    } else if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedAmountRange(0)
  }

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || selectedAmountRange > 0

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform bg-card p-6 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:w-72 lg:translate-x-0 lg:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Filter Scholarships</h2>
        </div>

        <Separator className="my-4" />

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={category}
                  checked={
                    category === "All"
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(category)
                  }
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label
                  htmlFor={category}
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Amount Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Award Amount</Label>
          <div className="space-y-2">
            {amountRanges.map((range, index) => (
              <div key={range.label} className="flex items-center gap-2">
                <Checkbox
                  id={`amount-${index}`}
                  checked={selectedAmountRange === index}
                  onCheckedChange={() =>
                    setSelectedAmountRange(selectedAmountRange === index ? 0 : index)
                  }
                />
                <Label
                  htmlFor={`amount-${index}`}
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <>
            <Separator className="my-4" />
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </>
        )}
      </aside>
    </>
  )
}
