"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { extendedScholarships } from "@/lib/scholarships-extended"
import { useAppStore, type ApplicationRecord } from "@/lib/store"
import { calculateEligibilityScore } from "@/lib/scholarship-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Calendar, CheckCircle2, Clock, Upload, XCircle, FileText, Landmark, Info, ChevronDown, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ScholarshipDetailClient() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const scholarship = extendedScholarships.find(s => s.id === id)
  
  const { profile, documents, bankDetails, applications, applyToScholarship } = useAppStore()
  const [activeTab, setActiveTab] = useState<"details" | "apply">("details")
  const [selectedDocs, setSelectedDocs] = useState<Record<string, string>>({})
  
  if (!scholarship) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Scholarship not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const existingApp = applications.find(a => a.scholarshipId === id)
  const eligibility = profile ? calculateEligibilityScore(profile, scholarship) : null
  
  const formatAmount = (amt: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt)
  
  const handleApply = async () => {
    if (!profile) {
      toast.error("Please complete your profile before applying!")
      return
    }
    
    if (documents.length === 0) {
      alert("Please upload at least some basic documents in your profile before applying.")
    }

    const supabase = createClient()
    const allDocsSelected = scholarship.documentsRequired.every(req => !!selectedDocs[req])
    if (!allDocsSelected) {
      toast.error("Please select a document for every requirement.")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Safety: Ensure profile exists before inserting application
      const { data: profileExists } = await supabase.from('profiles').select('id').eq('id', user.id).single()
      if (!profileExists) {
        console.log("Profile missing, creating one now...")
        await supabase.from('profiles').insert({ id: user.id, email: user.email })
      }

      const { error: dbError } = await supabase.from('applications').insert({
        user_id: user.id,
        scholarship_id: scholarship.id,
        scholarship_name: scholarship.name,
        organization: scholarship.organization,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
        status: 'under_review',
        applied_at: new Date().toISOString(),
        selected_documents: selectedDocs // Store the mapping in the new column
      })

      if (dbError) {
        console.error("FULL DB ERROR:", JSON.stringify(dbError, null, 2))
        toast.error(`Database Error: ${dbError.message || 'Check your SQL policies'}`)
        return
      }
    }

    const application: ApplicationRecord = {
      id: `APP-${Math.floor(Math.random()*1000000)}`,
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      organization: scholarship.organization,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      appliedAt: new Date().toISOString(),
      status: "under_review",
      acceptanceProbability: Math.min(98, (eligibility?.score || 50) + Math.floor(Math.random() * 10)),
      notes: "Application submitted successfully and is currently under review.",
      documentsAttached: documents.map(d => d.id)
    }

    applyToScholarship(application)
    toast.success("Application submitted successfully!")
    setActiveTab("details")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        <Button variant="ghost" className="mb-6 -ml-4 mr-auto" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {/* Header */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="font-medium text-primary">
                  {scholarship.category}
                </Badge>
                {existingApp && (
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                    Already Applied
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{scholarship.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{scholarship.organization}</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-3xl font-bold text-primary">{formatAmount(scholarship.amount)}</span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-destructive">
                <Clock className="h-4 w-4" />
                <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 border-b">
            <button 
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('details')}
            >
              Details & Eligibility
            </button>
            <button 
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'apply' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('apply')}
            >
              Application Submission
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "details" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 md:grid-cols-3">
              
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">About this Scholarship</h3>
                  <p className="text-muted-foreground leading-relaxed">{scholarship.description}</p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Eligibility Criteria</h3>
                  <ul className="space-y-2">
                    {scholarship.eligibility.map((criterion, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Documents Required</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {scholarship.documentsRequired.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium text-secondary-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {profile ? (
                  <div className={`rounded-xl border p-6 ${eligibility?.score! >= 80 ? 'bg-sky-50 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/50' : 'bg-card'}`}>
                    <h3 className="font-semibold mb-2">Your Match: {eligibility?.score}%</h3>
                    {eligibility?.score! >= 80 ? (
                      <p className="text-sm text-sky-700 dark:text-sky-300 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> Highly eligible based on your profile.
                      </p>
                    ) : (
                      <p className="text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" /> Please review unmatched criteria before applying.
                      </p>
                    )}
                    
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
                       {eligibility?.matchedCriteria.map((c, i) => (
                         <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {c}
                         </div>
                       ))}
                       {eligibility?.unmatchedCriteria.map((c, i) => (
                         <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <XCircle className="h-3 w-3 text-destructive" /> {c}
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border p-6 bg-accent/5">
                    <p className="text-sm text-muted-foreground mb-4">Complete your profile to see if you are eligible for this scholarship.</p>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>Complete Profile</Button>
                  </div>
                )}

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full font-semibold" 
                      onClick={() => setActiveTab('apply')}
                      disabled={!!existingApp}
                    >
                      {existingApp ? "Already Applied" : "Start Application"}
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={scholarship.applicationUrl} target="_blank" rel="noreferrer">
                        Official Website
                      </a>
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "apply" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
              
              {existingApp ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Application Submitted Successfully</h2>
                  <p className="text-muted-foreground mt-2 mb-6">Your application ID is {existingApp.id}. Expected acceptance probability is ~{existingApp.acceptanceProbability}%.</p>
                  <Button onClick={() => router.push("/dashboard")}>View Tracking Dashboard</Button>
                </div>
              ) : (
                <div className="rounded-xl border bg-card p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6">Application Checklist</h2>
                  
                  <div className="space-y-6">
                    {/* Bank Details Check */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /> Bank Details</h4>
                        {bankDetails ? <Badge className="bg-emerald-500">Verified</Badge> : <Badge variant="destructive">Pending</Badge>}
                      </div>
                      {!bankDetails && (
                        <div className="bg-destructive/10 p-4 rounded-md text-sm text-destructive-foreground">
                          You need to add your bank details in your profile to receive the funds.
                          <Button variant="link" onClick={() => router.push("/profile?tab=bank")} className="px-2">Go to Profile</Button>
                        </div>
                      )}
                      {bankDetails && (
                        <div className="bg-secondary/50 p-4 rounded-md text-sm text-secondary-foreground border">
                          Account ending in <strong>{bankDetails.accountNumber.slice(-4)}</strong> at {bankDetails.bankName}.
                        </div>
                      )}
                    </div>

                    {/* Documents Check */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Select Required Documents</h4>
                        <Badge variant="outline">{Object.keys(selectedDocs).length} / {scholarship.documentsRequired.length} Selected</Badge>
                      </div>
                      <div className="space-y-4">
                        {scholarship.documentsRequired.map((docReq, idx) => {
                          return (
                            <div key={idx} className="space-y-2 p-4 border rounded-lg bg-secondary/20">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{docReq}</span>
                                {selectedDocs[docReq] ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <span className="text-[10px] text-amber-600 font-bold uppercase">Required</span>
                                )}
                              </div>
                              
                              <select 
                                className="w-full text-xs h-9 rounded-md border bg-background px-3"
                                value={selectedDocs[docReq] || ""}
                                onChange={(e) => setSelectedDocs(prev => ({ ...prev, [docReq]: e.target.value }))}
                              >
                                <option value="">-- Select from your uploads --</option>
                                {documents.map(d => (
                                  <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                                ))}
                              </select>
                            </div>
                          )
                        })}
                      </div>
                      {documents.length === 0 && (
                        <p className="text-sm text-destructive mt-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          You haven&apos;t uploaded any documents. 
                          <Button variant="link" onClick={() => router.push("/profile?tab=documents")} className="p-0 h-auto text-sm">Upload Now</Button>
                        </p>
                      )}
                    </div>

                    {/* Disclaimer & Submit */}
                    <div className="pt-6 border-t mt-8">
                       <p className="text-xs text-muted-foreground mb-4">By submitting this application, I declare that all information provided is true and correct to the best of my knowledge. I understand that any false information may result in rejection.</p>
                       <Button size="lg" className="w-full text-base" onClick={handleApply} disabled={!profile}>
                         Submit Formal Application
                       </Button>
                    </div>

                  </div>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
