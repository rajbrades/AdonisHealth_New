"use client"

import { ClipboardList, TestTube, Video, TrendingUp } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Assessment",
      description: "Complete comprehensive health questionnaire online in 10 minutes.",
    },
    {
      icon: TestTube,
      title: "Lab Work",
      description: "Visit local lab or schedule mobile phlebotomy at your location.",
    },
    {
      icon: Video,
      title: "Consultation",
      description: "Review results with board-certified physician via video call.",
    },
    {
      icon: TrendingUp,
      title: "Optimization",
      description: "Receive personalized protocol with continuous AI monitoring.",
    },
  ]

  return (
    <section id="process" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="pb-8 sm:pb-12 border-b border-border">
          <span className="text-mono-upper text-primary text-sm">How It Works</span>
          <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mt-4">
            FOUR STEPS TO
            <br />
            <span className="text-primary">OPTIMIZATION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10 sm:mt-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative ${i !== 3 ? "lg:border-r border-border" : ""} ${i < 2 ? "sm:border-b lg:border-b-0 border-border" : ""} ${i === 0 || i === 1 ? "border-b sm:border-b border-border lg:border-b-0" : ""}`}
            >
              {/* Step number - hidden on small mobile */}
              <div className="absolute -top-4 sm:-top-8 left-0">
                <span className="text-5xl sm:text-6xl lg:text-8xl font-black text-secondary">0{i + 1}</span>
              </div>

              <div className="relative pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center border-2 border-border mb-4 sm:mb-6 group-hover:border-primary">
                  <step.icon className="h-5 w-5 sm:h-7 sm:w-7 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connecting arrow - only show on lg */}
              {i !== 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-primary">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
