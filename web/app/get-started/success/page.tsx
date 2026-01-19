import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { IntakeSuccess } from "@/components/intake/intake-success"

export const metadata = {
  title: "Assessment Complete | ADONIS Health",
  description: "Thank you for completing your health assessment",
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <IntakeSuccess />
      </main>
      <Footer />
    </div>
  )
}
