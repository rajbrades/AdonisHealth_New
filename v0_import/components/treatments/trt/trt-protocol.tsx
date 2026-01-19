import { Clock, TrendingUp, Droplet } from "lucide-react"

const esters = [
  {
    name: "Testosterone Cypionate",
    description: "Long-acting ester with steady release. Most popular choice for consistent levels.",
    halfLife: "8-10 days",
    frequency: "Typically injected 1-2x per week",
  },
  {
    name: "Testosterone Enanthate",
    description: "Similar to Cypionate with slightly faster release profile. Excellent for stable levels.",
    halfLife: "7-9 days",
    frequency: "Typically injected 1-2x per week",
  },
]

const carrierOils = [
  {
    name: "MCT Oil",
    description: "Medium-chain triglyceride oil - thin consistency, easy injection, minimal PIP (post-injection pain)",
    benefits: ["Fast absorption", "Smooth injections", "Well-tolerated", "Most popular choice"],
    popular: true,
  },
  {
    name: "Grapeseed Oil",
    description: "Light carrier oil with good absorption and minimal discomfort",
    benefits: ["Thin consistency", "Cost-effective", "Proven track record", "Hypoallergenic"],
    popular: false,
  },
]

export function TRTProtocol() {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tight mb-4">
            Choose Your <span className="text-primary">Protocol</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto">
            Both cypionate and enanthate provide excellent, stable testosterone levels. Your physician will help
            determine the best option for your goals.
          </p>
        </div>

        {/* Testosterone Esters */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          {esters.map((ester) => (
            <div key={ester.name} className="border border-border p-6 md:p-8 hover:border-primary/50 transition-colors">
              {/* Icon */}
              <div className="w-12 h-12 border border-primary bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{ester.name}</h3>
              <p className="text-muted-foreground mb-6">{ester.description}</p>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Half-life:</span>
                  <span className="text-foreground font-semibold">{ester.halfLife}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{ester.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Carrier Oils */}
        <div className="border border-border p-6 md:p-8">
          {/* Carrier Oils Header */}
          <div className="flex items-center gap-3 mb-2">
            <Droplet className="w-6 h-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Premium Carrier Oils</h3>
          </div>
          <p className="text-muted-foreground mb-8">
            We offer pharmaceutical-grade carrier oil options for optimal comfort and absorption.
          </p>

          {/* Carrier Oil Options */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {carrierOils.map((oil) => (
              <div key={oil.name} className="bg-background/50 border border-border/50 p-5 md:p-6">
                <h4 className="text-lg font-bold text-primary mb-2">{oil.name}</h4>
                <p className="text-muted-foreground text-sm mb-4">{oil.description}</p>
                <ul className="space-y-2">
                  {oil.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
