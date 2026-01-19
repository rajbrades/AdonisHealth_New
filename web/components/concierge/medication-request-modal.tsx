"use client"

import { useState } from "react"
import { X, AlertCircle, Plus, Minus, RefreshCw, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MedicationRequestModalProps {
  isOpen: boolean
  onClose: () => void
  medication?: {
    name: string
    dosage: string
    frequency: string
    route: string
  }
  patientName: string
  patientId: string
}

const requestTypes = [
  { value: "increase", label: "Increase Dosage", icon: Plus },
  { value: "decrease", label: "Decrease Dosage", icon: Minus },
  { value: "change", label: "Change Medication", icon: RefreshCw },
  { value: "discontinue", label: "Discontinue", icon: X },
  { value: "new", label: "New Medication", icon: Pill },
]

const urgencyLevels = [
  { value: "routine", label: "Routine", description: "Review within 72 hours" },
  { value: "priority", label: "Priority", description: "Review within 24 hours" },
  { value: "urgent", label: "Urgent", description: "Review within 4 hours" },
]

const commonMedications = [
  "Testosterone Cypionate",
  "Testosterone Enanthate",
  "HCG",
  "Enclomiphene",
  "Gonadorelin",
  "Anastrozole",
  "Sildenafil",
  "Tadalafil",
  "PT-141",
]

export function MedicationRequestModal({
  isOpen,
  onClose,
  medication,
  patientName,
  patientId,
}: MedicationRequestModalProps) {
  const [requestType, setRequestType] = useState("")
  const [urgency, setUrgency] = useState("routine")
  const [reason, setReason] = useState("")
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [proposedDosage, setProposedDosage] = useState("")
  const [proposedFrequency, setProposedFrequency] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false)
      onClose()
      // Reset form
      setRequestType("")
      setUrgency("routine")
      setReason("")
      setClinicalNotes("")
      setNewMedication("")
      setProposedDosage("")
      setProposedFrequency("")
    }, 2000)
  }

  const isNewMedRequest = requestType === "new"
  const showProposedDosage = ["increase", "decrease", "change", "new"].includes(requestType)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-background p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isNewMedRequest ? "Request New Medication" : "Request Medication Change"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              For patient: <span className="text-foreground">{patientName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Request Submitted</h3>
            <p className="text-muted-foreground mt-2">The provider has been notified and will review your request.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Current Medication Info (if editing existing) */}
            {medication && !isNewMedRequest && (
              <div className="bg-muted/50 p-4 border border-border">
                <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Current Medication</p>
                <p className="font-bold text-foreground">{medication.name}</p>
                <p className="text-sm text-muted-foreground">
                  {medication.dosage} • {medication.frequency} • {medication.route}
                </p>
              </div>
            )}

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Request Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {requestTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setRequestType(type.value)}
                    className={`p-3 border text-center transition-colors ${
                      requestType === type.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <type.icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* New Medication Selection (if requesting new) */}
            {isNewMedRequest && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Medication <span className="text-red-500">*</span>
                </label>
                <Select value={newMedication} onValueChange={setNewMedication}>
                  <SelectTrigger className="bg-transparent border-border">
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {commonMedications.map((med) => (
                      <SelectItem key={med} value={med}>
                        {med}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Proposed Dosage */}
            {showProposedDosage && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Proposed Dosage</label>
                  <input
                    type="text"
                    value={proposedDosage}
                    onChange={(e) => setProposedDosage(e.target.value)}
                    placeholder="e.g., 200mg"
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Proposed Frequency</label>
                  <input
                    type="text"
                    value={proposedFrequency}
                    onChange={(e) => setProposedFrequency(e.target.value)}
                    placeholder="e.g., Weekly"
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setUrgency(level.value)}
                    className={`p-3 border text-left transition-colors ${
                      urgency === level.value
                        ? level.value === "urgent"
                          ? "border-red-500 bg-red-500/10"
                          : level.value === "priority"
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        urgency === level.value
                          ? level.value === "urgent"
                            ? "text-red-500"
                            : level.value === "priority"
                              ? "text-yellow-500"
                              : "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {level.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason for Request */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for Request <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Describe why this change is being requested..."
                className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Additional Clinical Notes</label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                placeholder="Any relevant symptoms, patient feedback, lab values, etc..."
                className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 p-4">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-500">Provider Approval Required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This request will be sent to the patient&apos;s assigned provider for review and approval. The patient
                  will be notified once a decision is made.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="sticky bottom-0 bg-background p-6 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!requestType || !reason || isSubmitting}
              className="bg-primary text-background hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
