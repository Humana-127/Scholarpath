"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Priya Sharma",
    college: "IIT Delhi",
    scholarship: "INSPIRE Scholarship",
    amount: "₹80,000",
    quote:
      "ScholarPath helped me find the INSPIRE scholarship that I didn&apos;t even know I was eligible for. The matching system is incredibly accurate!",
    initials: "PS",
  },
  {
    name: "Rahul Verma",
    college: "NIT Trichy",
    scholarship: "Central Sector Scholarship",
    amount: "₹36,000",
    quote:
      "As a first-generation college student, I had no idea where to start. ScholarPath made the entire process simple and guided me step by step.",
    initials: "RV",
  },
  {
    name: "Ananya Reddy",
    college: "BITS Pilani",
    scholarship: "Pragati Scholarship",
    amount: "₹50,000",
    quote:
      "The deadline reminders saved me! I almost missed the Pragati scholarship deadline but got a notification just in time. Highly recommend!",
    initials: "AR",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Success <span className="text-primary">Stories</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Hear from students who found their perfect scholarships through ScholarPath
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 bg-card shadow-lg transition-all hover:shadow-xl">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-primary/20" />
                  <p className="text-muted-foreground">{testimonial.quote}</p>

                  <div className="mt-6 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-4 border-t pt-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.college}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-accent/10 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Won</p>
                    <p className="font-semibold text-accent">
                      {testimonial.scholarship} - {testimonial.amount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
