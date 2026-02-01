"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

export function ScrollStep({ 
  stepNumber, 
  title, 
  highlight, 
  description, 
  imagePath,
  icon,
  details,
  alternate = false 
}: { 
  stepNumber: number
  title: string
  highlight: string
  description: string
  imagePath: string
  icon?: React.ReactNode
  details: string[]
  alternate?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section 
      ref={ref}
      className={`relative min-h-screen flex items-center border-b border-border ${
        stepNumber % 2 === 0 ? 'bg-zinc-950' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4 py-20">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${alternate ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content Side */}
          <div 
            className={`transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${alternate ? 'lg:order-2' : ''}`}
          >
            <div className="inline-block px-4 py-1.5 border border-primary/30 mb-8">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                Step {stepNumber}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {title}{" "}
              <span className="text-primary">{highlight}</span>
            </h2>
            
            <p className="text-lg text-zinc-300 leading-relaxed mb-8">
              {description}
            </p>

            {/* Detail Points */}
            <div className="space-y-4">
              {details.map((detail, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${300 + idx * 100}ms` }}
                >
                  <div className="mt-1 w-5 h-5 border border-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-zinc-400 text-sm font-medium">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${alternate ? 'lg:order-1' : ''}`}
          >
            <div className="relative max-w-md mx-auto">
              {/* Subtle glow effect behind image */}
              <div className="absolute inset-0 bg-primary/5 blur-3xl scale-75" />
              
              {/* Main image - no borders, seamless integration */}
              <div className="relative">
                <img 
                  src={imagePath || "/placeholder.svg"}
                  alt={`Step ${stepNumber}: ${title} ${highlight}`}
                  className="w-full h-auto object-contain mix-blend-lighten opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
