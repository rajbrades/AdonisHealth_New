"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function MetricCard({ label, value, unit, trend }: { label: string; value: number; unit: string; trend: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="bg-background/40 backdrop-blur-sm border border-primary/20 p-3 sm:p-4">
      <p className="text-mono-upper text-[10px] sm:text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
        {displayValue}
        <span className="text-sm sm:text-base lg:text-lg text-muted-foreground ml-1">{unit}</span>
      </p>
      <p className="text-[10px] sm:text-xs text-primary mt-1">{trend}</p>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-transparent pt-20 sm:pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 w-full md:w-[70%] lg:w-[60%] h-full">
          <Image
            src="/athletic-male-sprinting-running-action-shot-dramat.jpg"
            alt=""
            fill
            className="object-cover object-center grayscale opacity-20 sm:opacity-35 -scale-x-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
            style={{
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        <div className="hidden sm:block absolute right-[20%] top-[10%] w-[400px] h-[400px] opacity-20">
          <div
            className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/5 to-transparent rounded-full blur-3xl"
            style={{
              animation: "breathe 6s ease-in-out infinite",
            }}
          />
        </div>
        <div className="hidden sm:block absolute right-[40%] top-[30%] w-[300px] h-[300px] opacity-15">
          <div
            className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-2xl"
            style={{
              animation: "breathe 8s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.2); opacity: 0.25; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-[0.85]">
            UNLOCK
            <br />
            <span className="text-primary">YOUR</span>
            <br />
            POTENTIAL
          </h1>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            Physician-supervised hormone optimization and performance medicine for men who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center px-4 sm:px-0">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base w-full sm:w-auto"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 sm:px-10 border-border hover:border-primary hover:text-background bg-transparent text-sm sm:text-base"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mt-12 sm:mt-16 lg:mt-20">
          <MetricCard label="TOTAL T" value={847} unit="ng/dL" trend="+23% vs baseline" />
          <MetricCard label="FREE T" value={18} unit="pg/mL" trend="+18% optimal" />
          <MetricCard label="DHEA-S" value={342} unit="μg/dL" trend="+12% improved" />
          <MetricCard label="CORTISOL" value={12} unit="μg/dL" trend="Optimal range" />
          <MetricCard label="IGF-1" value={224} unit="ng/mL" trend="+15% vs baseline" />
          <MetricCard label="THYROID" value={2} unit="mIU/L" trend="Optimal TSH" />
        </div>

        <div className="mt-10 sm:mt-16 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.2em] uppercase">Explore</span>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
