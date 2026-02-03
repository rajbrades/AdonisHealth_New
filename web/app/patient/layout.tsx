import type React from "react"
import type { Metadata } from "next"
import { PatientSidebar } from "@/components/patient/patient-sidebar"
import { PatientHeader } from "@/components/patient/patient-header"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Patient Portal | ADONIS",
  description: "Your personal health optimization dashboard",
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}>
      <div className="min-h-screen bg-background flex">
        <PatientSidebar />
        <div className="flex-1 flex flex-col">
          <PatientHeader />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
