import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ScholarshipsList } from "@/components/scholarships-list"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Browse Scholarships - ScholarPath",
  description: "Discover thousands of scholarships matched to your profile. Filter by category, amount, and deadline to find your perfect funding opportunity.",
}

export default function ScholarshipsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <Suspense fallback={<div className="p-12 text-center">Loading scholarships...</div>}>
          <ScholarshipsList />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
