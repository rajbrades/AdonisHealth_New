"use client"

import type React from "react"

import { useState } from "react"
import { Plus, MoreHorizontal, Edit, Pause, FileText, Pill, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MedicationRequestModal } from "./medication-request-modal"

interface Medication {
  name: string
  dosage: string
  frequency: string
  route: string
  status: string
  startDate: string
  type?: "medication" | "supplement"
}

interface MedicationsListProps {
  medications: Medication[]
  patientName?: string
  patientId?: string
}

export function MedicationsList({ medications, patientName = "Patient", patientId = "1" }: MedicationsListProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [isNewRequest, setIsNewRequest] = useState(false)

  const prescribedMeds = medications.filter(
    (m) =>
      !["Vitamin D3", "Fish Oil", "Magnesium", "Zinc", "B-Complex", "Omega-3"].some((supp) =>
        m.name.toLowerCase().includes(supp.toLowerCase()),
      ),
  )
  const supplements = medications.filter((m) =>
    ["Vitamin D3", "Fish Oil", "Magnesium", "Zinc", "B-Complex", "Omega-3"].some((supp) =>
      m.name.toLowerCase().includes(supp.toLowerCase()),
    ),
  )

  const handleRequestChange = (med: Medication) => {
    setSelectedMedication(med)
    setIsNewRequest(false)
    setIsRequestModalOpen(true)
  }

  const handleNewMedicationRequest = () => {
    setSelectedMedication(null)
    setIsNewRequest(true)
    setIsRequestModalOpen(true)
  }

  const renderMedicationTable = (meds: Medication[], title: string, icon: React.ReactNode, showAddButton = true) => (
    <div className="border border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{meds.filter((m) => m.status === "Active").length} active</p>
          </div>
        </div>
        {showAddButton && (
          <Button onClick={handleNewMedicationRequest} className="gap-2 bg-primary text-background hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Request New
          </Button>
        )}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
        <div className="col-span-2">Name</div>
        <div>Dosage</div>
        <div>Frequency</div>
        <div>Route</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      {meds.length > 0 ? (
        <div className="divide-y divide-border">
          {meds.map((med) => (
            <div key={med.name} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
              <div className="col-span-2">
                <p className="font-medium text-foreground">{med.name}</p>
                <p className="text-sm text-muted-foreground">Started: {med.startDate}</p>
              </div>
              <div>
                <span className="text-foreground">{med.dosage}</span>
              </div>
              <div>
                <span className="text-foreground">{med.frequency}</span>
              </div>
              <div>
                <span className="text-foreground">{med.route}</span>
              </div>
              <div className="text-right flex items-center justify-end gap-2">
                <span
                  className={`text-xs font-mono uppercase px-2 py-1 ${
                    med.status === "Active"
                      ? "text-green-500 bg-green-500/10"
                      : med.status === "PRN"
                        ? "text-yellow-500 bg-yellow-500/10"
                        : "text-muted-foreground bg-muted"
                  }`}
                >
                  {med.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleRequestChange(med)}
                    >
                      <FileText className="w-4 h-4" /> Request Change
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Edit className="w-4 h-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Pause className="w-4 h-4" /> View History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No {title.toLowerCase()} on record</div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Prescribed Medications */}
      {renderMedicationTable(
        prescribedMeds,
        "Prescribed Medications",
        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
          <Pill className="w-5 h-5 text-primary" />
        </div>,
      )}

      {/* Supplements */}
      {renderMedicationTable(
        supplements,
        "Supplements",
        <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-green-500" />
        </div>,
        false,
      )}

      {/* Medication Request Modal */}
      <MedicationRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        medication={
          selectedMedication
            ? {
                name: selectedMedication.name,
                dosage: selectedMedication.dosage,
                frequency: selectedMedication.frequency,
                route: selectedMedication.route,
              }
            : undefined
        }
        patientName={patientName}
        patientId={patientId}
      />
    </div>
  )
}
