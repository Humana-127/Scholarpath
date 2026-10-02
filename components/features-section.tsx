"use client"

import { motion } from "framer-motion"
import { Search, Bell, BarChart3, Shield, Zap, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description:
      "Our AI-powered algorithm matches you with scholarships based on your profile, interests, and qualifications.",
  },
  {
    icon: Bell,
    title: "Deadline Alerts",
    description:
      "Never miss an opportunity with customizable notifications for upcoming deadlines and new scholarships.",
  },
  {
    icon: BarChart3,
    title: "Application Tracking",
    description:
      "Monitor all your applications in one place with real-time status updates and progress tracking.",
  },
  {
    icon: Shield,
    title: "Verified Opportunities",
    description:
      "Every scholarship is vetted by our team to ensure legitimacy and provide accurate information.",
  },
  {
    icon: Zap,
    title: "One-Click Apply",
    description:
      "Save time with pre-filled applications using your stored profile information and documents.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Connect with other scholars, share tips, and get guidance from students who have won scholarships.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary/50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to{" "}
            <span className="text-primary">Fund Your Education</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            ScholarPath provides all the tools you need to discover, apply, and
            win scholarships efficiently.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full border-0 bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
