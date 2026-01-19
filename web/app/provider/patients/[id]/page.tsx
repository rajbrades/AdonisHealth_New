import { PatientOnePager } from "@/components/provider/patient-one-pager"

interface PatientOnePagerPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientOnePagerPage({ params }: PatientOnePagerPageProps) {
  const { id } = await params
  return <PatientOnePager patientId={id} />
}
