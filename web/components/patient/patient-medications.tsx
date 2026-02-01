"use client"

import { useState } from "react"
import { Syringe, AlertCircle, Clock, Package, ChevronDown, ChevronUp, CheckCircle2, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Medication {
  name: string
  dose: string
  route: string
  frequency: string
  purpose: string
  status: "active" | "discontinued"
  startDate: string
  endDate?: string
  refillsRemaining?: number
  lastTaken?: string
  adherenceRate?: number
  sideEffects?: string[]
  instructions?: string[]
}

const mockMedications: Medication[] = [
  {
    name: "Testosterone Cypionate",
    dose: "150mg",
    route: "IM",
    frequency: "Weekly",
    purpose: "Testosterone replacement therapy for hypogonadism",
    status: "active",
    startDate: "2025-10-15",
    refillsRemaining: 3,
    lastTaken: "2 days ago",
    adherenceRate: 95,
    sideEffects: ["Mild injection site soreness", "Increased energy"],
    instructions: [
      "Inject into thigh or gluteal muscle",
      "Rotate injection sites",
      "Store at room temperature",
      "Do not share needles"
    ]
  },
  {
    name: "HCG",
    dose: "500 IU",
    route: "SQ",
    frequency: "2x/week",
    purpose: "Prevent testicular atrophy and maintain fertility",
    status: "active",
    startDate: "2025-10-15",
    refillsRemaining: 5,
    lastTaken: "Yesterday",
    adherenceRate: 92,
    instructions: [
      "Inject subcutaneously into abdomen",
      "Refrigerate after reconstitution",
      "Use within 30 days of mixing"
    ]
  },
  {
    name: "Anastrozole",
    dose: "0.5mg",
    route: "PO",
    frequency: "2x/week",
    purpose: "Estrogen management",
    status: "active",
    startDate: "2025-11-01",
    refillsRemaining: 2,
    lastTaken: "3 hours ago",
    adherenceRate: 98,
    instructions: [
      "Take with or without food",
      "Take at the same time as testosterone injection",
      "Do not double dose if missed"
    ]
  },
  {
    name: "Clomiphene Citrate",
    dose: "25mg",
    route: "PO",
    frequency: "Daily",
    purpose: "Testosterone boost",
    status: "discontinued",
    startDate: "2025-06-01",
    endDate: "2025-10-10",
  }
]

export function PatientMedications() {
  const [expandedMeds, setExpandedMeds] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("current")
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<string>("")
  const [patientNote, setPatientNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleExpanded = (medName: string) => {
    const newExpanded = new Set(expandedMeds)
    if (newExpanded.has(medName)) {
      newExpanded.delete(medName)
    } else {
      newExpanded.add(medName)
    }
    setExpandedMeds(newExpanded)
  }

  const openNoteModal = (medName: string) => {
    setSelectedMedication(medName)
    setPatientNote("")
    setNoteModalOpen(true)
  }

  const submitNote = async () => {
    if (!patientNote.trim()) return
    
    setIsSubmitting(true)
    console.log("[v0] Submitting medication note:", {
      medication: selectedMedication,
      note: patientNote,
      timestamp: new Date().toISOString()
    })
    
    // TODO: API call to save note and notify concierge/provider
    // await fetch('/api/medications/notes', { method: 'POST', body: JSON.stringify({ ... }) })
    
    setTimeout(() => {
      setIsSubmitting(false)
      setNoteModalOpen(false)
      setPatientNote("")
      // Show success message
    }, 1000)
  }

  const activeMedications = mockMedications.filter(m => m.status === "active")
  const discontinuedMedications = mockMedications.filter(m => m.status === "discontinued")

  const renderMedicationCard = (med: Medication) => {
    const isExpanded = expandedMeds.has(med.name)
    const needsRefill = med.refillsRemaining && med.refillsRemaining <= 3

    return (
      <div key={med.name} className="border border-border bg-card">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-foreground">{med.name}</h3>
                {med.status === "active" && (
                  <span className="text-xs font-mono uppercase px-2 py-0.5 bg-green-500/10 text-green-500">
                    ACTIVE
                  </span>
                )}
                {needsRefill && (
                  <span className="text-xs font-mono uppercase px-2 py-0.5 bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> LOW
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{med.purpose}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleExpanded(med.name)}
              className="ml-2"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Dosing Info */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-mono-upper text-muted-foreground mb-1">DOSE</p>
              <p className="font-medium text-foreground">{med.dose}</p>
            </div>
            <div>
              <p className="text-xs text-mono-upper text-muted-foreground mb-1">ROUTE</p>
              <p className="font-medium text-foreground">{med.route}</p>
            </div>
            <div>
              <p className="text-xs text-mono-upper text-muted-foreground mb-1">FREQUENCY</p>
              <p className="font-medium text-foreground">{med.frequency}</p>
            </div>
          </div>

          {/* Adherence & Last Taken - Active Only */}
          {med.status === "active" && med.adherenceRate && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-mono-upper text-muted-foreground">ADHERENCE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F4D683] to-[#D4A854]" 
                      style={{ width: `${med.adherenceRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">{med.adherenceRate}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-mono-upper text-muted-foreground">LAST TAKEN</span>
                </div>
                <p className="text-sm text-foreground">{med.lastTaken}</p>
              </div>
            </div>
          )}

          {/* Refill Status - Active Only */}
          {med.status === "active" && med.refillsRemaining !== undefined && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {med.refillsRemaining} refill{med.refillsRemaining !== 1 ? 's' : ''} remaining
                  </span>
                </div>
                {needsRefill && (
                  <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
                    Request Refill
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Expanded Section */}
          {isExpanded && (
            <div className="pt-4 border-t border-border space-y-4">
              {/* Instructions */}
              {med.instructions && (
                <div>
                  <p className="text-xs text-mono-upper text-muted-foreground mb-2">HOW TO TAKE</p>
                  <ul className="space-y-1">
                    {med.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Side Effects */}
              {med.sideEffects && med.sideEffects.length > 0 && (
                <div>
                  <p className="text-xs text-mono-upper text-muted-foreground mb-2">REPORTED EFFECTS</p>
                  <div className="space-y-1">
                    {med.sideEffects.map((effect, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">{effect}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-mono-upper text-muted-foreground mb-1">START DATE</p>
                  <p className="text-sm text-foreground">{new Date(med.startDate).toLocaleDateString()}</p>
                </div>
                {med.endDate && (
                  <div>
                    <p className="text-xs text-mono-upper text-muted-foreground mb-1">END DATE</p>
                    <p className="text-sm text-foreground">{new Date(med.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {med.status === "active" && (
                <div className="pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full bg-transparent"
                    onClick={() => openNoteModal(med.name)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Question / Report Issue
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Syringe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medications</h1>
            <p className="text-sm text-muted-foreground">
              {activeMedications.length} active medication{activeMedications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b border-border w-full justify-start bg-transparent p-0">
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Current ({activeMedications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="historical"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Historical ({discontinuedMedications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4 mt-6">
            {activeMedications.map(med => renderMedicationCard(med))}
          </TabsContent>

          <TabsContent value="historical" className="space-y-4 mt-6">
            {discontinuedMedications.map(med => renderMedicationCard(med))}
            {discontinuedMedications.length === 0 && (
              <div className="border border-border p-8 text-center">
                <p className="text-muted-foreground">No discontinued medications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Medication Note/Question Modal */}
        <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
          <DialogContent className="border border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Medication Question or Concern</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your note about <span className="font-semibold text-foreground">{selectedMedication}</span> will be sent to your wellness concierge and provider.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="patient-note" className="text-mono-upper text-xs text-muted-foreground mb-2 block">
                  YOUR NOTE
                </Label>
                <Textarea
                  id="patient-note"
                  placeholder="Example: I've noticed since taking this that I have bumps on my arm..."
                  value={patientNote}
                  onChange={(e) => setPatientNote(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="bg-muted/30 p-3 border border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> Your concierge will review this within 24 hours and coordinate with your provider if needed. For urgent concerns, please call our support line.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setNoteModalOpen(false)}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitNote}
                disabled={!patientNote.trim() || isSubmitting}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Note"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
