"use client"

import { Heart, Activity, Pill, Clock, Upload, X, Plus, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { IntakeFormData } from "../intake-wizard"

interface StepMedicalHistoryProps {
  formData: IntakeFormData
  updateFormData: (data: Partial<IntakeFormData>) => void
}

const medicalConditions = [
  "High Blood Pressure",
  "High Cholesterol",
  "Diabetes",
  "Thyroid Issues",
  "Heart Disease",
  "Liver Disease",
  "Kidney Disease",
  "Sleep Apnea",
  "Depression/Anxiety",
  "None of the above",
]

const symptoms = [
  "Low Energy/Fatigue",
  "Poor Sleep",
  "Weight Gain",
  "Difficulty Building Muscle",
  "Low Libido",
  "Mood Changes",
  "Brain Fog",
  "Joint Pain",
  "Hair Loss",
  "Decreased Performance",
]

const COMMON_MEDICATIONS = [
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Levothyroxine",
  "Amlodipine",
  "Metoprolol",
  "Omeprazole",
  "Losartan",
  "Albuterol",
  "Gabapentin",
  "Sertraline",
  "Escitalopram",
  "Bupropion",
  "Duloxetine",
  "Prednisone",
  "Hydrochlorothiazide",
  "Montelukast",
  "Rosuvastatin",
  "Tamsulosin",
  "Finasteride",
]

const COMMON_SUPPLEMENTS = [
  "Vitamin D3",
  "Fish Oil/Omega-3",
  "Multivitamin",
  "Vitamin B12",
  "Magnesium",
  "Zinc",
  "Vitamin C",
  "Probiotics",
  "Creatine",
  "Protein Powder",
  "CoQ10",
  "Ashwagandha",
  "Turmeric/Curcumin",
  "Vitamin K2",
  "Iron",
  "Calcium",
  "DHEA",
  "Melatonin",
  "L-Theanine",
  "5-HTP",
]

const COMMON_ALLERGENS = [
  "Penicillin",
  "Sulfa drugs",
  "Aspirin",
  "NSAIDs (Ibuprofen)",
  "Codeine",
  "Latex",
  "Peanuts",
  "Tree nuts",
  "Shellfish",
  "Dairy",
  "Eggs",
  "Soy",
  "Wheat/Gluten",
  "Sesame",
  "Bee stings",
  "Pollen",
  "Dust mites",
  "Pet dander",
]

interface MedicationItem {
  name: string
  dosage?: string
  dosageUnit?: string
  route?: string
  frequency?: string
  severity?: string
  reaction?: string
}

const DOSAGE_UNITS = ["mg", "mcg", "g", "ml", "IU", "units"]

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

const SEVERITY_LEVELS = [
  { value: "", label: "Select severity" },
  { value: "Mild", label: "Mild" },
  { value: "Moderate", label: "Moderate" },
  { value: "Severe", label: "Severe" },
]

function MultiSelectPicker({
  items,
  selectedItems,
  onAdd,
  onRemove,
  onEdit,
  placeholder,
  emptyText,
  allowCustom = true,
  customLabel = "Add Custom Entry",
  isAllergy = false,
}: {
  items: string[]
  selectedItems: MedicationItem[]
  onAdd: (item: MedicationItem) => void
  onRemove: (name: string) => void
  onEdit?: (oldName: string, updatedItem: MedicationItem) => void
  placeholder: string
  emptyText: string
  allowCustom?: boolean
  customLabel?: string
  isAllergy?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [customItem, setCustomItem] = useState("")
  const [dosage, setDosage] = useState("")
  const [dosageUnit, setDosageUnit] = useState("mg")
  const [route, setRoute] = useState("PO")
  const [frequency, setFrequency] = useState("qD")
  const [severity, setSeverity] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editDosage, setEditDosage] = useState("")
  const [editDosageUnit, setEditDosageUnit] = useState("mg")
  const [editRoute, setEditRoute] = useState("PO")
  const [editFrequency, setEditFrequency] = useState("qD")
  const [editSeverity, setEditSeverity] = useState("")
  const [reaction, setReaction] = useState("")

  const handleSelect = (itemName: string) => {
    onAdd({ name: itemName })
    setOpen(false)
  }

  const handleAddCustom = () => {
    if (!customItem.trim()) return

    if (isAllergy) {
      onAdd({
        name: customItem.trim(),
        reaction: reaction.trim(),
        severity: severity,
      })
      setCustomItem("")
      setReaction("")
      setSeverity("")
    } else {
      onAdd({
        name: customItem.trim(),
        dosage,
        dosageUnit,
        route,
        frequency,
      })
      setCustomItem("")
      setDosage("")
      setDosageUnit("")
      setRoute("")
      setFrequency("")
    }
  }

  const handleStartEdit = (item: MedicationItem) => {
    setEditingItem(item.name)
    setEditDosage(item.dosage || "")
    setEditDosageUnit(item.dosageUnit || "mg")
    setEditRoute(item.route || "PO")
    setEditFrequency(item.frequency || "qD")
    setEditSeverity(item.severity || "")
    setReaction(item.reaction || "")
  }

  const handleSaveEdit = (oldName: string) => {
    if (onEdit) {
      onEdit(oldName, {
        name: oldName,
        dosage: editDosage,
        dosageUnit: editDosageUnit,
        route: editRoute,
        frequency: editFrequency,
        severity: editSeverity,
        reaction: reaction,
      })
    }
    setEditingItem(null)
    setEditDosage("")
    setEditDosageUnit("mg")
    setEditRoute("PO")
    setEditFrequency("qD")
    setEditSeverity("")
    setReaction("")
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditDosage("")
    setEditDosageUnit("mg")
    setEditRoute("PO")
    setEditFrequency("qD")
    setEditSeverity("")
    setReaction("")
  }

  const formatDisplay = (item: MedicationItem) => {
    const parts = []
    if (item.dosage && item.dosageUnit) {
      parts.push(`${item.dosage}${item.dosageUnit}`)
    }
    if (item.route) {
      parts.push(item.route)
    }
    if (item.frequency) {
      const freqLabel = FREQUENCIES.find((f) => f.value === item.frequency)?.label.split(" (")[0]
      parts.push(freqLabel || item.frequency)
    }
    if (item.severity) {
      parts.push(item.severity)
    }
    if (item.reaction) {
      parts.push(`Reaction: ${item.reaction}`)
    }
    return parts.join(" • ")
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal border-border hover:border-primary/50 h-12 bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4 text-primary" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 border-border" align="start">
          <Command className="border-0">
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {items
                  .filter((item) => !selectedItems.some((selected) => selected.name === item))
                  .map((item) => (
                    <CommandItem key={item} value={item} onSelect={() => handleSelect(item)} className="cursor-pointer">
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedItems.some((s) => s.name === item) ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {item}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="space-y-2">
          {selectedItems.map((item) => (
            <div key={item.name} className="border border-border bg-background">
              {editingItem === item.name ? (
                <div className="p-3 space-y-3">
                  <p className="font-medium mb-2">{item.name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Dosage"
                      value={editDosage}
                      onChange={(e) => setEditDosage(e.target.value)}
                      className="bg-background border-border"
                    />
                    <select
                      value={editDosageUnit}
                      onChange={(e) => setEditDosageUnit(e.target.value)}
                      className="h-10 w-full border border-border bg-background px-3 text-sm"
                    >
                      {DOSAGE_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={editRoute}
                    onChange={(e) => setEditRoute(e.target.value)}
                    className="h-10 w-full border border-border bg-background px-3 text-sm"
                  >
                    {ROUTES.map((route) => (
                      <option key={route.value} value={route.value}>
                        {route.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editFrequency}
                    onChange={(e) => setEditFrequency(e.target.value)}
                    className="h-10 w-full border border-border bg-background px-3 text-sm"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editSeverity}
                    onChange={(e) => setEditSeverity(e.target.value)}
                    className="h-10 w-full border border-border bg-background px-3 text-sm"
                  >
                    {SEVERITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {isAllergy && (
                    <Input
                      placeholder="Reaction"
                      value={reaction}
                      onChange={(e) => setReaction(e.target.value)}
                      className="bg-background border-border"
                    />
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(item.name)}
                      size="sm"
                      className="flex-1 bg-primary text-background hover:bg-primary/90"
                    >
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline" className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3 p-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {formatDisplay(item) && <p className="text-sm text-muted-foreground mt-1">{formatDisplay(item)}</p>}
                  </div>
                  <div className="flex gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(item)}
                        className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(item.name)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {allowCustom && (
        <div className="border border-border p-4 space-y-3">
          <p className="text-xs text-muted-foreground">Or add custom entry:</p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Name"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              className="h-10 w-full border border-border bg-background px-3 text-sm"
            />

            {isAllergy ? (
              <>
                <Input
                  type="text"
                  placeholder="Reaction (e.g., rash, swelling, anaphylaxis)"
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                />
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                >
                  {SEVERITY_LEVELS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                {/* Existing medication/supplement fields */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Dosage (e.g., 500)"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="h-10 border border-border bg-background px-3 text-sm"
                  />
                  <select
                    value={dosageUnit}
                    onChange={(e) => setDosageUnit(e.target.value)}
                    className="h-10 border border-border bg-background px-3 text-sm"
                  >
                    {DOSAGE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                >
                  {ROUTES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <Button
              onClick={handleAddCustom}
              disabled={!customItem.trim()}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              {customLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function StepMedicalHistory({ formData, updateFormData }: StepMedicalHistoryProps) {
  const [medications, setMedications] = useState<MedicationItem[]>([])
  const [supplements, setSupplements] = useState<MedicationItem[]>([])
  const [allergies, setAllergies] = useState<MedicationItem[]>([])

  const toggleCondition = (condition: string) => {
    const current = formData.medicalConditions
    if (current.includes(condition)) {
      updateFormData({ medicalConditions: current.filter((c) => c !== condition) })
    } else {
      updateFormData({ medicalConditions: [...current, condition] })
    }
  }

  const toggleSymptom = (symptom: string) => {
    const current = formData.symptoms
    if (current.includes(symptom)) {
      updateFormData({ symptoms: current.filter((s) => s !== symptom) })
    } else {
      updateFormData({ symptoms: [...current, symptom] })
    }
  }

  return (
    <div className="space-y-8">
      {/* Medical Conditions */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Medical Conditions</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Select any that apply to you</p>

        <div className="grid md:grid-cols-2 gap-3">
          {medicalConditions.map((condition) => (
            <label
              key={condition}
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                formData.medicalConditions.includes(condition)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Checkbox
                checked={formData.medicalConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Symptoms */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Current Symptoms</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">What are you experiencing?</p>

        <div className="grid md:grid-cols-2 gap-3">
          {symptoms.map((symptom) => (
            <label
              key={symptom}
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                formData.symptoms.includes(symptom)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Checkbox checked={formData.symptoms.includes(symptom)} onCheckedChange={() => toggleSymptom(symptom)} />
              <span>{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications, Supplements & Allergies */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Pill className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Medications, Supplements & Allergies</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="mb-1 block">Current Medications</Label>
            <p className="text-xs text-muted-foreground mb-3">Search or add custom entries with dosage and frequency</p>
            <MultiSelectPicker
              items={COMMON_MEDICATIONS}
              selectedItems={medications}
              onAdd={(item) => setMedications([...medications, item])}
              onRemove={(name) => setMedications(medications.filter((m) => m.name !== name))}
              onEdit={(oldName, updatedItem) =>
                setMedications(medications.map((m) => (m.name === oldName ? updatedItem : m)))
              }
              placeholder="Add medication"
              emptyText="No medications found. Add custom entry below."
              customLabel="Add Custom Medication"
            />
          </div>

          <div>
            <Label className="mb-1 block">Current Supplements</Label>
            <p className="text-xs text-muted-foreground mb-3">Search or add custom entries with dosage and frequency</p>
            <MultiSelectPicker
              items={COMMON_SUPPLEMENTS}
              selectedItems={supplements}
              onAdd={(item) => setSupplements([...supplements, item])}
              onRemove={(name) => setSupplements(supplements.filter((s) => s.name !== name))}
              onEdit={(oldName, updatedItem) =>
                setSupplements(supplements.map((s) => (s.name === oldName ? updatedItem : s)))
              }
              placeholder="Add supplement"
              emptyText="No supplements found. Add custom entry below."
              customLabel="Add Custom Supplement"
            />
          </div>

          <div>
            <Label className="mb-1 block">Allergies</Label>
            <p className="text-xs text-muted-foreground mb-3">Search or add custom entries</p>
            <MultiSelectPicker
              items={COMMON_ALLERGENS}
              selectedItems={allergies}
              onAdd={(item) => setAllergies([...allergies, item])}
              onRemove={(name) => setAllergies(allergies.filter((a) => a.name !== name))}
              onEdit={(oldName, updatedItem) =>
                setAllergies(allergies.map((a) => (a.name === oldName ? updatedItem : a)))
              }
              placeholder="Add allergy"
              emptyText="No allergens found. Add custom entry below."
              customLabel="Add Custom Allergy"
              isAllergy={true}
            />
          </div>
        </div>
      </div>

      {/* Additional Medical History */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Additional Medical History</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="surgeries" className="mb-2 block">
              Previous Surgeries
            </Label>
            <Textarea
              id="surgeries"
              placeholder="List any previous surgeries..."
              value={formData.previousSurgeries}
              onChange={(e) => updateFormData({ previousSurgeries: e.target.value })}
              className="bg-background border-border min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="familyHistory" className="mb-2 block">
              Family Medical History
            </Label>
            <Textarea
              id="familyHistory"
              placeholder="Notable family medical history (heart disease, diabetes, etc.)..."
              value={formData.familyMedicalHistory}
              onChange={(e) => updateFormData({ familyMedicalHistory: e.target.value })}
              className="bg-background border-border min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="hormoneTherapy" className="mb-2 block">
              Previous Hormone Therapy
            </Label>
            <Textarea
              id="hormoneTherapy"
              placeholder="Any previous hormone therapy or TRT experience..."
              value={formData.previousHormoneTherapy}
              onChange={(e) => updateFormData({ previousHormoneTherapy: e.target.value })}
              className="bg-background border-border min-h-[100px]"
            />
          </div>
          <div>
            <Label className="mb-2 block">Upload Recent Lab Results (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">PDF files only - you can upload multiple files</p>
            <div className="border border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Click to upload lab results (PDF only)</p>
              <p className="text-xs text-muted-foreground mt-1">Multiple files supported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
