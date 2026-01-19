"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepPersonalInfo } from "./steps/step-personal-info"
import { StepMedicalHistory } from "./steps/step-medical-history"
import { StepReview } from "./steps/step-review"

export interface IntakeFormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string
  height: string
  weight: string
  // Goals
  goals: string[]
  // Medical Conditions
  medicalConditions: string[]
  // Symptoms
  symptoms: string[]
  // Medications
  currentMedications: string
  currentSupplements: string
  allergies: string
  // Additional Medical History
  previousSurgeries: string
  familyMedicalHistory: string
  previousHormoneTherapy: string
  // Lifestyle
  exerciseFrequency: string
  sleepHours: string
  stressLevel: string
  alcoholConsumption: string
  smokingStatus: string
  dietType: string
}

const initialFormData: IntakeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  occupation: "",
  height: "",
  weight: "",
  goals: [],
  medicalConditions: [],
  symptoms: [],
  currentMedications: "",
  currentSupplements: "",
  allergies: "",
  previousSurgeries: "",
  familyMedicalHistory: "",
  previousHormoneTherapy: "",
  exerciseFrequency: "",
  sleepHours: "",
  stressLevel: "",
  alcoholConsumption: "",
  smokingStatus: "",
  dietType: "",
}

const steps = [
  { id: 1, name: "Personal Information", label: "Personal Info" },
  { id: 2, name: "Medical Information", label: "Medical History" },
  { id: 3, name: "Final Review", label: "Review" },
]

export function IntakeWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (data: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // In production, this would submit to your backend
    console.log("Form submitted:", formData)
    router.push("/get-started/success")
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return { title: "Start Your", highlight: "Optimization", subtitle: "Journey" }
      case 2:
        return { title: "Medical", highlight: "History", subtitle: "" }
      case 3:
        return { title: "Review Your", highlight: "Information", subtitle: "" }
      default:
        return { title: "", highlight: "", subtitle: "" }
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about yourself and your health goals"
      case 2:
        return "Help us understand your health background"
      case 3:
        return "Please verify all details are correct"
      default:
        return ""
    }
  }

  const getBackLabel = () => {
    switch (currentStep) {
      case 2:
        return "Back to Personal Info"
      case 3:
        return "Back to Medical History"
      default:
        return "Back"
    }
  }

  const stepTitle = getStepTitle()

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Back Link */}
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {getBackLabel()}
          </button>
        )}
        {currentStep === 1 && (
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {stepTitle.title} <span className="text-primary">{stepTitle.highlight}</span>
            {stepTitle.subtitle && ` ${stepTitle.subtitle}`}
          </h1>
          <p className="text-muted-foreground">{getStepDescription()}</p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{steps[currentStep - 1].name}</span>
          </div>
          <div className="h-1 bg-border">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-10">
          {currentStep === 1 && <StepPersonalInfo formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <StepMedicalHistory formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <StepReview formData={formData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {currentStep === 1 ? (
            <a href="/" className="text-muted-foreground hover:text-foreground">
              Cancel
            </a>
          ) : (
            <button onClick={prevStep} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {currentStep === 1 ? "Continue to Medical History" : "Continue to Review"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Intake Form"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
