import { PatientSnapshot } from "@/components/dashboard/patient-snapshot"
import { MacroBoard } from "@/components/dashboard/macro-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPatient } from "@/lib/api"

export default async function EncounterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const patient = await getPatient(id);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/provider">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Encounter: {patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...'}</h1>
                    <p className="text-sm text-muted-foreground">
                        {patient ?
                            `DOB: ${new Date(patient.dob).toLocaleDateString()} • ${patient.gender} • ${new Date().getFullYear() - new Date(patient.dob).getFullYear()}yo`
                            : '...'}
                    </p>
                </div>
            </div>

            <PatientSnapshot patient={patient} />

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">Clinical Note (SOAP)</h2>
                <MacroBoard />
            </div>
        </div>
    )
}
