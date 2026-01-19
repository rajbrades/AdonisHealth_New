import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { OptimizationSection } from "@/components/landing/optimization-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { BiomarkerSection } from "@/components/landing/biomarker-section"
import { ProcessSection } from "@/components/landing/process-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <OptimizationSection />
      <FeaturesSection />
      <BiomarkerSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
