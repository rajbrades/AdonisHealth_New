import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { IntakeIntro } from "@/components/intake/intake-intro"

export const metadata = {
  title: "Get Started | ADONIS Health",
  description: "Start your optimization journey with a free health assessment",
}

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <IntakeIntro />
      </main>
      <Footer />
    </div>
  )
}
