"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"

export function BoostersHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/athletic-male-stretching-fitness-dark-background.jpg"
          alt="Athletic man stretching"
          fill
          className="object-cover object-center grayscale opacity-25 -scale-x-100"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono uppercase tracking-wider">
              <span>Treatments</span>
              <span>/</span>
              <span className="text-primary">Natural Boosters</span>
            </div>

            {/* Headline */}
            <h1 className="text-display text-5xl sm:text-6xl lg:text-7xl">
              NATURAL
              <br />
              <span className="text-primary">TESTOSTERONE</span>
              <br />
              BOOSTERS
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Boost your body's natural testosterone production while preserving fertility. Advanced therapies that work
              with your body's own hormone system.
            </p>

            {/* Key Points */}
            <div className="space-y-3">
              {[
                "Preserve natural testosterone production",
                "Maintain fertility and sperm count",
                "Oral and injectable options available",
                "Can be combined with TRT if needed",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-transparent border-2 border-primary text-foreground hover:bg-primary hover:text-background transition-all duration-300 px-8 py-6 text-base font-semibold"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-border hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 px-8 py-6 text-base bg-transparent"
              >
                Boosters vs TRT
              </Button>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="hidden lg:block">
            <div className="border border-border bg-black/50 backdrop-blur-sm p-8 space-y-6">
              <div className="text-mono-upper text-primary mb-6">Treatment Overview</div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-2 border-primary pl-4">
                  <div className="text-4xl font-bold text-foreground">4</div>
                  <div className="text-sm text-muted-foreground mt-1">Protocol Options</div>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="text-4xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Fertility Preservation</div>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="text-4xl font-bold text-foreground">$149</div>
                  <div className="text-sm text-muted-foreground mt-1">Starting Monthly</div>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="text-4xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Online Process</div>
                </div>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  Includes: Medication • Physician Consults • Ongoing Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
