import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { getFormulary } from "@/lib/formulary"

export async function POST(request: NextRequest) {
  try {
    const { consultationId, patientId } = await request.json()

    // Mock patient data - in production, fetch from database
    const patientData = {
      name: "Michael Chen",
      currentLabs: {
        testosterone: { value: 450, unit: "ng/dL", date: "2026-01-15" },
        estradiol: { value: 35, unit: "pg/mL", date: "2026-01-15" },
        hematocrit: { value: 48, unit: "%", date: "2026-01-15" },
      },
      priorLabs: {
        testosterone: { value: 280, unit: "ng/dL", date: "2025-10-01" },
        estradiol: { value: 45, unit: "pg/mL", date: "2025-10-01" },
        hematocrit: { value: 45, unit: "%", date: "2025-10-01" },
      },
      baselineLabs: {
        testosterone: { value: 250, unit: "ng/dL", date: "2025-07-01" },
        estradiol: { value: 50, unit: "pg/mL", date: "2025-07-01" },
        hematocrit: { value: 44, unit: "%", date: "2025-07-01" },
      },
      healthPillars: {
        sleep: { current: 85, prior: 72, change: "+13%" },
        nutrition: { current: 72, prior: 65, change: "+7%" },
        exercise: { current: 90, prior: 80, change: "+10%" },
        stress: { current: 65, prior: 70, change: "-5%" },
        supplements: { current: 95, prior: 90, change: "+5%" },
      },
      currentMedications: [
        { name: "Testosterone Cypionate", dose: "150mg", frequency: "Weekly" },
        { name: "HCG", dose: "500 IU", frequency: "2x/week" },
      ],
      currentSupplements: [
        { name: "Vitamin D3", dose: "5000 IU", frequency: "Daily" },
        { name: "Fish Oil", dose: "2000mg", frequency: "Daily" },
      ],
    }

    const formulary = getFormulary()

    // Generate AI suggestions
    const prompt = `You are a clinical AI assistant for Adonis Health, a men's health optimization practice.

PATIENT DATA:
${JSON.stringify(patientData, null, 2)}

AVAILABLE FORMULARY:
Medications: ${formulary.medications.map((m) => m.name).join(", ")}
Supplements: ${formulary.supplements.map((s) => s.name).join(", ")}

TASK: Analyze the patient's lab trends, health pillar improvements, and current protocol. Provide structured suggestions for the clinical note.

Return a JSON object with:
{
  "includeLabReview": boolean,
  "includeLifestyleReview": boolean,
  "includeMedicationChanges": boolean,
  "labReviewNotes": "Clinical interpretation of lab trends",
  "lifestyleNotes": "Summary of health pillar changes",
  "medicationChanges": [
    {"id": "timestamp", "name": "medication from formulary", "dose": "dose", "frequency": "frequency", "instructions": "instructions"}
  ],
  "supplementChanges": [
    {"id": "timestamp", "name": "supplement from formulary", "dose": "dose", "frequency": "frequency", "instructions": "instructions"}
  ],
  "assessment": "Clinical assessment",
  "plan": "Treatment plan"
}

Focus on:
1. Lab trends (baseline → prior → current)
2. Health pillar improvements
3. Only recommend changes from the available formulary
4. Be concise and clinical`

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt,
    })

    // Parse AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse AI response")
    }

    const suggestions = JSON.parse(jsonMatch[0])

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("[v0] AI suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
