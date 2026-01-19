"use client"

import { Zap, Brain, Dumbbell, Heart, Moon, TrendingUp } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Increased Energy",
    description:
      "Combat fatigue and restore the vitality you had in your 20s. Experience sustained energy throughout the day.",
    stat: "85%",
    statLabel: "report improved energy*",
  },
  {
    icon: Brain,
    title: "Mental Clarity",
    description:
      "Sharpen focus, improve memory, and eliminate brain fog. Optimize cognitive performance for peak productivity.",
    stat: null,
    statLabel: "Clinically observed improvements",
  },
  {
    icon: Dumbbell,
    title: "Lean Muscle Mass",
    description: "Build and maintain muscle more effectively. Accelerate recovery and maximize your training results.",
    stat: "2-3kg",
    statLabel: "avg. lean mass gain*",
  },
  {
    icon: Heart,
    title: "Cardiovascular Health",
    description:
      "Support heart health with optimized hormone levels. TRAVERSE study confirmed cardiovascular safety profile.",
    stat: null,
    statLabel: "Proven safety profile",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Achieve deeper, more restorative sleep. Wake up refreshed and ready to perform at your best.",
    stat: null,
    statLabel: "Reported improvements",
  },
  {
    icon: TrendingUp,
    title: "Libido & Performance",
    description: "Restore sexual health and confidence. Experience improved drive and performance.",
    stat: "85%",
    statLabel: "report improved libido*",
  },
]

export function TRTBenefits() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Benefits</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            WHY <span className="text-primary">TRT</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Testosterone replacement therapy addresses the root cause of low T symptoms, delivering measurable
            improvements across all areas of health and performance.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background p-8 md:p-10 group hover:bg-secondary/50 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 border border-primary flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <benefit.icon className="w-7 h-7 text-primary group-hover:text-background transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{benefit.description}</p>

              {/* Stat - conditionally render stat or just label */}
              <div className="flex items-baseline gap-2 pt-4 border-t border-border">
                {benefit.stat ? (
                  <>
                    <span className="text-3xl font-bold text-primary">{benefit.stat}</span>
                    <span className="text-sm text-muted-foreground">{benefit.statLabel}</span>
                  </>
                ) : (
                  <span className="text-sm text-primary font-medium">{benefit.statLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            *Based on 2025 UK cross-sectional survey of 905 men receiving TRT (Translational Andrology and Urology) and
            meta-analysis of lean body mass outcomes.
          </p>
        </div>
      </div>
    </section>
  )
}
