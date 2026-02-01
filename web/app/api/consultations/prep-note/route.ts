import { generateText } from "ai"
import { formulary } from "@/lib/formulary"

export async function POST(req: Request) {
  try {
    const { patientId, consultationId, refinementPrompt } = await req.json()

    // In production, fetch real patient data from database
    const patientData = {
      name: "Michael Chen",
      age: 42,
      program: "TRT + Optimization",
      
      // Lab History (most recent first)
      labs: [
        {
          date: "2026-01-15",
          type: "current",
          values: {
            totalTestosterone: { value: 850, unit: "ng/dL", referenceRange: "264-916" },
            freeTestosterone: { value: 18.5, unit: "pg/mL", referenceRange: "8.7-25.1" },
            estradiol: { value: 45, unit: "pg/mL", referenceRange: "10-40" },
            shbg: { value: 32, unit: "nmol/L", referenceRange: "16-55" },
            hematocrit: { value: 51, unit: "%", referenceRange: "38-50" },
            psa: { value: 0.8, unit: "ng/mL", referenceRange: "0-4" },
            vitaminD: { value: 52, unit: "ng/mL", referenceRange: "30-100" },
          },
        },
        {
          date: "2025-12-01",
          type: "prior",
          values: {
            totalTestosterone: { value: 780, unit: "ng/dL" },
            estradiol: { value: 38, unit: "pg/mL" },
            hematocrit: { value: 49, unit: "%" },
          },
        },
        {
          date: "2025-10-15",
          type: "baseline",
          values: {
            totalTestosterone: { value: 320, unit: "ng/dL" },
            estradiol: { value: 25, unit: "pg/mL" },
            hematocrit: { value: 45, unit: "%" },
          },
        },
      ],

      // Health Pillar Trends
      healthPillars: [
        { pillar: "Sleep", current: 85, previous: 72, trend: "improving" },
        { pillar: "Nutrition", current: 72, previous: 75, trend: "declining" },
        { pillar: "Exercise", current: 90, previous: 85, trend: "improving" },
        { pillar: "Stress", current: 65, previous: 70, trend: "declining" },
        { pillar: "Supplements", current: 95, previous: 95, trend: "stable" },
      ],

      // Current Protocol
      currentMedications: [
        { name: "Testosterone Cypionate", dose: "150mg", frequency: "Weekly", startDate: "2025-10-01" },
        { name: "HCG", dose: "500 IU", frequency: "2x/week", startDate: "2025-10-01" },
        { name: "Anastrozole", dose: "0.5mg", frequency: "2x/week", startDate: "2025-11-15", note: "Added due to elevated E2" },
      ],

      currentSupplements: [
        { name: "Vitamin D3", dose: "5000 IU", frequency: "Daily" },
        { name: "Fish Oil", dose: "2000mg", frequency: "Daily" },
        { name: "Magnesium", dose: "400mg", frequency: "Daily" },
        { name: "Zinc", dose: "30mg", frequency: "Daily" },
        { name: "Creatine", dose: "5g", frequency: "Daily" },
      ],

      // Recent Check-ins
      recentCheckins: [
        {
          date: "2026-01-12",
          mood: 8,
          energy: 8,
          notes: "Feeling great overall, libido improved significantly",
        },
        {
          date: "2026-01-05",
          mood: 7,
          energy: 7,
          notes: "Some nipple sensitivity noticed, otherwise good",
        },
      ],
    }

    // Build context for AI
    const systemPrompt = `You are an expert medical AI assistant for Adonis Health, specializing in men's hormone optimization and wellness. 

Your role is to generate a clinical preparation note for providers before patient consultations. Analyze:
1. Lab trends (current vs prior vs baseline)
2. Health pillar changes (sleep, nutrition, exercise, stress, supplements)
3. Current medication/supplement protocol
4. Patient-reported symptoms and check-ins

Generate a SOAP-formatted note with:
- SUBJECTIVE: Patient-reported symptoms, concerns, and check-in data
- OBJECTIVE: Lab results with trends and health pillar metrics
- ASSESSMENT: Clinical interpretation of data, identify issues/concerns
- PLAN: Recommended adjustments to protocol

When recommending medications or supplements, ONLY suggest items from the Adonis Health formulary provided.

Use clinical language appropriate for provider review. Be specific with dosing recommendations.`

    const formularyContext = `Available Adonis Health Formulary:

MEDICATIONS:
${formulary
  .filter((item) => item.category === "medication")
  .map((item) => `- ${item.name} (${item.type}): ${item.dosageOptions.join(", ")} | ${item.frequencyOptions.join(", ")}`)
  .join("\n")}

SUPPLEMENTS:
${formulary
  .filter((item) => item.category === "supplement")
  .map((item) => `- ${item.name} (${item.type}): ${item.dosageOptions.join(", ")} | ${item.frequencyOptions.join(", ")}`)
  .join("\n")}`

    const patientContext = `Patient: ${patientData.name}, Age ${patientData.age}, Program: ${patientData.program}

CURRENT LAB RESULTS (${patientData.labs[0].date}):
${Object.entries(patientData.labs[0].values)
  .map(([key, val]: [string, any]) => `- ${key}: ${val.value} ${val.unit} (Ref: ${val.referenceRange || "N/A"})`)
  .join("\n")}

PRIOR LABS (${patientData.labs[1].date}):
${Object.entries(patientData.labs[1].values)
  .map(([key, val]: [string, any]) => `- ${key}: ${val.value} ${val.unit}`)
  .join("\n")}

BASELINE LABS (${patientData.labs[2].date}):
${Object.entries(patientData.labs[2].values)
  .map(([key, val]: [string, any]) => `- ${key}: ${val.value} ${val.unit}`)
  .join("\n")}

HEALTH PILLAR TRENDS:
${patientData.healthPillars.map((p) => `- ${p.pillar}: ${p.current}% (was ${p.previous}%, ${p.trend})`).join("\n")}

CURRENT MEDICATIONS:
${patientData.currentMedications.map((m) => `- ${m.name} ${m.dose} ${m.frequency} ${m.note ? `(${m.note})` : ""}`).join("\n")}

CURRENT SUPPLEMENTS:
${patientData.currentSupplements.map((s) => `- ${s.name} ${s.dose} ${s.frequency}`).join("\n")}

RECENT CHECK-INS:
${patientData.recentCheckins.map((c) => `${c.date}: Mood ${c.mood}/10, Energy ${c.energy}/10 - "${c.notes}"`).join("\n")}`

    const userPrompt = refinementPrompt
      ? `${patientContext}\n\nAdditional Instructions: ${refinementPrompt}`
      : patientContext

    // Generate AI prep note
    const { text } = await generateText({
      model: "openai/gpt-4o",
      system: `${systemPrompt}\n\n${formularyContext}`,
      prompt: userPrompt,
    })

    return Response.json({
      success: true,
      prepNote: text,
      patientData,
    })
  } catch (error: any) {
    console.error("[v0] Error generating prep note:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
