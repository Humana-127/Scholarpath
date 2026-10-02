export type Gender = "male" | "female" | "other"
export type Category = "general" | "sc" | "st" | "obc" | "minority"
export type IncomeRange = "below-1l" | "1l-2.5l" | "2.5l-5l" | "5l-8l" | "above-8l"
export type EducationLevel = "10th" | "12th" | "undergraduate" | "postgraduate" | "phd"
export type Stream = "engineering" | "medical" | "arts" | "commerce" | "science" | "law" | "other"
export type SpecialCategory = "differently-abled" | "sports" | "single-girl-child" | "none"

export type StudentProfile = {
  fullName: string
  dateOfBirth: string
  gender: Gender
  category: Category
  annualIncome: IncomeRange
  educationLevel: EducationLevel
  stream: Stream
  percentage: number
  state: string
  specialCategory: SpecialCategory
}

export type EligibilityCriteria = {
  genders?: Gender[]
  categories?: Category[]
  maxIncome?: IncomeRange[]
  educationLevels?: EducationLevel[]
  streams?: Stream[]
  minPercentage?: number
  states?: string[]
  specialCategories?: SpecialCategory[]
  topPercentile?: number
}

export type Scholarship = {
  id: string
  name: string
  organization: string
  amount: number
  deadline: string
  category: string
  description: string
  eligibility: string[]
  eligibilityCriteria: EligibilityCriteria
  documentsRequired: string[]
  applicationUrl: string
}

export type Application = {
  id: string
  scholarshipId: string
  scholarshipName: string
  organization: string
  amount: number
  deadline: string
  status: "draft" | "in-progress" | "submitted" | "under-review" | "accepted" | "rejected"
  progress: number
  appliedDate?: string
}

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

export const northEastStates = [
  "Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Sikkim", "Tripura"
]

const incomeOrder: IncomeRange[] = ["below-1l", "1l-2.5l", "2.5l-5l", "5l-8l", "above-8l"]

export function isIncomeEligible(studentIncome: IncomeRange, maxIncomes: IncomeRange[]): boolean {
  const studentIndex = incomeOrder.indexOf(studentIncome)
  return maxIncomes.some(max => studentIndex <= incomeOrder.indexOf(max))
}

export function calculateEligibilityScore(profile: StudentProfile, scholarship: Scholarship): { score: number; matchedCriteria: string[]; unmatchedCriteria: string[] } {
  const criteria = scholarship.eligibilityCriteria
  const matchedCriteria: string[] = []
  const unmatchedCriteria: string[] = []
  let totalCriteria = 0
  let matchedCount = 0

  // Gender check
  if (criteria.genders && criteria.genders.length > 0) {
    totalCriteria++
    if (criteria.genders.includes(profile.gender)) {
      matchedCount++
      matchedCriteria.push(`Gender: ${profile.gender === 'female' ? 'Female' : profile.gender === 'male' ? 'Male' : 'Other'}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.genders.map(g => g === 'female' ? 'Female' : g === 'male' ? 'Male' : 'Other').join('/')}`)
    }
  }

  // Category check
  if (criteria.categories && criteria.categories.length > 0) {
    totalCriteria++
    if (criteria.categories.includes(profile.category)) {
      matchedCount++
      matchedCriteria.push(`Category: ${profile.category.toUpperCase()}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.categories.map(c => c.toUpperCase()).join('/')} category`)
    }
  }

  // Income check
  if (criteria.maxIncome && criteria.maxIncome.length > 0) {
    totalCriteria++
    if (isIncomeEligible(profile.annualIncome, criteria.maxIncome)) {
      matchedCount++
      matchedCriteria.push("Income criteria met")
    } else {
      unmatchedCriteria.push("Income exceeds limit")
    }
  }

  // Education level check
  if (criteria.educationLevels && criteria.educationLevels.length > 0) {
    totalCriteria++
    if (criteria.educationLevels.includes(profile.educationLevel)) {
      matchedCount++
      matchedCriteria.push(`Education: ${profile.educationLevel}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.educationLevels.join('/')} level`)
    }
  }

  // Stream check
  if (criteria.streams && criteria.streams.length > 0) {
    totalCriteria++
    if (criteria.streams.includes(profile.stream)) {
      matchedCount++
      matchedCriteria.push(`Stream: ${profile.stream}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.streams.join('/')} stream`)
    }
  }

  // Percentage check
  if (criteria.minPercentage) {
    totalCriteria++
    if (profile.percentage >= criteria.minPercentage) {
      matchedCount++
      matchedCriteria.push(`${profile.percentage}% >= ${criteria.minPercentage}% required`)
    } else {
      unmatchedCriteria.push(`Requires ${criteria.minPercentage}%+ marks`)
    }
  }

  // State check
  if (criteria.states && criteria.states.length > 0) {
    totalCriteria++
    if (criteria.states.includes(profile.state)) {
      matchedCount++
      matchedCriteria.push(`State: ${profile.state}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.states.length > 3 ? 'specific state residency' : criteria.states.join('/')}`)
    }
  }

  // Special category check
  if (criteria.specialCategories && criteria.specialCategories.length > 0 && !criteria.specialCategories.includes('none')) {
    totalCriteria++
    if (criteria.specialCategories.includes(profile.specialCategory)) {
      matchedCount++
      matchedCriteria.push(`Special: ${profile.specialCategory.replace('-', ' ')}`)
    } else {
      unmatchedCriteria.push(`Requires: ${criteria.specialCategories.map(s => s.replace('-', ' ')).join('/')}`)
    }
  }

  const score = totalCriteria > 0 ? Math.round((matchedCount / totalCriteria) * 100) : 100
  return { score, matchedCriteria, unmatchedCriteria }
}

export const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "NSP Central Sector Scholarship",
    organization: "Ministry of Education, Government of India",
    amount: 12000,
    deadline: "2026-05-15",
    category: "Government",
    description: "Merit-based scholarship for students from non-creamy layer pursuing undergraduate courses after Class 12.",
    eligibility: ["12th passed with 80%+", "Family income < ₹4.5L/year", "Pursuing undergraduate course"],
    eligibilityCriteria: {
      educationLevels: ["undergraduate"],
      minPercentage: 80,
      maxIncome: ["below-1l", "1l-2.5l", "2.5l-5l"]
    },
    documentsRequired: ["Class 12 Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    applicationUrl: "#"
  },
  {
    id: "2",
    name: "Post Matric Scholarship for SC/ST",
    organization: "Ministry of Social Justice & Empowerment",
    amount: 15000,
    deadline: "2026-04-30",
    category: "Government",
    description: "Financial assistance for SC/ST students pursuing post-matriculation studies in recognized institutions.",
    eligibility: ["SC/ST Category", "Post-matric student", "Any income level"],
    eligibilityCriteria: {
      categories: ["sc", "st"],
      educationLevels: ["12th", "undergraduate", "postgraduate", "phd"]
    },
    documentsRequired: ["Caste Certificate", "Previous Year Marksheet", "Aadhaar Card", "Income Certificate"],
    applicationUrl: "#"
  },
  {
    id: "3",
    name: "Pragati Scholarship for Girls",
    organization: "AICTE - Ministry of Education",
    amount: 50000,
    deadline: "2026-06-01",
    category: "Women",
    description: "Empowering young women by providing financial support for technical education in AICTE approved institutions.",
    eligibility: ["Female students only", "Technical education (Engineering/Pharmacy)", "Family income < ₹8L/year"],
    eligibilityCriteria: {
      genders: ["female"],
      streams: ["engineering"],
      educationLevels: ["undergraduate"],
      maxIncome: ["below-1l", "1l-2.5l", "2.5l-5l", "5l-8l"]
    },
    documentsRequired: ["AICTE Approval Letter", "Income Certificate", "Previous Marksheet", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "4",
    name: "Saksham Scholarship for PWD",
    organization: "AICTE - Ministry of Education",
    amount: 50000,
    deadline: "2026-05-20",
    category: "Differently Abled",
    description: "Supporting differently-abled students pursuing technical education with tuition fees and incidentals.",
    eligibility: ["40%+ disability certificate", "Technical degree program", "Any income level"],
    eligibilityCriteria: {
      specialCategories: ["differently-abled"],
      streams: ["engineering"],
      educationLevels: ["undergraduate"]
    },
    documentsRequired: ["Disability Certificate (40%+)", "Medical Certificate", "Previous Marksheet", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "5",
    name: "Merit cum Means Minority Scholarship",
    organization: "Ministry of Minority Affairs",
    amount: 30000,
    deadline: "2026-05-10",
    category: "Minority",
    description: "Financial assistance for minority community students pursuing professional and technical courses.",
    eligibility: ["Minority community", "Family income < ₹2.5L/year", "50%+ in qualifying exam"],
    eligibilityCriteria: {
      categories: ["minority"],
      maxIncome: ["below-1l", "1l-2.5l"],
      minPercentage: 50,
      educationLevels: ["undergraduate", "postgraduate"]
    },
    documentsRequired: ["Minority Certificate", "Income Certificate", "Previous Marksheet", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "6",
    name: "INSPIRE Scholarship by DST",
    organization: "Department of Science & Technology",
    amount: 80000,
    deadline: "2026-04-15",
    category: "Merit",
    description: "Scholarship for Higher Education (SHE) for top performers pursuing natural sciences at BSc/MSc level.",
    eligibility: ["Top 1% in Class 12 boards", "BSc/Integrated MSc in Natural Sciences", "Age below 22"],
    eligibilityCriteria: {
      streams: ["science"],
      educationLevels: ["undergraduate", "postgraduate"],
      minPercentage: 95
    },
    documentsRequired: ["Class 12 Marksheet (Top 1%)", "Admission Letter", "Age Proof", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "7",
    name: "Kishore Vaigyanik Protsahan Yojana",
    organization: "Indian Institute of Science, Bangalore",
    amount: 60000,
    deadline: "2026-06-30",
    category: "STEM",
    description: "KVPY fellowship for students with aptitude for research to encourage careers in basic science research.",
    eligibility: ["Science/Engineering stream", "CGPA above 7.0 (70%)", "Indian Citizen"],
    eligibilityCriteria: {
      streams: ["science", "engineering"],
      educationLevels: ["12th", "undergraduate"],
      minPercentage: 70
    },
    documentsRequired: ["Previous Year Marksheet", "KVPY Admit Card", "Aadhaar Card", "Photograph"],
    applicationUrl: "#"
  },
  {
    id: "8",
    name: "Indira Gandhi Single Girl Child Scholarship",
    organization: "University Grants Commission",
    amount: 36200,
    deadline: "2026-05-25",
    category: "Women",
    description: "Support for single girl child pursuing postgraduate studies in any recognized university.",
    eligibility: ["Female only", "Single girl child", "Postgraduate level", "Age below 30"],
    eligibilityCriteria: {
      genders: ["female"],
      specialCategories: ["single-girl-child"],
      educationLevels: ["postgraduate"]
    },
    documentsRequired: ["Affidavit (Single Girl Child)", "UG Degree", "Admission Letter", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "9",
    name: "OBC Pre-Matric Scholarship",
    organization: "Ministry of Social Justice & Empowerment",
    amount: 7000,
    deadline: "2026-04-20",
    category: "Government",
    description: "Financial support for OBC students studying in Class 1-10 from economically weaker families.",
    eligibility: ["OBC Category", "Family income < ₹1L/year", "Class 1 to 10"],
    eligibilityCriteria: {
      categories: ["obc"],
      maxIncome: ["below-1l"],
      educationLevels: ["10th"]
    },
    documentsRequired: ["OBC Certificate", "Income Certificate", "Previous Marksheet", "School Bonafide"],
    applicationUrl: "#"
  },
  {
    id: "10",
    name: "State Merit Scholarship Karnataka",
    organization: "Department of Collegiate Education, Karnataka",
    amount: 10000,
    deadline: "2026-05-30",
    category: "Regional",
    description: "Merit scholarship for Karnataka domicile students scoring above 75% in qualifying exams.",
    eligibility: ["Karnataka state domicile", "75%+ in qualifying exam", "Any category"],
    eligibilityCriteria: {
      states: ["Karnataka"],
      minPercentage: 75,
      educationLevels: ["undergraduate", "postgraduate"]
    },
    documentsRequired: ["Domicile Certificate", "Previous Marksheet", "Aadhaar Card", "Bank Passbook"],
    applicationUrl: "#"
  },
  {
    id: "11",
    name: "ISHAN UDAY NE Scholarship",
    organization: "University Grants Commission",
    amount: 54000,
    deadline: "2026-06-15",
    category: "Regional",
    description: "Special scholarship for students from North Eastern states pursuing undergraduate courses outside NER.",
    eligibility: ["NER state domicile", "Family income < ₹4.5L/year", "Undergraduate student"],
    eligibilityCriteria: {
      states: northEastStates,
      maxIncome: ["below-1l", "1l-2.5l", "2.5l-5l"],
      educationLevels: ["undergraduate"]
    },
    documentsRequired: ["Domicile Certificate (NER)", "Income Certificate", "Admission Letter", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "12",
    name: "Maulana Azad National Fellowship",
    organization: "Ministry of Minority Affairs",
    amount: 300000,
    deadline: "2026-05-10",
    category: "Research",
    description: "Fellowship for minority community students pursuing MPhil/PhD in Sciences, Humanities, and Social Sciences.",
    eligibility: ["Minority community", "NET/JRF qualified", "PhD admission"],
    eligibilityCriteria: {
      categories: ["minority"],
      educationLevels: ["phd"],
      minPercentage: 55
    },
    documentsRequired: ["Minority Certificate", "NET/JRF Certificate", "PhD Admission Letter", "Research Proposal"],
    applicationUrl: "#"
  },
  {
    id: "13",
    name: "Prime Minister Research Fellowship",
    organization: "Ministry of Education",
    amount: 840000,
    deadline: "2026-04-20",
    category: "Research",
    description: "Prestigious fellowship for PhD scholars in IITs, IISc, NITs, IISERs with attractive stipend and research grant.",
    eligibility: ["PhD admission in IIT/IISc/NIT/IISER", "GATE/NET qualified", "BTech with 8+ CGPA"],
    eligibilityCriteria: {
      educationLevels: ["phd"],
      streams: ["engineering", "science"],
      minPercentage: 80
    },
    documentsRequired: ["GATE/NET Scorecard", "BTech Degree (8+ CGPA)", "PhD Admission Letter", "Research Proposal"],
    applicationUrl: "#"
  },
  {
    id: "14",
    name: "Tata Trusts Scholarship",
    organization: "Tata Education & Development Trust",
    amount: 120000,
    deadline: "2026-05-30",
    category: "Corporate",
    description: "Comprehensive scholarship covering tuition and living expenses for meritorious students from underprivileged backgrounds.",
    eligibility: ["Family income < ₹4L/year", "60%+ in qualifying exam", "Undergraduate/Postgraduate"],
    eligibilityCriteria: {
      maxIncome: ["below-1l", "1l-2.5l", "2.5l-5l"],
      minPercentage: 60,
      educationLevels: ["undergraduate", "postgraduate"]
    },
    documentsRequired: ["Income Certificate", "Previous Marksheet", "Admission Letter", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "15",
    name: "Reliance Foundation Scholarship",
    organization: "Reliance Foundation",
    amount: 200000,
    deadline: "2026-04-25",
    category: "Corporate",
    description: "Supporting undergraduate students in top institutions pursuing degrees in AI, Computer Science, and related fields.",
    eligibility: ["UG in AI/CS/Data Science", "Top 100 NIRF institution", "Family income < ₹15L/year"],
    eligibilityCriteria: {
      streams: ["engineering"],
      educationLevels: ["undergraduate"],
      minPercentage: 70
    },
    documentsRequired: ["Admission Letter (NIRF Top 100)", "Previous Marksheet", "Income Certificate", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "16",
    name: "Begum Hazrat Mahal Scholarship",
    organization: "Maulana Azad Education Foundation",
    amount: 12000,
    deadline: "2026-05-15",
    category: "Minority",
    description: "Financial assistance for meritorious girls from minority communities pursuing secondary education.",
    eligibility: ["Female from minority community", "Class 9-12", "50%+ marks", "Income < ₹2L/year"],
    eligibilityCriteria: {
      genders: ["female"],
      categories: ["minority"],
      educationLevels: ["10th", "12th"],
      minPercentage: 50,
      maxIncome: ["below-1l", "1l-2.5l"]
    },
    documentsRequired: ["Minority Certificate", "Previous Marksheet", "Income Certificate", "School Bonafide"],
    applicationUrl: "#"
  },
  {
    id: "17",
    name: "Dr. Ambedkar National Merit Award",
    organization: "Dr. Ambedkar Foundation",
    amount: 50000,
    deadline: "2026-06-10",
    category: "Government",
    description: "Merit award for SC/ST students who have secured top positions in Class 10 and 12 board exams.",
    eligibility: ["SC/ST Category", "85%+ in Class 10/12", "Any income level"],
    eligibilityCriteria: {
      categories: ["sc", "st"],
      minPercentage: 85,
      educationLevels: ["12th", "undergraduate"]
    },
    documentsRequired: ["Caste Certificate", "Board Marksheet (85%+)", "School Bonafide", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "18",
    name: "Vidyasaarathi Scholarship",
    organization: "NSDL e-Governance",
    amount: 40000,
    deadline: "2026-05-20",
    category: "Corporate",
    description: "Multiple scholarships from various corporates for undergraduate students in professional courses.",
    eligibility: ["Family income < ₹6L/year", "Professional course", "60%+ marks"],
    eligibilityCriteria: {
      maxIncome: ["below-1l", "1l-2.5l", "2.5l-5l", "5l-8l"],
      educationLevels: ["undergraduate"],
      minPercentage: 60
    },
    documentsRequired: ["Income Certificate", "Previous Marksheet", "Admission Letter", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "19",
    name: "LIC Golden Jubilee Scholarship",
    organization: "LIC of India",
    amount: 20000,
    deadline: "2026-04-30",
    category: "Corporate",
    description: "Financial support for economically backward students pursuing higher studies after Class 10.",
    eligibility: ["60%+ in Class 10", "Family income < ₹2L/year", "Class 11 onwards"],
    eligibilityCriteria: {
      maxIncome: ["below-1l", "1l-2.5l"],
      minPercentage: 60,
      educationLevels: ["12th", "undergraduate"]
    },
    documentsRequired: ["Class 10 Marksheet", "Income Certificate", "School/College Bonafide", "Aadhaar Card"],
    applicationUrl: "#"
  },
  {
    id: "20",
    name: "AICTE Swanath Scholarship",
    organization: "AICTE - Ministry of Education",
    amount: 50000,
    deadline: "2026-06-01",
    category: "Government",
    description: "Support for orphan students pursuing technical education in AICTE approved institutions.",
    eligibility: ["Orphan students", "Technical education", "AICTE approved institution"],
    eligibilityCriteria: {
      streams: ["engineering"],
      educationLevels: ["undergraduate"]
    },
    documentsRequired: ["Death Certificate (Parents)", "Orphanage Certificate", "Admission Letter", "Aadhaar Card"],
    applicationUrl: "#"
  }
]

export const applications: Application[] = [
  {
    id: "app-1",
    scholarshipId: "1",
    scholarshipName: "NSP Central Sector Scholarship",
    organization: "Ministry of Education, Government of India",
    amount: 12000,
    deadline: "2026-05-15",
    status: "in-progress",
    progress: 65,
    appliedDate: undefined
  },
  {
    id: "app-2",
    scholarshipId: "6",
    scholarshipName: "INSPIRE Scholarship by DST",
    organization: "Department of Science & Technology",
    amount: 80000,
    deadline: "2026-04-15",
    status: "submitted",
    progress: 100,
    appliedDate: "2026-03-15"
  },
  {
    id: "app-3",
    scholarshipId: "3",
    scholarshipName: "Pragati Scholarship for Girls",
    organization: "AICTE - Ministry of Education",
    amount: 50000,
    deadline: "2026-06-01",
    status: "under-review",
    progress: 100,
    appliedDate: "2026-03-01"
  },
  {
    id: "app-4",
    scholarshipId: "14",
    scholarshipName: "Tata Trusts Scholarship",
    organization: "Tata Education & Development Trust",
    amount: 120000,
    deadline: "2026-05-30",
    status: "draft",
    progress: 25,
    appliedDate: undefined
  },
  {
    id: "app-5",
    scholarshipId: "13",
    scholarshipName: "Prime Minister Research Fellowship",
    organization: "Ministry of Education",
    amount: 840000,
    deadline: "2026-04-20",
    status: "accepted",
    progress: 100,
    appliedDate: "2026-02-28"
  }
]

export const categories = [
  "All",
  "Government",
  "Merit",
  "STEM",
  "Women",
  "Minority",
  "Corporate",
  "Research",
  "Differently Abled",
  "Regional"
]

export const amountRanges = [
  { label: "All Amounts", min: 0, max: Infinity },
  { label: "Under ₹25,000", min: 0, max: 25000 },
  { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "₹1,00,000+", min: 100000, max: Infinity }
]
