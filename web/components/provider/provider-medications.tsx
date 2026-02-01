"use client"

import { useState } from "react"
import { Pill, AlertTriangle, DollarSign, TrendingUp, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFormulary } from "@/lib/formulary"

export function ProviderMedications() {
  const [selectedMedication, setSelectedMedication] = useState("")
  const [patientWeight, setPatientWeight] = useState("80")
  const [calculatedDose, setCalculatedDose] = useState("")
  
  const formulary = getFormulary()

  const mockInteractions = [
    {
      medication1: "Testosterone Cypionate",
      medication2: "Warfarin",
      severity: "moderate",
      description: "Testosterone may enhance anticoagulant effects. Monitor INR closely."
    }
  ]

  const mockAlternatives = [
    {
      current: "Anastrozole",
      alternative: "Exemestane",
      reason: "Lower cost, similar efficacy",
      costSavings: "$45/month"
    }
  ]

  const calculateDose = () => {
    if (selectedMedication === "Testosterone Cypionate" && patientWeight) {
      const weight = parseFloat(patientWeight)
      const dosePerKg = 2 // mg/kg example
      const calculated = (weight * dosePerKg).toFixed(0)
      setCalculatedDose(`${calculated}mg weekly (based on ${dosePerKg}mg/kg)`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clinical Decision Support</h1>
            <p className="text-sm text-muted-foreground">Drug interactions, dosing calculator, and alternatives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dosing Calculator */}
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Dosing Calculator</h2>
                <p className="text-sm text-muted-foreground">Weight-based dose recommendations</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-mono-upper text-muted-foreground mb-2 block">MEDICATION</label>
                <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication..." />
                  </SelectTrigger>
                  <SelectContent>
                    {formulary.medications.map((med) => (
                      <SelectItem key={med.name} value={med.name}>
                        {med.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-mono-upper text-muted-foreground mb-2 block">PATIENT WEIGHT (KG)</label>
                <Input 
                  type="number" 
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(e.target.value)}
                  placeholder="80"
                />
              </div>
              <Button 
                onClick={calculateDose}
                className="w-full bg-primary text-background hover:bg-primary/90"
                disabled={!selectedMedication || !patientWeight}
              >
                Calculate Dose
              </Button>
              {calculatedDose && (
                <div className="p-4 bg-primary/10 border border-primary">
                  <p className="text-xs text-mono-upper text-primary mb-1">RECOMMENDED DOSE</p>
                  <p className="text-foreground font-bold">{calculatedDose}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: This is a starting recommendation. Adjust based on labs and patient response.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drug Interaction Checker */}
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Drug Interactions</h2>
                <p className="text-sm text-muted-foreground">{mockInteractions.length} potential interaction(s)</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {mockInteractions.map((interaction, idx) => (
                <div key={idx} className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono uppercase px-2 py-1 ${
                      interaction.severity === "severe" ? "bg-red-500/10 text-red-500" :
                      interaction.severity === "moderate" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-green-500/10 text-green-500"
                    }`}>
                      {interaction.severity}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">
                    {interaction.medication1} + {interaction.medication2}
                  </p>
                  <p className="text-sm text-muted-foreground">{interaction.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alternative Medications */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Cost-Effective Alternatives</h2>
              <p className="text-sm text-muted-foreground">Potential savings for patients</p>
            </div>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
            <div>Current</div>
            <div>Alternative</div>
            <div className="col-span-2">Reason</div>
            <div className="text-right">Savings</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {mockAlternatives.map((alt, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{alt.current}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">{alt.alternative}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">{alt.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">{alt.costSavings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulary Quick Reference */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Adonis Formulary</h2>
              <p className="text-sm text-muted-foreground">{formulary.medications.length} approved medications</p>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
            <div className="col-span-2">Medication</div>
            <div>Standard Dosing</div>
            <div>Frequency</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {formulary.medications.map((med, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-2">
                  <p className="font-medium text-foreground">{med.name}</p>
                </div>
                <div>
                  <p className="text-foreground">{med.standardDosing}</p>
                </div>
                <div>
                  <p className="text-foreground">{med.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
