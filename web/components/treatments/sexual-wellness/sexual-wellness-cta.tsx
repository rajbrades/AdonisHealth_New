"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle, Phone, Calendar } from "lucide-react"
import Link from "next/link"

export function SexualWellnessCta() {
  return (
    <section className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      {/* Background Pattern - matching TRT */}
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
        {/* Hormone Testing Callout */}
        <div className="border border-primary bg-primary/5 p-6 md:p-8 mb-16">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-primary flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Consider Hormone Testing</h3>
              <p className="text-muted-foreground mb-4">
                Low testosterone is a common underlying cause of erectile dysfunction and low libido. We recommend
                checking your hormone levels as part of a comprehensive approach to sexual wellness.
              </p>
              <Link
                href="/treatments/testosterone-replacement-therapy"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Learn About Hormone Testing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main CTA - matching TRT pattern */}
        <div className="text-center space-y-8">
          <div>
            <div className="text-mono-upper text-primary mb-4">Get Started Today</div>
            <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
              READY TO <span className="text-primary">RECLAIM</span> YOUR CONFIDENCE?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with a free, confidential consultation. Our providers will review your needs and recommend the best
              treatment option for you.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-transparent border-2 border-primary text-foreground hover:bg-primary hover:text-background transition-all duration-300 px-10 py-6 text-base font-semibold"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
              <span>100% confidential</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>No office visits</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Discreet shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
