"use client"

import { motion } from "framer-motion"
import { User, Sparkles, Send, ArrowRight } from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Create Profile",
    description:
      "Fill in your academic details, family income, and category. It takes just 2 minutes.",
    icon: User,
    color: "bg-primary",
  },
  {
    step: 2,
    title: "Auto Match",
    description:
      "Our smart engine matches your profile against 500+ scholarships and shows eligible ones.",
    icon: Sparkles,
    color: "bg-accent",
  },
  {
    step: 3,
    title: "Apply & Track",
    description:
      "Apply directly through our platform and track all your applications in one dashboard.",
    icon: Send,
    color: "bg-sky-500",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Get matched with scholarships in 3 simple steps
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} text-white shadow-lg`}
                >
                  <step.icon className="h-10 w-10" />
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="mx-8 hidden h-8 w-8 text-muted-foreground/30 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
