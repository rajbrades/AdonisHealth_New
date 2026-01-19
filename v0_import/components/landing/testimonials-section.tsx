"use client"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "James Richardson",
      role: "CEO, Tech Startup",
      content:
        "ADONIS transformed my energy levels and mental clarity. The AI caught patterns my regular doctor never would have seen.",
      metric: "380 → 820",
      unit: "ng/dL",
    },
    {
      name: "Michael Torres",
      role: "Managing Partner, PE",
      content:
        "The AI insights caught a thyroid issue my regular doctor missed. Lab work at my office, consultations between meetings.",
      metric: "+47%",
      unit: "Energy",
    },
    {
      name: "David Park",
      role: "VP Sales, Fortune 500",
      content:
        "Better care than any in-person clinic. The real-time dashboard alone is worth it for tracking progress.",
      metric: "4.9/5",
      unit: "Rating",
    },
  ]

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="pb-8 sm:pb-12 border-b border-border">
          <span className="text-mono-upper text-primary text-sm">Success Stories</span>
          <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mt-4">
            TRUSTED BY
            <br />
            <span className="text-primary">HIGH-PERFORMERS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mt-px">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-background p-6 sm:p-8 flex flex-col">
              {/* Metric highlight */}
              <div className="border-2 border-primary p-4 sm:p-6 mb-6 sm:mb-8">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                  {testimonial.metric}
                </p>
                <p className="text-mono-upper text-primary mt-2 text-xs sm:text-sm">{testimonial.unit}</p>
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-6 sm:mb-8 flex-1">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="pt-4 sm:pt-6 border-t border-border">
                <p className="font-bold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-mono-upper text-muted-foreground mt-1 text-xs sm:text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
