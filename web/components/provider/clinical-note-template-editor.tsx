"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, FileText, Plus, Trash2, Sparkles, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFormulary } from "@/lib/formulary"

interface ClinicalNoteTemplateEditorProps {
  consultationId: string
  patientId: string
}

interface MedicationEntry {
  id: string
  name: string
  dose: string
  route: string
  frequency: string
  instructions: string
}

const ROUTES = [
  { value: "PO", label: "By mouth (PO)" },
  { value: "IM", label: "Intramuscular (IM)" },
  { value: "SQ", label: "Subcutaneous (SQ)" },
  { value: "Transdermal", label: "Transdermal" },
  { value: "Topical", label: "Topical" },
  { value: "Inhaled", label: "Inhaled" },
]

const FREQUENCIES = [
  { value: "qAM", label: "Every morning (qAM)" },
  { value: "qPM", label: "Every evening (qPM)" },
  { value: "qD", label: "Daily (qD)" },
  { value: "BID", label: "Twice daily (BID)" },
  { value: "TID", label: "Three times daily (TID)" },
  { value: "QID", label: "Four times daily (QID)" },
  { value: "qW", label: "Weekly (qW)" },
  { value: "BIW", label: "Twice weekly (BIW)" },
  { value: "TIW", label: "Three times weekly (TIW)" },
  { value: "q2W", label: "Every 2 weeks (q2W)" },
  { value: "Monthly", label: "Monthly" },
  { value: "PRN", label: "As needed (PRN)" },
]

export function ClinicalNoteTemplateEditor({ consultationId, patientId }: ClinicalNoteTemplateEditorProps) {
  // Section toggles
  const [includeChiefComplaint, setIncludeChiefComplaint] = useState(true)
  const [includeLabReview, setIncludeLabReview] = useState(true)
  const [includeLifestyleReview, setIncludeLifestyleReview] = useState(true)
  const [includeMedicationReview, setIncludeMedicationReview] = useState(true)
  const [includeMedicationChanges, setIncludeMedicationChanges] = useState(false)
  const [includeSupplementReview, setIncludeSupplementReview] = useState(true)
  const [includeAssessment, setIncludeAssessment] = useState(true)
  const [includePlan, setIncludePlan] = useState(true)

  // Content fields
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [labReviewNotes, setLabReviewNotes] = useState("")
  const [lifestyleNotes, setLifestyleNotes] = useState("")
  const [assessmentText, setAssessmentText] = useState("")
  const [planText, setPlanText] = useState("")
  
  // Medication changes
  const [medicationChanges, setMedicationChanges] = useState<MedicationEntry[]>([])
  const [supplementChanges, setSupplementChanges] = useState<MedicationEntry[]>([])

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const formulary = getFormulary()

  const addMedication = () => {
    setMedicationChanges([
      ...medicationChanges,
      { id: Date.now().toString(), name: "", dose: "", route: "IM", frequency: "qW", instructions: "" },
    ])
  }

  const addSupplement = () => {
    setSupplementChanges([
      ...supplementChanges,
      { id: Date.now().toString(), name: "", dose: "", route: "PO", frequency: "qD", instructions: "" },
    ])
  }

  const removeMedication = (id: string) => {
    setMedicationChanges(medicationChanges.filter((m) => m.id !== id))
  }

  const removeSupplement = (id: string) => {
    setSupplementChanges(supplementChanges.filter((s) => s.id !== id))
  }

  const updateMedication = (id: string, field: keyof MedicationEntry, value: string) => {
    setMedicationChanges(medicationChanges.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const updateSupplement = (id: string, field: keyof MedicationEntry, value: string) => {
    setSupplementChanges(supplementChanges.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const selectMedicationFromFormulary = (id: string, medicationName: string) => {
    const med = formulary.medications.find((m) => m.name === medicationName)
    if (med) {
      setMedicationChanges(medicationChanges.map((m) => 
        m.id === id 
          ? { 
              ...m, 
              name: med.name,
              dose: med.standardDosing,
              route: "IM",
              frequency: med.frequency,
              instructions: med.instructions
            } 
          : m
      ))
    }
  }

  const selectSupplementFromFormulary = (id: string, supplementName: string) => {
    const supp = formulary.supplements.find((s) => s.name === supplementName)
    if (supp) {
      setSupplementChanges(supplementChanges.map((s) => 
        s.id === id 
          ? { 
              ...s, 
              name: supp.name,
              dose: supp.standardDosing,
              route: "PO",
              frequency: supp.frequency,
              instructions: supp.instructions
            } 
          : s
      ))
    }
  }

  const generateAISuggestions = async () => {
    setIsGeneratingAI(true)
    try {
      const response = await fetch("/api/consultations/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId, patientId }),
      })
      const data = await response.json()
      
      // AI enables relevant sections and pre-fills content
      if (data.suggestions) {
        setIncludeLabReview(data.suggestions.includeLabReview)
        setIncludeLifestyleReview(data.suggestions.includeLifestyleReview)
        setIncludeMedicationChanges(data.suggestions.includeMedicationChanges)
        setLabReviewNotes(data.suggestions.labReviewNotes || "")
        setLifestyleNotes(data.suggestions.lifestyleNotes || "")
        setAssessmentText(data.suggestions.assessment || "")
        setPlanText(data.suggestions.plan || "")
        
        // Pre-fill medication changes from AI suggestions
        if (data.suggestions.medicationChanges) {
          setMedicationChanges(data.suggestions.medicationChanges)
        }
        if (data.suggestions.supplementChanges) {
          setSupplementChanges(data.suggestions.supplementChanges)
        }
      }
    } catch (error) {
      console.error("[v0] AI suggestion error:", error)
    }
    setIsGeneratingAI(false)
  }

  const openPDFPreview = () => {
    // Collect all note data
    const noteData = {
      consultationId,
      patientId,
      sections: {
        chiefComplaint: includeChiefComplaint ? chiefComplaint : null,
        labReview: includeLabReview ? labReviewNotes : null,
        lifestyleReview: includeLifestyleReview ? lifestyleNotes : null,
        medicationReview: includeMedicationReview,
        medicationChanges: includeMedicationChanges ? medicationChanges : null,
        supplementReview: includeSupplementReview,
        supplementChanges: supplementChanges,
        assessment: includeAssessment ? assessmentText : null,
        plan: includePlan ? planText : null,
      },
    }

    // Open PDF in new window
    const queryString = encodeURIComponent(JSON.stringify(noteData))
    window.open(`/api/consultations/pdf-preview?data=${queryString}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/provider/consultations`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Consultations
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Clinical Note - Michael Chen</h1>
                <p className="text-sm text-muted-foreground">Initial Consultation • Jan 20, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={generateAISuggestions} disabled={isGeneratingAI} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                {isGeneratingAI ? "Generating..." : "AI Suggestions"}
              </Button>
              <Button onClick={openPDFPreview} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview PDF
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-primary text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Finalize Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Editor */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Chief Complaint */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeChiefComplaint} onCheckedChange={setIncludeChiefComplaint} />
                <h3 className="font-bold text-mono-upper">Chief Complaint</h3>
              </div>
            </div>
            {includeChiefComplaint && (
              <div className="p-4">
                <Textarea
                  placeholder="Patient presents for..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>

          {/* Lab Review */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeLabReview} onCheckedChange={setIncludeLabReview} />
                <h3 className="font-bold text-mono-upper">Lab Review</h3>
              </div>
            </div>
            {includeLabReview && (
              <div className="p-4">
                <Textarea
                  placeholder="Labs show..."
                  value={labReviewNotes}
                  onChange={(e) => setLabReviewNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}
          </div>

          {/* Lifestyle Review */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeLifestyleReview} onCheckedChange={setIncludeLifestyleReview} />
                <h3 className="font-bold text-mono-upper">Lifestyle & Health Pillars</h3>
              </div>
            </div>
            {includeLifestyleReview && (
              <div className="p-4">
                <Textarea
                  placeholder="Patient reports improvements in..."
                  value={lifestyleNotes}
                  onChange={(e) => setLifestyleNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}
          </div>

          {/* Medication Changes */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeMedicationChanges} onCheckedChange={setIncludeMedicationChanges} />
                <h3 className="font-bold text-mono-upper">Medication Changes</h3>
              </div>
              {includeMedicationChanges && (
                <Button onClick={addMedication} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              )}
            </div>
            {includeMedicationChanges && (
              <div className="p-4 space-y-4">
                {medicationChanges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No medication changes. Click "Add Medication" to add.
                  </p>
                ) : (
                  medicationChanges.map((med) => (
                    <div key={med.id} className="border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Select value={med.name} onValueChange={(value) => selectMedicationFromFormulary(med.id, value)}>
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select medication..." />
                          </SelectTrigger>
                          <SelectContent>
                            {formulary.medications.map((medication) => (
                              <SelectItem key={medication.name} value={medication.name}>
                                {medication.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => removeMedication(med.id)} size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Dose</label>
                          <Input
                            placeholder="150mg"
                            value={med.dose}
                            onChange={(e) => updateMedication(med.id, "dose", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Frequency</label>
                          <Input
                            placeholder="Weekly"
                            value={med.frequency}
                            onChange={(e) => updateMedication(med.id, "frequency", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Instructions</label>
                        <Textarea
                          placeholder="Inject subcutaneously..."
                          value={med.instructions}
                          onChange={(e) => updateMedication(med.id, "instructions", e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Supplement Changes */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeSupplementReview} onCheckedChange={setIncludeSupplementReview} />
                <h3 className="font-bold text-mono-upper">Supplement Changes</h3>
              </div>
              {includeSupplementReview && (
                <Button onClick={addSupplement} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplement
                </Button>
              )}
            </div>
            {includeSupplementReview && (
              <div className="p-4 space-y-4">
                {supplementChanges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No supplement changes. Click "Add Supplement" to add.
                  </p>
                ) : (
                  supplementChanges.map((supp) => (
                    <div key={supp.id} className="border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Select value={supp.name} onValueChange={(value) => selectSupplementFromFormulary(supp.id, value)}>
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select supplement..." />
                          </SelectTrigger>
                          <SelectContent>
                            {formulary.supplements.map((supplement) => (
                              <SelectItem key={supplement.name} value={supplement.name}>
                                {supplement.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => removeSupplement(supp.id)} size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Dose</label>
                          <Input
                            placeholder="5000 IU"
                            value={supp.dose}
                            onChange={(e) => updateSupplement(supp.id, "dose", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Route</label>
                          <Select value={supp.route} onValueChange={(value) => updateSupplement(supp.id, "route", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select route..." />
                            </SelectTrigger>
                            <SelectContent>
                              {ROUTES.map((route) => (
                                <SelectItem key={route.value} value={route.value}>
                                  {route.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Frequency</label>
                          <Select value={supp.frequency} onValueChange={(value) => updateSupplement(supp.id, "frequency", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency..." />
                            </SelectTrigger>
                            <SelectContent>
                              {FREQUENCIES.map((freq) => (
                                <SelectItem key={freq.value} value={freq.value}>
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-mono-upper text-muted-foreground mb-1 block">Instructions</label>
                        <Textarea
                          placeholder="Take with food..."
                          value={supp.instructions}
                          onChange={(e) => updateSupplement(supp.id, "instructions", e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Assessment */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includeAssessment} onCheckedChange={setIncludeAssessment} />
                <h3 className="font-bold text-mono-upper">Assessment</h3>
              </div>
            </div>
            {includeAssessment && (
              <div className="p-4">
                <Textarea
                  placeholder="Clinical assessment..."
                  value={assessmentText}
                  onChange={(e) => setAssessmentText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}
          </div>

          {/* Plan */}
          <div className="border border-border">
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={includePlan} onCheckedChange={setIncludePlan} />
                <h3 className="font-bold text-mono-upper">Plan</h3>
              </div>
            </div>
            {includePlan && (
              <div className="p-4">
                <Textarea
                  placeholder="Treatment plan..."
                  value={planText}
                  onChange={(e) => setPlanText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
