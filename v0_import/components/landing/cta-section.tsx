"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="border-2 border-border">
          {/* Top bar */}
          <div className="border-b border-border p-3 sm:p-4 bg-secondary">
            <span className="text-mono-upper text-muted-foreground text-xs sm:text-sm">Ready To Start?</span>
          </div>

          {/* Main CTA content */}
          <div className="p-6 sm:p-12 lg:p-20">
            <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl text-foreground mb-6 sm:mb-8">
              READY TO
              <br />
              <span className="text-primary">OPTIMIZE?</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl">
              Take the first step toward peak performance. Complete your health assessment today and speak with a
              physician within 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 sm:h-14 lg:h-16 px-8 sm:px-12 text-sm sm:text-base"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 lg:h-16 px-8 sm:px-12 text-sm sm:text-base border-border hover:border-primary hover:text-primary bg-transparent"
              >
                Schedule a Call
              </Button>
            </div>
          </div>

          {/* Bottom bar with trust badges */}
          <div className="border-t border-border grid grid-cols-2 md:grid-cols-4">
            {["HIPAA Compliant", "48hr Results", "24/7 Support", "50+ Biomarkers"].map((item, i) => (
              <div
                key={i}
                className={`p-3 sm:p-4 text-center ${i % 2 === 0 ? "border-r border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : ""}`}
              >
                <span className="text-mono-upper text-muted-foreground text-[10px] sm:text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
