import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { BoostersHero } from "@/components/treatments/boosters/boosters-hero"
import { BoostersBenefits } from "@/components/treatments/boosters/boosters-benefits"
import { BoostersProtocol } from "@/components/treatments/boosters/boosters-protocol"
import { BoostersProcess } from "@/components/treatments/boosters/boosters-process"
import { BoostersFaq } from "@/components/treatments/boosters/boosters-faq"
import { BoostersCta } from "@/components/treatments/boosters/boosters-cta"

export const metadata: Metadata = {
  title: "Natural Testosterone Boosters | ADONIS Health",
  description:
    "Boost your testosterone naturally while preserving fertility. Physician-supervised protocols using Enclomiphene, HCG, Kisspeptin, and Gonadorelin.",
}

export default function BoostersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <BoostersHero />
      <BoostersBenefits />
      <BoostersProtocol />
      <BoostersProcess />
      <BoostersFaq />
      <BoostersCta />
      <Footer />
    </main>
  )
}
