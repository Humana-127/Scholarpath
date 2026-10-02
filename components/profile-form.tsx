"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import {
  User,
  GraduationCap,
  IndianRupee,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import {
  type StudentProfile,
  type Gender,
  type Category,
  type IncomeRange,
  type EducationLevel,
  type Stream,
  type SpecialCategory,
  indianStates,
} from "@/lib/scholarship-data"

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Academic Info", icon: GraduationCap },
  { id: 3, title: "Financial Info", icon: IndianRupee },
  { id: 4, title: "Special Categories", icon: Award },
]

type ProfileFormProps = {
  onComplete: (profile: StudentProfile) => void
  initialProfile?: StudentProfile | null
}

export function ProfileForm({ onComplete, initialProfile }: ProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<Partial<StudentProfile>>(
    initialProfile || {
      fullName: "",
      dateOfBirth: "",
      gender: undefined,
      category: undefined,
      annualIncome: undefined,
      educationLevel: undefined,
      stream: undefined,
      percentage: 0,
      state: "",
      specialCategory: "none",
    }
  )

  const updateProfile = <K extends keyof StudentProfile>(
    key: K,
    value: StudentProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const progress = (currentStep / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          profile.fullName &&
          profile.dateOfBirth &&
          profile.gender &&
          profile.state
        )
      case 2:
        return (
          profile.educationLevel && profile.stream && profile.percentage
        )
      case 3:
        return profile.annualIncome && profile.category
      case 4:
        return profile.specialCategory
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (canProceed()) {
      onComplete(profile as StudentProfile)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-muted bg-muted text-muted-foreground"
                    }`}
                    initial={false}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded-full ${
                      currentStep > step.id ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>

      {/* Form Content */}
      <Card className="border-2">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={profile.fullName || ""}
                      onChange={(e) => updateProfile("fullName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth || ""}
                      onChange={(e) =>
                        updateProfile("dateOfBirth", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={profile.gender}
                      onValueChange={(value) =>
                        updateProfile("gender", value as Gender)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="cursor-pointer">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>State of Residence</Label>
                    <Select
                      value={profile.state}
                      onValueChange={(value) => updateProfile("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Current Education Level</Label>
                    <Select
                      value={profile.educationLevel}
                      onValueChange={(value) =>
                        updateProfile("educationLevel", value as EducationLevel)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">Class 10th</SelectItem>
                        <SelectItem value="12th">Class 12th</SelectItem>
                        <SelectItem value="undergraduate">
                          Undergraduate (UG)
                        </SelectItem>
                        <SelectItem value="postgraduate">
                          Postgraduate (PG)
                        </SelectItem>
                        <SelectItem value="phd">PhD / Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Course / Stream</Label>
                    <Select
                      value={profile.stream}
                      onValueChange={(value) =>
                        updateProfile("stream", value as Stream)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="commerce">Commerce</SelectItem>
                        <SelectItem value="arts">Arts / Humanities</SelectItem>
                        <SelectItem value="law">Law</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentage">
                      Percentage / CGPA (in %)
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter your percentage (e.g., 85)"
                      value={profile.percentage || ""}
                      onChange={(e) =>
                        updateProfile(
                          "percentage",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Convert CGPA to percentage if needed (e.g., 8.5 CGPA = 85%)
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Annual Family Income</Label>
                    <Select
                      value={profile.annualIncome}
                      onValueChange={(value) =>
                        updateProfile("annualIncome", value as IncomeRange)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="below-1l">Below ₹1 Lakh</SelectItem>
                        <SelectItem value="1l-2.5l">₹1 - ₹2.5 Lakh</SelectItem>
                        <SelectItem value="2.5l-5l">₹2.5 - ₹5 Lakh</SelectItem>
                        <SelectItem value="5l-8l">₹5 - ₹8 Lakh</SelectItem>
                        <SelectItem value="above-8l">Above ₹8 Lakh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={profile.category}
                      onValueChange={(value) =>
                        updateProfile("category", value as Category)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="sc">SC (Scheduled Caste)</SelectItem>
                        <SelectItem value="st">ST (Scheduled Tribe)</SelectItem>
                        <SelectItem value="obc">OBC (Other Backward Class)</SelectItem>
                        <SelectItem value="minority">Minority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Special Category (if applicable)</Label>
                    <Select
                      value={profile.specialCategory}
                      onValueChange={(value) =>
                        updateProfile("specialCategory", value as SpecialCategory)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select special category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="differently-abled">
                          Differently Abled (40%+ disability)
                        </SelectItem>
                        <SelectItem value="sports">
                          Sports Person (State/National level)
                        </SelectItem>
                        <SelectItem value="single-girl-child">
                          Single Girl Child
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select if you belong to any special category for additional
                      scholarship opportunities
                    </p>
                  </div>

                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">
                          Ready to Find Your Scholarships!
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Click the button below to discover scholarships that
                          match your profile. We&apos;ll show you personalized
                          recommendations based on your eligibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Find My Scholarships
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
