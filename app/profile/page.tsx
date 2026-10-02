"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Upload, X, Landmark, User, FileText, CheckCircle2 } from "lucide-react"
import { useAppStore, type StudentProfile, type BankDetails, type UploadedDoc, type DocType } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from "react-dropzone"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ProfilePage() {

  const { profile, setProfile, bankDetails, setBankDetails, documents, addDocument, removeDocument } = useAppStore()
  const [activeTab, setActiveTab] = useState<"personal" | "bank" | "documents">("personal")

  // Load profile from Supabase on mount
  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data && !error) {
        setProfile({
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          gender: data.gender || 'male',
          category: data.category || 'general',
          annualIncome: data.annual_income || 'below-1l',
          educationLevel: data.education_level || 'undergraduate',
          stream: data.stream || 'engineering',
          percentage: data.percentage || 0,
          state: data.state || '',
          specialCategory: data.special_category || 'none',
          institution: data.institution || '',
          courseName: data.course_name || '',
          admissionYear: data.admission_year || '',
          aadhaarId: data.aadhaar_id || ''
        })

        if (data.bank_name) {
          setBankDetails({
            accountHolder: data.account_holder || '',
            bankName: data.bank_name || '',
            accountNumber: data.account_number || '',
            ifscCode: data.ifsc_code || '',
            branch: data.branch || '',
            accountType: data.account_type || 'savings'
          })
        }
      }
    }
    loadProfile()
  }, [setProfile, setBankDetails])

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 space-y-2 shrink-0">
            <Button 
              variant={activeTab === "personal" ? "default" : "ghost"} 
              className="w-full justify-start gap-3" 
              onClick={() => setActiveTab("personal")}
            >
              <User className="h-4 w-4" /> Personal & Academic
            </Button>
            <Button 
              variant={activeTab === "bank" ? "default" : "ghost"} 
              className="w-full justify-start gap-3" 
              onClick={() => setActiveTab("bank")}
            >
              <Landmark className="h-4 w-4" /> Bank Details
              {bankDetails && <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-500" />}
            </Button>
            <Button 
              variant={activeTab === "documents" ? "default" : "ghost"} 
              className="w-full justify-start gap-3" 
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-4 w-4" /> Documents
              <span className="ml-auto bg-muted px-2 py-0.5 rounded-full text-xs">{documents.length}</span>
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 rounded-xl border bg-card p-6 shadow-sm min-h-[500px]">
            {activeTab === "personal" && <PersonalProfileForm profile={profile} setProfile={setProfile} />}
            {activeTab === "bank" && <BankDetailsForm bankDetails={bankDetails} setBankDetails={setBankDetails} />}
            {activeTab === "documents" && <DocumentsManager documents={documents} addDocument={addDocument} removeDocument={removeDocument} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function PersonalProfileForm({ profile, setProfile }: { profile: StudentProfile | null, setProfile: (p: StudentProfile) => void }) {
  const { register, handleSubmit, setValue } = useForm<StudentProfile>({ defaultValues: profile || {
    percentage: 0,
    educationLevel: "undergraduate",
    category: "general"
  }})
  
  const onSubmit = async (data: StudentProfile) => {
    try {
      setProfile(data)
      
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
             aadhaar_id: data.aadhaarId || null,
             full_name: data.fullName,
             date_of_birth: data.dateOfBirth,
             gender: data.gender,
             category: data.category,
             annual_income: data.annualIncome,
             education_level: data.educationLevel,
             stream: data.stream,
             percentage: data.percentage,
             state: data.state,
             special_category: data.specialCategory
          })
          .eq('id', user.id)
        
        if (error) {
          console.error('FULL DATABASE ERROR:', JSON.stringify(error, null, 2))
          toast.error(`Database Error: ${error.message}`)
          return
        }
      }
      toast.success("Profile saved successfully")
    } catch (e: any) {
      console.error('CRITICAL FRONTEND ERROR:', e)
      alert(`Frontend error: ${e.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-xl font-semibold mb-1">Personal & Academic Info</h2>
        <p className="text-sm text-muted-foreground mb-6">This info helps us match you with the right scholarships automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input {...register("fullName", { required: true })} placeholder="As per documents" />
        </div>
        <div className="space-y-2">
          <Label>Aadhaar Number (12 digits)</Label>
          <Input
            {...register("aadhaarId", {
              pattern: { value: /^\d{12}$/, message: "Must be 12 digits" }
            })}
            placeholder="XXXX XXXX XXXX"
            maxLength={12}
            type="text"
          />
          <p className="text-xs text-muted-foreground">Stored securely. Used only for scholarship verification.</p>
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" {...register("dateOfBirth", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Social Category</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("category")}>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="minority">Minority</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Family Annual Income</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("annualIncome")}>
             <option value="below-1l">Below ₹1 Lakh</option>
             <option value="1l-2.5l">₹1 Lakh - ₹2.5 Lakhs</option>
             <option value="2.5l-5l">₹2.5 Lakhs - ₹5 Lakhs</option>
             <option value="5l-8l">₹5 Lakhs - ₹8 Lakhs</option>
             <option value="above-8l">Above ₹8 Lakhs</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>State of Domicile</Label>
          <Input {...register("state", { required: true })} placeholder="e.g. Maharashtra" />
        </div>
      </div>

      <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Education Level</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("educationLevel")}>
            <option value="10th">10th Passed</option>
            <option value="12th">12th Passed</option>
            <option value="undergraduate">Undergraduate (UG)</option>
            <option value="postgraduate">Postgraduate (PG)</option>
            <option value="phd">PhD / Research</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Stream / Major</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("stream")}>
            <option value="engineering">Engineering / Tech</option>
            <option value="medical">Medical / Pharma</option>
            <option value="science">Basic Sciences</option>
            <option value="commerce">Commerce / Business</option>
            <option value="arts">Arts / Humanities</option>
            <option value="law">Law</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Previous Academic % (Marks)</Label>
          <Input type="number" step="0.1" {...register("percentage", { valueAsNumber: true, required: true })} placeholder="e.g. 85.5" />
        </div>
        <div className="space-y-2">
          <Label>Special Categories</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" {...register("specialCategory")}>
            <option value="none">None</option>
            <option value="differently-abled">Differently Abled (PwD)</option>
            <option value="single-girl-child">Single Girl Child</option>
            <option value="sports">Sports Person</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full mt-6 text-base font-semibold py-6">Save Profile</Button>
    </form>
  )
}

function BankDetailsForm({ bankDetails, setBankDetails }: { bankDetails: BankDetails | null, setBankDetails: (b: BankDetails) => void }) {
  const { register, handleSubmit } = useForm<BankDetails>({ defaultValues: bankDetails || {} })

  const onSubmit = async (data: BankDetails) => {
    try {
      setBankDetails(data)
      
      // Sync to Cloud
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
             bank_name: data.bankName,
             account_holder: data.accountHolder,
             account_number: data.accountNumber,
             ifsc_code: data.ifscCode
          })
          .eq('id', user.id)
        
        if (error) {
          console.error('BANK SYNC ERROR:', JSON.stringify(error, null, 2))
          toast.error(`Bank Sync Error: ${error.message}`)
          return
        }
      }
      toast.success("Bank details secured on cloud locker.")
    } catch (e: any) {
      console.error('BANK ADAPTER ERROR:', e)
      alert(`Bank form error: ${e.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-xl font-semibold mb-1">Bank Account Details</h2>
        <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
           <Landmark className="h-4 w-4" />
           Required for direct benefit transfer (DBT) of awarded scholarships.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Account Holder Name</Label>
          <Input {...register("accountHolder", { required: true })} placeholder="As per bank records" />
        </div>
        <div className="space-y-2">
          <Label>Bank Name</Label>
          <Input {...register("bankName", { required: true })} placeholder="e.g. State Bank of India" />
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input type="password" {...register("accountNumber", { required: true })} placeholder="••••••••••••" />
          <p className="text-xs text-muted-foreground">We keep your account number secure.</p>
        </div>
        <div className="space-y-2">
          <Label>IFSC Code</Label>
          <Input {...register("ifscCode", { required: true })} placeholder="e.g. SBIN0001234" className="uppercase" />
        </div>
      </div>

      <Button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 font-semibold py-6">Save Bank Details</Button>
    </form>
  )
}

function DocumentsManager({ documents, addDocument, removeDocument }: { documents: UploadedDoc[], addDocument: (d: UploadedDoc) => void, removeDocument: (i: string) => void }) {
  const [loading, setLoading] = useState(true)

  // Load existing docs from Supabase on mount
  useEffect(() => {
    const loadDocs = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: dbDocs, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })

      if (error) { console.error('Failed to load documents:', error); setLoading(false); return }

      for (const doc of (dbDocs || [])) {
        const { data: signed } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.file_path, 31536000)
        addDocument({
          id: doc.id,
          type: (doc.doc_type as any) || 'other',
          name: doc.file_name,
          base64: signed?.signedUrl || doc.file_path,
          size: 0,
          uploadedAt: doc.uploaded_at
        })
      }
      setLoading(false)
    }
    loadDocs()
  }, [addDocument])

  const handleRemove = async (docId: string, docBase64: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Remove from DB
      await supabase.from('user_documents').delete().eq('id', docId).eq('user_id', user.id)
      // Remove file from storage bucket
      const { data: dbDoc } = await supabase.from('user_documents').select('file_path').eq('id', docId).single()
      if (dbDoc?.file_path) await supabase.storage.from('documents').remove([dbDoc.file_path])
    }
    removeDocument(docId)
    toast.success('Document removed.')
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    acceptedFiles.forEach(async (file) => {
      const fileExt = file.name.split('.').pop()
      const docType: DocType = file.name.toLowerCase().includes("income")
        ? "income_cert"
        : file.name.toLowerCase().includes("caste")
        ? "caste_cert"
        : file.name.toLowerCase().includes("mark")
        ? "marksheet"
        : file.name.toLowerCase().includes("aadhaar")
        ? "aadhaar"
        : "other"

      if (user) {
        const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        toast.info(`Uploading ${file.name} to cloud...`)
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) {
          toast.error(`Error: ${uploadError.message || "Failed to upload"}`)
          console.error(uploadError)
        } else {
          toast.success(`${file.name} saved securely in cloud vault`)
          
          const { data: dbEntry, error: dbError } = await supabase.from('user_documents').insert({
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
            doc_type: docType
          }).select().single()
          
          if (dbError) {
             console.error("Failed to save to database:", dbError)
          }

          const { data: signedUrlData } = await supabase.storage.from('documents').createSignedUrl(filePath, 31536000)
          
          addDocument({
            id: dbEntry?.id || `cloud-${Date.now()}`,
            type: docType,
            name: file.name,
            base64: signedUrlData?.signedUrl || filePath, 
            size: file.size,
            uploadedAt: new Date().toISOString()
          })
        }
      } else {
        // Mock Mode: Convert file to Base64 and store locally
        const reader = new FileReader()
        reader.onload = () => {
          addDocument({
            id: `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            type: docType,
            name: file.name,
            base64: reader.result as string,
            size: file.size,
            uploadedAt: new Date().toISOString()
          })
          toast.success(`${file.name} saved to local locker`)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': ['.png','.jpg','.jpeg'], 'application/pdf': ['.pdf']}, maxSize: 5000000 })

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading your documents...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-xl font-semibold mb-1">Document Locker</h2>
        <p className="text-sm text-muted-foreground mb-6">Upload your important documents here to easily attach them to any scholarship application.</p>
      </div>

      <div {...getRootProps()} className="border-2 border-dashed border-primary/20 rounded-xl p-10 text-center cursor-pointer hover:bg-primary/5 transition-colors">
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        {isDragActive ? (
          <p className="text-primary font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-foreground font-medium mb-1">Drag & drop files here, or click to select</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
          </div>
        )}
      </div>

      {documents.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Uploaded Documents</h3>
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-secondary rounded-md">
                   <FileText className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <p className="text-sm font-medium">{doc.name}</p>
                   <p className="text-xs text-muted-foreground">{doc.size > 0 ? `${(doc.size / 1024).toFixed(1)} KB • ` : ''}Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                 </div>
               </div>
               <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemove(doc.id, doc.base64)}>
                 <X className="h-4 w-4" />
               </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
