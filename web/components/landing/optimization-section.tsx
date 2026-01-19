"use client"

import { Zap, TrendingUp, Heart, Sprout, Shield } from "lucide-react"
import { ArrowRight } from "lucide-react"

export function OptimizationSection() {
  const solutions = [
    {
      icon: Zap,
      title: "Testosterone Optimization",
      description: "Comprehensive TRT protocols designed to restore peak testosterone levels and vitality.",
    },
    {
      icon: TrendingUp,
      title: "Performance Enhancement",
      description: "Advanced peptide therapies to maximize athletic performance and recovery.",
    },
    {
      icon: Heart,
      title: "Sexual Wellness",
      description: "Restore confidence and performance with evidence-based sexual health treatments.",
    },
    {
      icon: Sprout,
      title: "Hair Restoration",
      description: "Prevent hair loss and promote regrowth with proven pharmaceutical interventions.",
    },
    {
      icon: Shield,
      title: "Longevity Medicine",
      description: "Cutting-edge protocols to optimize healthspan and extend peak performance years.",
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            ADVANCED <span className="text-primary">OPTIMIZATION</span> SOLUTIONS
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Comprehensive therapies designed to enhance your performance, recovery, and longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {solutions.slice(0, 3).map((solution, i) => (
            <div
              key={i}
              className="bg-background border border-border p-6 sm:p-8 group hover:bg-secondary transition-colors"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border border-border bg-secondary mb-4 sm:mb-6 group-hover:border-primary transition-colors">
                <solution.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{solution.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border mt-px max-w-4xl mx-auto">
          {solutions.slice(3).map((solution, i) => (
            <div
              key={i}
              className="bg-background border border-border p-6 sm:p-8 group hover:bg-secondary transition-colors"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border border-border bg-secondary mb-4 sm:mb-6 group-hover:border-primary transition-colors">
                <solution.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{solution.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-12">
          <button className="group flex items-center gap-2 text-primary text-mono-upper text-sm sm:text-base font-bold hover:gap-4 transition-all">
            EXPLORE ALL OPTIMIZATION GOALS
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
