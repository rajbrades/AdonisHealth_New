import { ProviderHeader } from "@/components/provider/provider-header"
import { MedicationRequests } from "@/components/provider/medication-requests"

export default function MedicationRequestsPage() {
  return (
    <>
      <ProviderHeader />
      <main className="p-6">
        <MedicationRequests />
      </main>
    </>
  )
}
