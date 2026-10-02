import { IndianRupee, FileText, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { applications } from "@/lib/scholarship-data"

export function StatsCards() {
  const totalApplied = applications.length
  const totalAccepted = applications.filter((a) => a.status === "accepted").length
  const totalInProgress = applications.filter(
    (a) => a.status === "in-progress" || a.status === "draft"
  ).length
  const totalPotentialFunding = applications.reduce((sum, a) => sum + a.amount, 0)
  const totalWonFunding = applications
    .filter((a) => a.status === "accepted")
    .reduce((sum, a) => sum + a.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      label: "Total Applications",
      value: totalApplied.toString(),
      icon: FileText,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "In Progress",
      value: totalInProgress.toString(),
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Accepted",
      value: totalAccepted.toString(),
      icon: CheckCircle2,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Funding Won",
      value: formatCurrency(totalWonFunding),
      subtext: `of ${formatCurrency(totalPotentialFunding)} potential`,
      icon: IndianRupee,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              {stat.subtext && (
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
