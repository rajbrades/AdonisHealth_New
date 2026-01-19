import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SexualWellnessHero } from "@/components/treatments/sexual-wellness/sexual-wellness-hero"
import { SexualWellnessBenefits } from "@/components/treatments/sexual-wellness/sexual-wellness-benefits"
import { SexualWellnessOptions } from "@/components/treatments/sexual-wellness/sexual-wellness-options"
import { SexualWellnessProcess } from "@/components/treatments/sexual-wellness/sexual-wellness-process"
import { SexualWellnessCandidates } from "@/components/treatments/sexual-wellness/sexual-wellness-candidates"
import { SexualWellnessCta } from "@/components/treatments/sexual-wellness/sexual-wellness-cta"

export const metadata: Metadata = {
  title: "Sexual Wellness | ADONIS Health",
  description:
    "Comprehensive sexual wellness solutions for men. FDA-approved ED treatments, PT-141, and personalized protocols to restore confidence and performance.",
}

export default function SexualWellnessPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <SexualWellnessHero />
      <SexualWellnessBenefits />
      <SexualWellnessOptions />
      <SexualWellnessProcess />
      <SexualWellnessCandidates />
      <SexualWellnessCta />
      <Footer />
    </main>
  )
}
