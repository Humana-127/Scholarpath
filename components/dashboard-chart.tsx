"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { applications } from "@/lib/scholarship-data"

export function DashboardChart() {
  const statusCounts = {
    draft: applications.filter((a) => a.status === "draft").length,
    inProgress: applications.filter((a) => a.status === "in-progress").length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    underReview: applications.filter((a) => a.status === "under-review").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  const data = [
    { name: "Draft", value: statusCounts.draft, color: "hsl(var(--muted))" },
    { name: "In Progress", value: statusCounts.inProgress, color: "hsl(var(--chart-3))" },
    { name: "Submitted", value: statusCounts.submitted, color: "hsl(var(--chart-1))" },
    { name: "Under Review", value: statusCounts.underReview, color: "hsl(var(--chart-5))" },
    { name: "Accepted", value: statusCounts.accepted, color: "hsl(var(--chart-2))" },
    { name: "Rejected", value: statusCounts.rejected, color: "hsl(var(--destructive))" },
  ].filter((d) => d.value > 0)

  const total = applications.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-sm font-medium">
                          {payload[0].name}: {payload[0].value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Total Applications</p>
        </div>
      </CardContent>
    </Card>
  )
}
