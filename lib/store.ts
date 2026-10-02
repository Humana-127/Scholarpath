import { create } from "zustand"
import { persist } from "zustand/middleware"

export type DocType = "marksheet" | "income_cert" | "caste_cert" | "aadhaar" | "photo" | "bank_passbook" | "other"

export interface UploadedDoc {
  id: string
  type: DocType
  name: string
  base64: string
  size: number
  uploadedAt: string
}

export interface BankDetails {
  accountHolder: string
  accountNumber: string
  ifscCode: string
  bankName: string
  branch: string
  accountType: "savings" | "current"
}

export interface ApplicationRecord {
  id: string
  scholarshipId: string
  scholarshipName: string
  organization: string
  amount: number
  deadline: string
  appliedAt: string
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected"
  acceptanceProbability: number
  notes: string
  documentsAttached: string[] // doc IDs
}

export interface Notification {
  id: string
  type: "deadline" | "status" | "info"
  title: string
  message: string
  scholarshipId?: string
  createdAt: string
  read: boolean
}

export interface StudentProfile {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  category: "general" | "sc" | "st" | "obc" | "minority"
  annualIncome: "below-1l" | "1l-2.5l" | "2.5l-5l" | "5l-8l" | "above-8l"
  educationLevel: "10th" | "12th" | "undergraduate" | "postgraduate" | "phd"
  stream: "engineering" | "medical" | "arts" | "commerce" | "science" | "law" | "other"
  percentage: number
  state: string
  specialCategory: "differently-abled" | "sports" | "single-girl-child" | "none"
  institution: string
  courseName: string
  admissionYear: string
  aadhaarId: string
}

interface AppState {
  profile: StudentProfile | null
  bankDetails: BankDetails | null
  documents: UploadedDoc[]
  applications: ApplicationRecord[]
  notifications: Notification[]
  savedScholarships: string[]

  setProfile: (p: StudentProfile) => void
  setBankDetails: (b: BankDetails) => void
  clearSession: () => void
  addDocument: (doc: UploadedDoc) => void
  removeDocument: (id: string) => void
  applyToScholarship: (app: ApplicationRecord) => void
  updateApplicationStatus: (id: string, status: ApplicationRecord["status"]) => void
  addNotification: (n: Notification) => void
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  toggleSavedScholarship: (id: string) => void
  generateDeadlineNotifications: (scholarships: { id: string; name: string; deadline: string }[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      bankDetails: null,
      documents: [],
      applications: [],
      notifications: [],
      savedScholarships: [],

      setProfile: (p) => set({ profile: p }),
      setBankDetails: (b) => set({ bankDetails: b }),
      clearSession: () => set({
        profile: null,
        bankDetails: null,
        documents: [],
        applications: [],
        notifications: [],
        savedScholarships: []
      }),

      addDocument: (doc) =>
        set((s) => ({ documents: [...s.documents.filter((d) => d.id !== doc.id), doc] })),

      removeDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

      applyToScholarship: (app) =>
        set((s) => ({
          applications: [
            ...s.applications.filter((a) => a.scholarshipId !== app.scholarshipId),
            app,
          ],
          notifications: [
            ...s.notifications,
            {
              id: `notif-apply-${app.scholarshipId}-${Date.now()}`,
              type: "status",
              title: "Application Submitted!",
              message: `Your application for "${app.scholarshipName}" has been submitted successfully.`,
              scholarshipId: app.scholarshipId,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        })),

      updateApplicationStatus: (id, status) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
          notifications: [
            ...s.notifications,
            {
              id: `notif-status-${id}-${Date.now()}`,
              type: "status",
              title: `Application ${status === "accepted" ? "Accepted! 🎉" : status === "rejected" ? "Rejected" : "Update"}`,
              message: `Your application status has changed to: ${status.replace("_", " ").toUpperCase()}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        })),

      addNotification: (n) =>
        set((s) => ({ notifications: [n, ...s.notifications] })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearAllNotifications: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      toggleSavedScholarship: (id) =>
        set((s) => ({
          savedScholarships: s.savedScholarships.includes(id)
            ? s.savedScholarships.filter((x) => x !== id)
            : [...s.savedScholarships, id],
        })),

      generateDeadlineNotifications: (scholarships) => {
        const today = new Date()
        const existing = get().notifications.map((n) => n.id)
        const newNotifs: Notification[] = []
        for (const s of scholarships) {
          const deadline = new Date(s.deadline)
          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86400000)
          for (const threshold of [30, 14, 7, 3, 1]) {
            const nid = `deadline-${s.id}-${threshold}d`
            if (daysLeft === threshold && !existing.includes(nid)) {
              newNotifs.push({
                id: nid,
                type: "deadline",
                title: `⏰ Deadline in ${threshold} day${threshold > 1 ? "s" : ""}!`,
                message: `"${s.name}" closes on ${new Date(s.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`,
                scholarshipId: s.id,
                createdAt: new Date().toISOString(),
                read: false,
              })
            }
          }
        }
        if (newNotifs.length)
          set((s) => ({ notifications: [...newNotifs, ...s.notifications] }))
      },
    }),
    { name: "scholarpath-store" }
  )
)
