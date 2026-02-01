"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AIPrepNote } from "./ai-prep-note"

interface ClinicalNoteEditorProps {
  consultationId: string
}

export function ClinicalNoteEditor({ consultationId }: ClinicalNoteEditorProps) {
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")
  const [actionItems, setActionItems] = useState<string[]>([])
  const [newActionItem, setNewActionItem] = useState("")

  // Mock patient data - would come from API
  const patient = {
    name: "Michael Chen",
    age: 45,
    currentMeds: ["Testosterone Cypionate 150mg Weekly", "HCG 500 IU 2x/week", "Anastrozole 0.5mg 2x/week"],
    recentLabs: {
      testosterone: { value: 850, unit: "ng/dL", date: "2 weeks ago" },
      estradiol: { value: 28, unit: "pg/mL", date: "2 weeks ago" },
    },
    healthPillars: {
      sleep: 85,
      nutrition: 72,
      exercise: 90,
      stress: 65,
      supplements: 95,
    },
  }

  const handleAddActionItem = () => {
    if (newActionItem.trim()) {
      setActionItems([...actionItems, newActionItem])
      setNewActionItem("")
    }
  }

  const handleRemoveActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index))
  }

  const handleSaveDraft = () => {
    console.log("[v0] Saving draft...")
    // Save logic here
  }

  const handleFinalize = () => {
    console.log("[v0] Finalizing note...")
    // Finalize and sign note
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="border-border bg-transparent">
            <Link href="/provider/consultations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schedule
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clinical Note</h1>
            <p className="text-muted-foreground mt-1">{patient.name} - Lab Review</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} className="border-border bg-transparent">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleFinalize} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="w-4 h-4 mr-2" />
            Finalize & Sign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Sidebar - Patient Context */}
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-mono-upper text-xs text-muted-foreground">Patient Info</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-medium text-foreground">{patient.age} years</p>
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-mono-upper text-xs text-muted-foreground">Current Medications</h3>
            </div>
            <div className="p-4 space-y-2">
              {patient.currentMeds.map((med, index) => (
                <div key={index} className="text-sm">
                  <p className="text-foreground">{med}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Labs */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-mono-upper text-xs text-muted-foreground">Recent Labs</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Testosterone</p>
                <p className="font-medium text-foreground">
                  {patient.recentLabs.testosterone.value} {patient.recentLabs.testosterone.unit}
                </p>
                <p className="text-xs text-muted-foreground">{patient.recentLabs.testosterone.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estradiol</p>
                <p className="font-medium text-foreground">
                  {patient.recentLabs.estradiol.value} {patient.recentLabs.estradiol.unit}
                </p>
                <p className="text-xs text-muted-foreground">{patient.recentLabs.estradiol.date}</p>
              </div>
            </div>
          </div>

          {/* Health Pillars */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-mono-upper text-xs text-muted-foreground">Health Pillars</h3>
            </div>
            <div className="p-4 space-y-2">
              {Object.entries(patient.healthPillars).map(([pillar, score]) => (
                <div key={pillar} className="flex items-center justify-between">
                  <span className="text-sm text-foreground capitalize">{pillar}</span>
                  <span className="text-sm font-medium text-foreground">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - SOAP Note */}
        <div className="col-span-2 space-y-6">
          {/* AI Prep Note */}
          <AIPrepNote
            consultationId={consultationId}
            patientId="1"
            onNoteGenerated={(note) => {
              // Parse AI-generated note and populate SOAP fields
              const sections = note.split(/(?=SUBJECTIVE:|OBJECTIVE:|ASSESSMENT:|PLAN:)/i)
              sections.forEach((section) => {
                if (section.startsWith("SUBJECTIVE:")) setSubjective(section.replace("SUBJECTIVE:", "").trim())
                if (section.startsWith("OBJECTIVE:")) setObjective(section.replace("OBJECTIVE:", "").trim())
                if (section.startsWith("ASSESSMENT:")) setAssessment(section.replace("ASSESSMENT:", "").trim())
                if (section.startsWith("PLAN:")) setPlan(section.replace("PLAN:", "").trim())
              })
            }}
          />

          {/* Subjective */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Subjective</h3>
              <p className="text-xs text-muted-foreground mt-1">Patient's reported symptoms and concerns</p>
            </div>
            <div className="p-4">
              <Textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="Enter patient's chief complaint, symptoms, and subjective information..."
                className="min-h-32 bg-background border-border"
              />
            </div>
          </div>

          {/* Objective */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Objective</h3>
              <p className="text-xs text-muted-foreground mt-1">Measurable findings, lab results, vitals</p>
            </div>
            <div className="p-4">
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Enter objective findings, lab results, vitals, and measurements..."
                className="min-h-32 bg-background border-border"
              />
            </div>
          </div>

          {/* Assessment */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Assessment</h3>
              <p className="text-xs text-muted-foreground mt-1">Clinical interpretation and diagnosis</p>
            </div>
            <div className="p-4">
              <Textarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Enter your clinical assessment, diagnosis, and interpretation..."
                className="min-h-32 bg-background border-border"
              />
            </div>
          </div>

          {/* Plan */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">Treatment plan and next steps</p>
            </div>
            <div className="p-4">
              <Textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Enter treatment plan, medication changes, and recommendations..."
                className="min-h-32 bg-background border-border"
              />
            </div>
          </div>

          {/* Action Items for Concierge */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Action Items for Concierge</h3>
              <p className="text-xs text-muted-foreground mt-1">Tasks to be completed by wellness concierge</p>
            </div>
            <div className="p-4 space-y-4">
              {actionItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 border border-border">
                  <span className="flex-1 text-sm text-foreground">{item}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveActionItem(index)}
                    className="border-border hover:border-red-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddActionItem()}
                  placeholder="Add action item (e.g., 'Order testosterone labs')"
                  className="bg-background border-border"
                />
                <Button onClick={handleAddActionItem} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
