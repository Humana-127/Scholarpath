"use client"

import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, Bell, CheckCircle2, FileText, Hourglass, Landmark, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { applications, profile, bankDetails, notifications } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const statusMap = {
    draft: { label: "Draft", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    submitted: { label: "Submitted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    under_review: { label: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    accepted: { label: "Accepted", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    rejected: { label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20" }
  }

  const formatAmount = (amt: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt)

  const activeApps = mounted ? applications.filter(a => a.status !== "accepted" && a.status !== "rejected") : []
  const totalAmount = mounted ? applications.filter(a => a.status === "accepted").reduce((acc, a) => acc + a.amount, 0) : 0

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-white shadow-lg overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-10">
             <Landmark className="h-48 w-48" />
           </div>
           <div className="relative z-10">
             <h1 className="text-3xl font-bold mb-2">Welcome back{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ""}!</h1>
             <p className="text-white/80 max-w-lg">Track your scholarship applications, update your documents, and stay on top of deadlines.</p>
             
             <div className="mt-8 flex flex-wrap gap-6">
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[200px]">
                 <p className="text-white/70 text-sm font-medium">Active Applications</p>
                 <p className="text-3xl font-bold mt-1">{activeApps.length}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[200px]">
                 <p className="text-white/70 text-sm font-medium">Total Funds Won</p>
                 <p className="text-3xl font-bold mt-1">{formatAmount(totalAmount)}</p>
               </div>
             </div>
           </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Your Applications</h2>
            
            {!mounted ? (
              <div className="flex flex-col items-center justify-center p-12 py-16 border border-dashed rounded-xl bg-card text-center text-muted-foreground animate-pulse">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 py-20 border border-dashed rounded-xl bg-card text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm">You haven&apos;t applied to any scholarships yet. Explore our database to find funds tailored for you.</p>
                <Button asChild>
                  <Link href="/scholarships">Find Scholarships</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusMap[app.status].color}`}>
                          {statusMap[app.status].label}
                        </span>
                        <span className="text-xs text-muted-foreground">ID: {app.id}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{app.scholarshipName}</h3>
                      <p className="text-sm text-muted-foreground">{app.organization}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Hourglass className="h-4 w-4" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5 text-primary font-medium">{formatAmount(app.amount)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium mb-1">Acceptance Est.</span>
                        <div className="w-full sm:w-24 bg-secondary rounded-full h-2.5 overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full" style={{ width: `${app.acceptanceProbability}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{app.acceptanceProbability}%</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full shrink-0 gap-2" asChild>
                        <Link href={`/scholarships/${app.scholarshipId}`}>View Details <ArrowRight className="h-3 w-3" /></Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
             <div className="rounded-xl border bg-card p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><AlertCircle className="h-5 w-5 text-amber-500" /> Action Items</h3>
                <ul className="space-y-3 text-sm">
                  {!mounted ? (
                    <li className="text-xs text-muted-foreground">Checking account status...</li>
                  ) : !bankDetails ? (
                    <li className="flex items-start gap-2 text-destructive">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5" />
                      <div>
                        <p className="font-medium">Missing Bank Details</p>
                        <Link href="/profile?tab=bank" className="underline text-xs">Add now</Link>
                      </div>
                    </li>
                  ) : (
                    <li className="flex items-start gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> Bank details verified
                    </li>
                  )}
                  {!profile || !profile.fullName ? (
                    <li className="flex items-start gap-2 text-amber-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium">Incomplete Profile</p>
                        <Link href="/profile" className="underline text-xs">Complete to unlock matching</Link>
                      </div>
                    </li>
                  ) : (
                    <li className="flex items-start gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> Profile matches ready
                    </li>
                  )}
                </ul>
             </div>

             <div className="rounded-xl border bg-card p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><Bell className="h-5 w-5 text-primary" /> Recent Alerts</h3>
                {mounted && notifications.slice(0, 4).map(n => (
                  <div key={n.id} className="mb-4 pb-4 border-b last:mb-0 last:pb-0 last:border-0 relative">
                    {!n.read && <div className="absolute top-1 left-0 h-1.5 w-1.5 rounded-full bg-primary" />}
                    <div className="pl-4">
                       <p className="text-sm font-medium">{n.title}</p>
                       <p className="text-xs text-muted-foreground mt-1 leading-snug">{n.message}</p>
                       <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {mounted && notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                )}
                {!mounted && (
                  <p className="text-sm text-muted-foreground">Loading alerts...</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
