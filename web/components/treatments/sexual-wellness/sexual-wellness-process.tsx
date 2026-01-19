"use client"

import { ClipboardCheck, Stethoscope, Package, HeadphonesIcon } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Online Assessment",
    description: "Complete our confidential health questionnaire online. Takes less than 10 minutes.",
    duration: "10 min",
  },
  {
    number: "02",
    icon: Stethoscope,
    title: "Provider Review",
    description: "Licensed doctor reviews your info and creates your prescription.",
    duration: "24-48 hrs",
  },
  {
    number: "03",
    icon: Package,
    title: "Discreet Delivery",
    description: "Medication ships directly to your door in unmarked packaging.",
    duration: "2-3 days",
  },
  {
    number: "04",
    icon: HeadphonesIcon,
    title: "Ongoing Support",
    description: "Adjust dosing as needed with continued provider access.",
    duration: "Ongoing",
  },
]

export function SexualWellnessProcess() {
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
            Get treatment in 4 simple steps - 100% online and confidential
          </p>
        </div>

        {/* Process Steps - matching TRT pattern */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-border" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
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
              <div className="text-2xl font-bold text-foreground mt-1">3-5 Days</div>
            </div>
            <div className="text-right">
              <span className="text-mono-upper text-muted-foreground">Results Timeline</span>
              <div className="text-2xl font-bold text-primary mt-1">30-60 Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
