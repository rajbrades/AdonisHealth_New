"use client"

import Link from "next/link"
import { CheckCircle, Clock, FileText, Clipboard, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function IntakeSuccess() {
  const nextSteps = [
    {
      number: 1,
      icon: Clock,
      title: "Medical Review",
      description: "A licensed provider will review your assessment within 24-48 hours.",
    },
    {
      number: 2,
      icon: FileText,
      title: "Lab Recommendations",
      description: "We will provide specific lab tests if appropriate for your case.",
    },
    {
      number: 3,
      icon: Clipboard,
      title: "Treatment Plan",
      description: "Personalized optimization protocol based on your assessment and labs.",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 border-2 border-primary flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Assessment <span className="text-primary">Complete</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Thank you for completing your health assessment. Our medical team will review your information.
        </p>

        {/* What Happens Next */}
        <div className="border border-border p-6 md:p-8 text-left mb-10">
          <h2 className="text-xl font-semibold text-primary mb-6">What Happens Next</h2>
          <div className="space-y-6">
            {nextSteps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  {step.number}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="mr-2 w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
