import { Header } from "@/components/landing/header"
import { IntakeWizard } from "@/components/intake/intake-wizard"

export const metadata = {
  title: "Health Assessment | ADONIS Health",
  description: "Complete your comprehensive health assessment",
}

export default function AssessmentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <IntakeWizard />
      </main>
    </div>
  )
}
