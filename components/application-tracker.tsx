"use client"

import { useState } from "react"
import {
  Calendar,
  Building2,
  MoreHorizontal,
  FileEdit,
  Eye,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applications, type Application } from "@/lib/scholarship-data"

const statusConfig: Record<
  Application["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }
> = {
  draft: {
    label: "Draft",
    variant: "secondary",
    className: "bg-secondary text-secondary-foreground",
  },
  "in-progress": {
    label: "In Progress",
    variant: "default",
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  submitted: {
    label: "Submitted",
    variant: "default",
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  "under-review": {
    label: "Under Review",
    variant: "default",
    className: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  },
  accepted: {
    label: "Accepted",
    variant: "default",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

function ApplicationCard({ application }: { application: Application }) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const status = statusConfig[application.status]

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-base font-semibold text-foreground">
                {application.scholarshipName}
              </h3>
              <Badge variant="outline" className={`shrink-0 border ${status.className}`}>
                {status.label}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {application.organization}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Due {formatDate(application.deadline)}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Application Progress</span>
                <span className="font-medium text-foreground">
                  {application.progress}%
                </span>
              </div>
              <Progress value={application.progress} className="h-2" />
            </div>

            {application.appliedDate && (
              <p className="mt-3 text-xs text-muted-foreground">
                Applied on {formatDate(application.appliedDate)}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-bold text-primary">
              {formatAmount(application.amount)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Application
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ApplicationTracker() {
  const [activeTab, setActiveTab] = useState("all")

  const filterApplications = (tab: string): Application[] => {
    switch (tab) {
      case "active":
        return applications.filter(
          (a) => a.status === "in-progress" || a.status === "draft"
        )
      case "submitted":
        return applications.filter(
          (a) =>
            a.status === "submitted" ||
            a.status === "under-review"
        )
      case "completed":
        return applications.filter(
          (a) => a.status === "accepted" || a.status === "rejected"
        )
      default:
        return applications
    }
  }

  const tabCounts = {
    all: applications.length,
    active: applications.filter(
      (a) => a.status === "in-progress" || a.status === "draft"
    ).length,
    submitted: applications.filter(
      (a) => a.status === "submitted" || a.status === "under-review"
    ).length,
    completed: applications.filter(
      (a) => a.status === "accepted" || a.status === "rejected"
    ).length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Application Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({tabCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({tabCounts.active})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted ({tabCounts.submitted})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({tabCounts.completed})
            </TabsTrigger>
          </TabsList>

          {["all", "active", "submitted", "completed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterApplications(tab).length > 0 ? (
                filterApplications(tab).map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <p className="text-muted-foreground">
                    No applications in this category
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
