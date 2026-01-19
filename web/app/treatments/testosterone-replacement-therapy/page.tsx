import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TRTHero } from "@/components/treatments/trt/trt-hero"
import { TRTBenefits } from "@/components/treatments/trt/trt-benefits"
import { TRTProtocol } from "@/components/treatments/trt/trt-protocol"
import { TRTProcess } from "@/components/treatments/trt/trt-process"
import { TRTFaq } from "@/components/treatments/trt/trt-faq"
import { TRTCta } from "@/components/treatments/trt/trt-cta"

export const metadata: Metadata = {
  title: "Testosterone Replacement Therapy (TRT) | ADONIS Health",
  description:
    "Physician-supervised testosterone replacement therapy for men. Restore peak testosterone levels, improve energy, and optimize performance with ADONIS Health.",
}

export default function TRTPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <TRTHero />
      <TRTBenefits />
      <TRTProtocol />
      <TRTProcess />
      <TRTFaq />
      <TRTCta />
      <Footer />
    </main>
  )
}
