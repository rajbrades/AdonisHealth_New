"use client"

import { User, Pill, Dumbbell } from "lucide-react"
import type { IntakeFormData } from "../intake-wizard"

interface StepReviewProps {
  formData: IntakeFormData
}

export function StepReview({ formData }: StepReviewProps) {
  const formatValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Not specified"
    }
    return value || "Not specified"
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
            <p className="font-medium">
              {formData.firstName} {formData.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-medium">{formatValue(formData.email)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Phone</p>
            <p className="font-medium">{formatValue(formData.phone)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
            <p className="font-medium">{formatValue(formData.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Occupation</p>
            <p className="font-medium">{formatValue(formData.occupation)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Height / Weight</p>
            <p className="font-medium">
              {formData.height ? `${formData.height}"` : "—"} / {formData.weight ? `${formData.weight} lbs` : "—"}
            </p>
          </div>
        </div>

        {formData.goals.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Optimization Goals</p>
            <div className="flex flex-wrap gap-2">
              {formData.goals.map((goal) => (
                <span key={goal} className="px-3 py-1 bg-primary/10 border border-primary/30 text-sm">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medical Information */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Pill className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Medical Information</h2>
        </div>

        {formData.medicalConditions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
            <p className="font-medium">{formData.medicalConditions.join(", ")}</p>
          </div>
        )}

        {formData.symptoms.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Current Symptoms</p>
            <p className="font-medium">{formData.symptoms.join(", ")}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Medications</p>
            <p className="font-medium">{formatValue(formData.currentMedications)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Supplements</p>
            <p className="font-medium">{formatValue(formData.currentSupplements)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Allergies</p>
            <p className="font-medium">{formatValue(formData.allergies)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Previous Surgeries</p>
            <p className="font-medium">{formatValue(formData.previousSurgeries)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Family Medical History</p>
            <p className="font-medium">{formatValue(formData.familyMedicalHistory)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Previous Hormone Therapy</p>
            <p className="font-medium">{formatValue(formData.previousHormoneTherapy)}</p>
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Lifestyle</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Exercise Frequency</p>
            <p className="font-medium">{formatValue(formData.exerciseFrequency)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sleep Hours</p>
            <p className="font-medium">{formatValue(formData.sleepHours)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Stress Level</p>
            <p className="font-medium">{formatValue(formData.stressLevel)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Alcohol Consumption</p>
            <p className="font-medium">{formatValue(formData.alcoholConsumption)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Smoking Status</p>
            <p className="font-medium">{formatValue(formData.smokingStatus)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Diet Type</p>
            <p className="font-medium">{formatValue(formData.dietType)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
