"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search, Sparkles, TrendingUp, Users, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  )
}

const floatingCards = [
  { name: "NSP", amount: "₹50,000", delay: 0 },
  { name: "Pragati", amount: "₹50,000", delay: 0.2 },
  { name: "INSPIRE", amount: "₹80,000", delay: 0.4 },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <motion.div
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Floating Cards (Desktop only) */}
      <div className="absolute inset-0 hidden lg:block">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.name}
            className="absolute rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            style={{
              top: `${20 + index * 25}%`,
              left: index % 2 === 0 ? "8%" : "auto",
              right: index % 2 === 1 ? "8%" : "auto",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: card.delay + 0.5, duration: 0.5 },
              y: {
                delay: card.delay + 1,
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/20 p-2">
                <GraduationCap className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-foreground/70">
                  {card.name}
                </p>
                <p className="text-sm font-bold text-primary-foreground">
                  {card.amount}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4" />
            Trusted by 2 Lakh+ Indian students
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Find Scholarships That{" "}
            <span className="text-black">
              Fund Your Future
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 max-w-2xl text-pretty text-lg text-primary-foreground/80 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Discover thousands of scholarships matched to your profile. Track
            applications, meet deadlines, and maximize your funding potential.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
              asChild
            >
              <Link href="/profile">
                <Sparkles className="mr-2 h-5 w-5" />
                Find My Scholarships
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/scholarships">
                <Search className="mr-2 h-5 w-5" />
                Browse All
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold text-primary-foreground">
                  <AnimatedCounter value={500} suffix="+" />
                </span>
              </div>
              <span className="mt-1 text-sm text-primary-foreground/70">
                Active Scholarships
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold text-primary-foreground">
                  <AnimatedCounter value={2} suffix=" Cr+" />
                </span>
              </div>
              <span className="mt-1 text-sm text-primary-foreground/70">
                Students Helped
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold text-primary-foreground">
                  ₹<AnimatedCounter value={500} suffix=" Cr+" />
                </span>
              </div>
              <span className="mt-1 text-sm text-primary-foreground/70">
                Scholarships Awarded
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
