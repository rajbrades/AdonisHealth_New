"use client"

import { useState } from "react"
import { Zap, Heart, TrendingUp, Clock, Users, CheckCircle, Sparkles } from "lucide-react"

const protocols = [
  {
    id: "enclomiphene",
    name: "Enclomiphene Citrate",
    icon: Zap,
    description:
      "Selective estrogen receptor modulator that signals the body to produce more testosterone naturally. The gold standard for natural optimization.",
    dosing: "Typically 12.5-25mg daily",
    idealFor: "Men wanting to optimize testosterone while maintaining fertility",
    benefits: [
      "Increases natural testosterone production",
      "Preserves fertility",
      "Oral medication (no injections)",
      "Minimal side effects",
      "Maintains testicular function",
    ],
  },
  {
    id: "hcg",
    name: "HCG (Human Chorionic Gonadotropin)",
    icon: Heart,
    description:
      "Mimics LH hormone to directly stimulate testosterone production in the testes. Excellent for fertility preservation and natural production.",
    dosing: "Typically 500-1000 IU 2-3x per week (subcutaneous injection)",
    idealFor: "Men on TRT wanting fertility preservation or standalone optimization",
    benefits: [
      "Stimulates natural testosterone",
      "Preserves testicular size and function",
      "Maintains sperm production",
      "Can be used with TRT",
      "Supports fertility goals",
    ],
  },
  {
    id: "gonadorelin",
    name: "Gonadorelin",
    icon: TrendingUp,
    description:
      "Synthetic GnRH that signals the pituitary to release LH and FSH, promoting natural testosterone production.",
    dosing: "Varies by protocol (subcutaneous injection)",
    idealFor: "Hormone axis restoration and fertility preservation",
    benefits: [
      "Restores natural hormone axis",
      "Supports testosterone production",
      "Prevents testicular atrophy",
      "Works synergistically with other treatments",
    ],
  },
]

export function BoostersProtocol() {
  const [activeProtocol, setActiveProtocol] = useState(protocols[0])

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="text-mono-upper text-primary mb-4">Protocols</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            OPTIMIZATION <span className="text-primary">OPTIONS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose from our advanced testosterone-boosting therapies, each designed to work with your body's natural
            systems.
          </p>
        </div>

        {/* Protocol Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setActiveProtocol(protocol)}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wider border transition-all duration-300 ${
                activeProtocol.id === protocol.id
                  ? "bg-primary text-background border-primary"
                  : "bg-transparent text-foreground border-border hover:border-primary"
              }`}
            >
              {protocol.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Active Protocol Details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Protocol Info */}
          <div className="border border-border p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 border border-primary flex items-center justify-center flex-shrink-0">
                <activeProtocol.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{activeProtocol.name}</h3>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">{activeProtocol.description}</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 text-mono-upper text-muted-foreground text-xs mb-2">
                  <Clock className="w-4 h-4" />
                  Dosing Protocol
                </div>
                <p className="text-foreground text-sm">{activeProtocol.dosing}</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 text-mono-upper text-muted-foreground text-xs mb-2">
                  <Users className="w-4 h-4" />
                  Ideal For
                </div>
                <p className="text-foreground text-sm">{activeProtocol.idealFor}</p>
              </div>
            </div>
          </div>

          {/* Right - Benefits */}
          <div className="border border-border p-8 md:p-10">
            <div className="text-mono-upper text-primary mb-6">Key Benefits</div>
            <div className="space-y-4">
              {activeProtocol.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Combination Note */}
        <div className="mt-12 border border-primary bg-primary/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-2">Combination Therapy Available</h4>
              <p className="text-muted-foreground">
                Many patients use HCG or Gonadorelin alongside TRT to maintain fertility and testicular function. Your
                physician will help design the optimal protocol for your specific goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
