"use client"

import { Zap, Heart, Shield, Clock, Sparkles, Stethoscope, Package, CheckCircle } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Enhanced Erectile Function",
    description:
      "Achieve stronger, more reliable erections with clinically proven medications that improve blood flow.",
  },
  {
    icon: Heart,
    title: "Improved Libido & Desire",
    description:
      "Restore sexual desire and arousal with treatments that work on both physical and neurological levels.",
  },
  {
    icon: Shield,
    title: "Increased Sexual Confidence",
    description: "Regain the confidence that comes with knowing you can perform when it matters most.",
  },
  {
    icon: Clock,
    title: "Better Performance & Stamina",
    description: "Experience improved endurance and performance with treatments lasting from 4 hours to 36 hours.",
  },
  {
    icon: Sparkles,
    title: "Spontaneity with Daily Dosing",
    description: "Daily low-dose options allow for spontaneous intimacy without planning around medication timing.",
  },
  {
    icon: CheckCircle,
    title: "Minimal Side Effects",
    description:
      "Well-tolerated medications with decades of safety data. Side effects are typically mild and temporary.",
  },
  {
    icon: Stethoscope,
    title: "Physician-Supervised Treatment",
    description: "Licensed providers monitor your treatment and adjust dosing to optimize results and safety.",
  },
  {
    icon: Package,
    title: "Discreet Home Delivery",
    description: "Medications shipped directly to your door in unmarked packaging. Complete privacy guaranteed.",
  },
]

export function SexualWellnessBenefits() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Benefits</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            RECLAIM YOUR <span className="text-primary">CONFIDENCE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive solutions for erectile dysfunction, low libido, and sexual performance concerns.
          </p>
        </div>

        {/* Benefits Grid - matching TRT pattern */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
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
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
