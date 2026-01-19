"use client"

import { useEffect, useState, useRef } from "react"

const stats = [
  { value: 10000, displayValue: "10K", suffix: "+", label: "Executives Optimized", detail: "Since 2020" },
  { value: 94, displayValue: "94", suffix: "%", label: "Report Improved Energy", detail: "Within 90 days" },
  { value: 48, displayValue: "48", suffix: "hr", label: "Average Results Time", detail: "From first lab draw" },
  { value: 4.9, displayValue: "4.9", suffix: "/5", label: "Patient Satisfaction", detail: "1,200+ reviews" },
]

function StatCounter({ stat }: { stat: (typeof stats)[number] }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || animationComplete) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / 2000, 1)
      setCount(progress * stat.value)
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimationComplete(true)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, animationComplete, stat.value])

  const displayCount = animationComplete
    ? stat.displayValue
    : stat.value >= 1000
      ? `${Math.floor(count / 1000)}K`
      : stat.value % 1 !== 0
        ? count.toFixed(1)
        : Math.floor(count).toString()

  return (
    <div ref={ref} className="bg-background p-10 group hover:bg-secondary transition-colors">
      <div className="flex items-baseline gap-1">
        <span className="text-6xl md:text-7xl font-black text-foreground tracking-tighter">{displayCount}</span>
        <span className="text-3xl font-black text-primary">{stat.suffix}</span>
      </div>
      <p className="text-foreground font-semibold mt-4">{stat.label}</p>
      <p className="text-mono-upper text-muted-foreground mt-1">{stat.detail}</p>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-px flex-1 bg-border" />
          <span className="text-mono-upper text-primary">By The Numbers</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {stats.map((stat, index) => (
            <StatCounter key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
