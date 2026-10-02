import { extendedScholarships } from "@/lib/scholarships-extended"
import { ScholarshipDetailClient } from "./ScholarshipDetailClient"

export function generateStaticParams() {
  return extendedScholarships.map((scholarship) => ({
    id: scholarship.id,
  }))
}

export default function ScholarshipDetailPage() {
  return <ScholarshipDetailClient />
}
