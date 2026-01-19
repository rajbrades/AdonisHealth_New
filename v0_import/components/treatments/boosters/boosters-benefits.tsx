"use client"

import { Zap, Baby, Shield, ArrowDownUp, Brain, Heart } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Natural Production",
    description:
      "Stimulate your body's own testosterone production rather than replacing it. Keep your natural hormone pathways active.",
    stat: null,
    statLabel: "Preserves natural function",
  },
  {
    icon: Baby,
    title: "Fertility Preservation",
    description:
      "Unlike TRT, natural boosters maintain or enhance sperm production. Ideal for men planning to have children.",
    stat: "100%",
    statLabel: "fertility maintained",
  },
  {
    icon: Shield,
    title: "Minimal Side Effects",
    description:
      "Generally well-tolerated with fewer side effects than traditional TRT. No testicular atrophy concerns.",
    stat: null,
    statLabel: "Well-tolerated protocols",
  },
  {
    icon: ArrowDownUp,
    title: "Easier Discontinuation",
    description:
      "Can be stopped without the withdrawal effects associated with TRT. Your body continues producing testosterone naturally.",
    stat: null,
    statLabel: "No dependency concerns",
  },
  {
    icon: Brain,
    title: "Cognitive Benefits",
    description: "Experience improved mental clarity, focus, and mood as your testosterone levels optimize naturally.",
    stat: null,
    statLabel: "Reported improvements",
  },
  {
    icon: Heart,
    title: "Cardiovascular Safe",
    description:
      "Natural optimization approaches have excellent cardiovascular safety profiles with minimal impact on hematocrit.",
    stat: null,
    statLabel: "Proven safety profile",
  },
]

export function BoostersBenefits() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Benefits</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            WHY <span className="text-primary">NATURAL</span> BOOSTERS?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Natural testosterone optimization offers unique advantages for men who want to enhance their hormone levels
            while maintaining their body's natural production.
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

              {/* Stat */}
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
      </div>
    </section>
  )
}
