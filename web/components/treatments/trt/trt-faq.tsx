"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Who is a candidate for TRT?",
    answer:
      "TRT is appropriate for men with clinically low testosterone levels (typically below 300 ng/dL) or who are experiencing symptoms such as fatigue, decreased libido, mood changes, or loss of muscle mass. Our physicians will review your lab results and symptoms to determine if TRT is right for you.",
  },
  {
    question: "What are the different TRT delivery methods?",
    answer:
      "We offer several FDA-approved testosterone formulations: injectable testosterone cypionate or enanthate, topical creams (daily application). Your physician will recommend the best option based on your lifestyle and preferences.",
  },
  {
    question: "Are there side effects of TRT?",
    answer:
      "Potential side effects include acne, fluid retention, increased red blood cell count, and testicular atrophy. Our ongoing monitoring protocol catches and addresses these issues early. We also prescribe ancillary medications when needed to manage side effects.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most men begin noticing improvements in energy and mood within 3-4 weeks. Sexual function and libido typically improve within 4-6 weeks. Body composition changes (increased muscle, decreased fat) generally become noticeable after 3-6 months of treatment.",
  },
  {
    question: "Will TRT affect my fertility?",
    answer:
      "TRT can suppress sperm production. If you're planning to have children, we can prescribe alternative treatments like HCG or clomiphene that maintain or enhance fertility while still optimizing testosterone levels.",
  },
  {
    question: "Is TRT covered by insurance?",
    answer:
      "Many insurance plans cover testosterone therapy when medically indicated. We provide all necessary documentation for insurance claims. For those without coverage, our transparent pricing starts at $199/month for medication and consultations. Lab work is billed separately and may be covered by your insurance.",
  },
  {
    question: "How often do I need lab work?",
    answer:
      "We typically check labs at baseline, 10-12 weeks after starting treatment, and then every 3-6 months once your levels are optimized. Lab work is billed separately and often covered by insurance. This ensures your protocol is working effectively and allows us to monitor for any potential issues.",
  },
]

export function TRTFaq() {
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
            Everything you need to know about testosterone replacement therapy.
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
