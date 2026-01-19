"use client"

import { AlertCircle, Shield, Heart, Users } from "lucide-react"

const reasons = [
  "Difficulty achieving or maintaining erections",
  "Reduced sexual desire or libido",
  "Performance anxiety",
  "Age-related changes in sexual function",
  "Stress or relationship factors",
  "Side effects from other medications",
  "Desire for enhanced sexual experience",
  "Low testosterone affecting sexual health",
]

const features = [
  {
    icon: Shield,
    title: "Safe & Effective",
    description:
      "All medications are FDA-approved (or use FDA-approved compounds) and prescribed by licensed US physicians. We monitor your treatment for safety and efficacy.",
  },
  {
    icon: Heart,
    title: "100% Confidential",
    description:
      "Your privacy is our priority. Discreet shipping, confidential consultations, and secure medical records protected by HIPAA compliance.",
  },
  {
    icon: Users,
    title: "Personalized Care",
    description:
      "Your treatment is customized to your needs, lifestyle, and preferences. We can adjust medications and dosing to optimize your results.",
  },
]

export function SexualWellnessCandidates() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Candidates</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            IS THIS <span className="text-primary">RIGHT FOR YOU</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Sexual wellness treatments can help men experiencing erectile dysfunction, low libido, or performance
            concerns regain confidence and intimacy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Reasons */}
          <div className="border border-border p-8 md:p-10">
            <h3 className="text-xl font-bold text-foreground mb-6">Common Reasons Men Seek Treatment:</h3>
            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="border border-border p-6 md:p-8 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 border border-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
