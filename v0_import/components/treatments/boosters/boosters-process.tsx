"use client"

import { ClipboardCheck, TestTube, Stethoscope, Package, LineChart } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Online Assessment",
    description: "Complete a comprehensive health questionnaire including fertility goals and symptoms.",
    duration: "10 min",
  },
  {
    number: "02",
    icon: TestTube,
    title: "Order Lab Work",
    description:
      "We'll provide a lab order for comprehensive hormone panel. Lab fees are separate and may be covered by insurance.",
    duration: "Same day",
  },
  {
    number: "03",
    icon: Stethoscope,
    title: "Physician Consultation",
    description: "Review your results with a physician who specializes in natural hormone optimization.",
    duration: "30 min",
  },
  {
    number: "04",
    icon: Package,
    title: "Treatment Delivery",
    description: "Receive your prescribed protocol shipped directly to your door in discreet packaging.",
    duration: "2-3 days",
  },
  {
    number: "05",
    icon: LineChart,
    title: "Ongoing Monitoring",
    description: "Regular labs to track your progress and optimize your protocol for best results.",
    duration: "Ongoing",
  },
]

export function BoostersProcess() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Process</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            HOW IT <span className="text-primary">WORKS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Simple process to start your natural optimization journey. From assessment to treatment in as little as one
            week.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-border" />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-6 lg:flex-col lg:items-start">
                  <div className="w-12 h-12 bg-primary text-background flex items-center justify-center font-mono font-bold text-lg relative z-10">
                    {step.number}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider lg:mt-4">
                    {step.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:pr-4">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-mono-upper text-muted-foreground">Total Time to Treatment</span>
              <div className="text-2xl font-bold text-foreground mt-1">5-7 Days</div>
            </div>
            <div className="text-right">
              <span className="text-mono-upper text-muted-foreground">Results Timeline</span>
              <div className="text-2xl font-bold text-primary mt-1">4-8 Weeks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
