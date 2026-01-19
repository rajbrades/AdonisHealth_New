"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What's the difference between natural boosters and TRT?",
    answer:
      "Natural testosterone boosters stimulate your body's own testosterone production, while TRT directly replaces testosterone with external supplementation. Boosters preserve your natural hormone pathways and fertility, while TRT provides more predictable, stable levels but may suppress natural production.",
  },
  {
    question: "Who is a good candidate for natural boosters?",
    answer:
      "Natural boosters are ideal for men who want to preserve or improve fertility, have mild to moderate low testosterone symptoms, prefer to avoid lifelong TRT commitment, want to maintain natural hormone production, or want to try natural optimization before considering TRT.",
  },
  {
    question: "Can I use natural boosters with TRT?",
    answer:
      "Yes, many patients use HCG or Gonadorelin alongside TRT to maintain fertility and testicular function. This combination approach gives you the benefits of stable testosterone levels while preserving natural production. Your physician will design the optimal protocol for your goals.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most men begin noticing improvements in energy and mood within 4-6 weeks. Libido and sexual function typically improve within 6-8 weeks. Full optimization may take 3-4 months as your body adjusts to the natural increase in testosterone production.",
  },
  {
    question: "Are there side effects?",
    answer:
      "Natural boosters are generally well-tolerated with minimal side effects. Some men may experience mild mood changes or headaches initially. Unlike TRT, there's no concern about testicular atrophy or fertility suppression. We monitor your progress closely to ensure optimal results.",
  },
  {
    question: "Which protocol is right for me?",
    answer:
      "The best protocol depends on your goals, symptoms, and lab results. Enclomiphene is often preferred for its oral convenience and effectiveness. HCG is excellent for fertility preservation. Your physician will recommend the optimal approach based on your specific situation.",
  },
  {
    question: "How often do I need lab work?",
    answer:
      "We typically check labs at baseline, 8-12 weeks after starting treatment, and then every 3-6 months once your levels are optimized. Lab work is billed separately and often covered by insurance. This ensures your protocol is working effectively and allows us to adjust as needed.",
  },
]

export function BoostersFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="text-mono-upper text-primary mb-4">FAQ</div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            COMMON <span className="text-primary">QUESTIONS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about natural testosterone optimization.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0 border border-border">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-border last:border-b-0 ${openIndex === index ? "bg-secondary/30" : ""}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/20 transition-colors duration-200"
              >
                <span className="text-foreground font-medium pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a href="#" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
            Contact our medical team
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
