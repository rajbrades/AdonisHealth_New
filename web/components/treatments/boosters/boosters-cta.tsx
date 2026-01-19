"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Calendar } from "lucide-react"

export function BoostersCta() {
  return (
    <section className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(252, 210, 78, 0.1) 50px,
            rgba(252, 210, 78, 0.1) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(252, 210, 78, 0.1) 50px,
            rgba(252, 210, 78, 0.1) 51px
          )`,
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Headline */}
          <div>
            <div className="text-mono-upper text-primary mb-4">Get Started Today</div>
            <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
              BOOST <span className="text-primary">NATURALLY</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your natural optimization journey. Complete your assessment and speak with a physician this week.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-transparent border-2 border-primary text-foreground hover:bg-primary hover:text-background transition-all duration-300 px-10 py-6 text-base font-semibold"
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-border hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 px-10 py-6 text-base bg-transparent"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 1-800-ADONIS
            </Button>
          </div>

          {/* Trust Points */}
          <div className="pt-12 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Results in 48 hours</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Fertility Preserved</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Board-Certified Physicians</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
