"use client"

import { Brain, Activity, Shield, Users, LineChart, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Clinical Analysis",
      description: "Machine learning algorithms analyze biomarkers against optimal performance ranges.",
      index: "01",
    },
    {
      icon: Activity,
      title: "Live Biomarker Tracking",
      description: "Monitor hormone levels, energy scores, and wellness metrics in real-time.",
      index: "02",
    },
    {
      icon: Shield,
      title: "Physician Oversight",
      description: "Board-certified physicians review every protocol and provide guidance.",
      index: "03",
    },
    {
      icon: Users,
      title: "Concierge Support",
      description: "Dedicated health coordinators for scheduling and ongoing support.",
      index: "04",
    },
    {
      icon: LineChart,
      title: "Predictive Insights",
      description: "Proactive recommendations based on trending data patterns.",
      index: "05",
    },
    {
      icon: Clock,
      title: "Executive Scheduling",
      description: "Flexible appointments. Lab work at your office or home.",
      index: "06",
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="pb-12 border-b border-border">
          <span className="text-mono-upper text-primary">Platform Features</span>
          <h2 className="text-display text-5xl md:text-6xl lg:text-7xl text-foreground mt-4">
            ENGINEERED FOR
            <br />
            <span className="text-primary">PERFORMANCE</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border mt-px">
          {features.map((feature, i) => (
            <div key={i} className="bg-background p-8 group hover:bg-secondary transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                  <feature.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-mono-upper text-muted-foreground">{feature.index}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
