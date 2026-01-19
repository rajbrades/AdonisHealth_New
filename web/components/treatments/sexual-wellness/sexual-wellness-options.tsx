"use client"

import { useState } from "react"
import { Zap, Heart, Flame, TrendingUp, Sparkles, CheckCircle, Clock, Users } from "lucide-react"

const treatments = [
  {
    id: "sildenafil",
    icon: Zap,
    name: "Sildenafil (Generic Viagra®)",
    description:
      "The original PDE5 inhibitor with proven efficacy. Fast-acting with 4-6 hour duration, perfect for planned intimacy.",
    dosing: "25-100mg as needed, 30-60 minutes before activity",
    duration: "4-6 hours",
    idealFor: "Men wanting fast, predictable results",
    benefits: [
      "Fast-acting (30-60 minutes)",
      "Highly effective",
      "Proven track record",
      "Predictable duration",
      "Well-studied safety profile",
    ],
  },
  {
    id: "tadalafil",
    icon: Heart,
    name: "Tadalafil (Generic Cialis®)",
    description:
      'Long-acting PDE5 inhibitor that improves blood flow for strong, reliable erections. The "weekend pill" with effects lasting up to 36 hours.',
    dosing: "On-demand: 5-20mg as needed | Daily: 2.5mg daily to accompany TRT or general vascular health",
    duration: "Up to 36 hours",
    idealFor: "Men wanting long-lasting effects and spontaneity",
    benefits: [
      "Lasts up to 36 hours",
      "Daily or on-demand dosing",
      "Quick onset (30-60 minutes)",
      "Enables spontaneity",
      "Well-tolerated",
    ],
  },
  {
    id: "pt141",
    icon: Flame,
    name: "PT-141 (Bremelanotide)",
    description:
      "Revolutionary peptide that works on the brain to increase sexual desire and arousal. Unlike PDE5 inhibitors, PT-141 enhances libido at the neurological level.",
    dosing: "Customized dosing protocol",
    duration: "Effects last several hours",
    idealFor: "Men with low libido or desire-related concerns",
    benefits: [
      "Increases sexual desire naturally",
      "Works on brain chemistry",
      "Effective for low libido",
      "Helps both men and women",
      "Non-vascular mechanism",
    ],
  },
  {
    id: "tadalafil-apomorphine",
    icon: TrendingUp,
    name: "Tadalafil + Apomorphine",
    description:
      "Advanced combination therapy pairing Tadalafil's physical benefits with Apomorphine's central nervous system effects for enhanced desire and arousal.",
    dosing: "Customized compounded formulation (sublingual troches)",
    duration: "Up to 36 hours",
    idealFor: "Men with both physical and desire/arousal concerns",
    benefits: [
      "Dual mechanism of action",
      "Enhanced libido and desire",
      "Improved erectile function",
      "Faster onset",
      "Stronger effects",
    ],
  },
  {
    id: "tadalafil-oxytocin",
    icon: Sparkles,
    name: "Tadalafil + Oxytocin",
    description:
      "Combines the physical benefits of Tadalafil with Oxytocin's enhancement of emotional connection, bonding, and pleasure.",
    dosing: "Customized compounded formulation (troches or nasal spray)",
    duration: "Up to 36 hours (Tadalafil component)",
    idealFor: "Men seeking enhanced intimacy and emotional connection",
    benefits: [
      "Enhanced erectile function",
      "Increased emotional connection",
      "Heightened pleasure and sensation",
      "Improved orgasm quality",
      "Synergistic effects",
    ],
  },
]

const comparisonData = [
  { treatment: "Tadalafil", onset: "30-60 min", duration: "Up to 36 hours", bestFor: "Spontaneity" },
  { treatment: "Tadalafil + Oxytocin", onset: "30-60 min", duration: "Up to 36 hours", bestFor: "Enhanced intimacy" },
  { treatment: "Sildenafil", onset: "30-60 min", duration: "4-6 hours", bestFor: "Planned intimacy" },
  { treatment: "Tadalafil + Apomorphine", onset: "15-30 min", duration: "Up to 36 hours", bestFor: "ED + low desire" },
  { treatment: "PT-141", onset: "45-90 min", duration: "Several hours", bestFor: "Low libido" },
]

export function SexualWellnessOptions() {
  const [activeTreatment, setActiveTreatment] = useState(treatments[0])

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Treatments</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            TREATMENT <span className="text-primary">OPTIONS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose from proven medications and advanced combination therapies tailored to your needs
          </p>
        </div>

        {/* Treatment Tabs - matching boosters protocol pattern */}
        <div className="flex flex-wrap gap-2 mb-12">
          {treatments.map((treatment) => (
            <button
              key={treatment.id}
              onClick={() => setActiveTreatment(treatment)}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wider border transition-all duration-300 ${
                activeTreatment.id === treatment.id
                  ? "bg-primary text-background border-primary"
                  : "bg-transparent text-foreground border-border hover:border-primary"
              }`}
            >
              {treatment.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Active Treatment Details - matching boosters protocol pattern */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Treatment Info */}
          <div className="border border-border p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 border border-primary flex items-center justify-center flex-shrink-0">
                <activeTreatment.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{activeTreatment.name}</h3>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">{activeTreatment.description}</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 text-mono-upper text-muted-foreground text-xs mb-2">
                  <Clock className="w-4 h-4" />
                  Dosing Protocol
                </div>
                <p className="text-foreground text-sm">{activeTreatment.dosing}</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 text-mono-upper text-muted-foreground text-xs mb-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <p className="text-foreground text-sm">{activeTreatment.duration}</p>
              </div>
            </div>

            <div className="mt-6 border-l-2 border-primary pl-4">
              <div className="flex items-center gap-2 text-mono-upper text-muted-foreground text-xs mb-2">
                <Users className="w-4 h-4" />
                Ideal For
              </div>
              <p className="text-foreground text-sm">{activeTreatment.idealFor}</p>
            </div>
          </div>

          {/* Right - Benefits */}
          <div className="border border-border p-8 md:p-10">
            <div className="text-mono-upper text-primary mb-6">Key Benefits</div>
            <div className="space-y-4">
              {activeTreatment.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Comparison Table */}
        <div className="mt-24">
          <div className="mb-12">
            <div className="text-mono-upper text-primary mb-4">Comparison</div>
            <h3 className="text-display text-3xl sm:text-4xl mb-4">
              QUICK <span className="text-primary">COMPARISON</span>
            </h3>
            <p className="text-muted-foreground">Find the right treatment for your needs</p>
          </div>

          <div className="border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    Treatment
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    Onset Time
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="p-4 text-primary font-medium">{row.treatment}</td>
                    <td className="p-4 text-foreground">{row.onset}</td>
                    <td className="p-4 text-foreground">{row.duration}</td>
                    <td className="p-4 text-foreground">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
