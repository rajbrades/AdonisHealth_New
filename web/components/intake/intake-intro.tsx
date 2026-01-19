"use client"

import Link from "next/link"
import { Users, Shield, Clock, CheckCircle, ArrowRight, FlaskConical, Stethoscope, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function IntakeIntro() {
  const steps = [
    {
      icon: Users,
      title: "Medical Assessment",
      description: "Comprehensive health questionnaire and goals evaluation",
    },
    {
      icon: Shield,
      title: "Provider Review",
      description: "Licensed provider analyzes your profile and makes lab recommendations",
    },
    {
      icon: Clock,
      title: "Treatment Plan",
      description: "Personalized protocol delivered with ongoing monitoring",
    },
  ]

  const inclusions = [
    "Comprehensive health assessment",
    "Hormone optimization evaluation",
    "Peptide therapy screening",
    "Weight management analysis",
    "Lab test recommendations",
    "Licensed provider review",
    "Personalized treatment plan",
    "Ongoing monitoring support",
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Start Your <span className="text-primary">Optimization</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete a comprehensive health assessment with our licensed medical team. Get personalized treatment
            recommendations in 24-48 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="border border-border p-6 text-center">
              <div className="w-12 h-12 border border-primary/50 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Consultation Includes */}
        <div className="border border-border p-8 mb-12">
          <h2 className="text-xl font-semibold text-primary mb-6">Your Consultation Includes:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {inclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

          <div className="relative border border-primary/40 p-10 md:p-12">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left side - Content */}
              <div>
                <div className="inline-flex items-center gap-2 border border-primary/50 px-3 py-1 mb-6">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">Free Assessment</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Get Your Lab <span className="text-primary">Recommendations</span>
                </h2>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Complete our health assessment and receive personalized lab panel recommendations tailored to your
                  symptoms and optimization goals. Multiple testing options available.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-primary/50 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Customized lab panel options based on your profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-primary/50 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Choose from Essential, Comprehensive, or Executive panels</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-primary/50 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Provider review within 24-48 hours</span>
                  </div>
                </div>

                <Link href="/get-started/assessment">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base"
                  >
                    Begin Free Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground mt-4 font-mono">
                  TAKES 10-15 MIN • NO CREDIT CARD • 100% CONFIDENTIAL
                </p>
              </div>

              {/* Right side - Visual element */}
              <div className="hidden md:block">
                <div className="border border-border p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm uppercase tracking-wider">What You'll Receive</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 border border-primary/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Lab Panel Recommendations</h4>
                        <p className="text-sm text-muted-foreground">
                          Customized testing options based on your health profile
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 border border-primary/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Provider Review</h4>
                        <p className="text-sm text-muted-foreground">Licensed provider analyzes your assessment</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 border border-primary/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Treatment Options</h4>
                        <p className="text-sm text-muted-foreground">Personalized protocols after lab results</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-primary" />
                      <span>HIPAA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-primary" />
                      <span>Licensed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>24-48h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
