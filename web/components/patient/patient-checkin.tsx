"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Moon, Utensils, Dumbbell, Brain, Pill, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

const steps = [
  { id: "mood", title: "Overall Mood", icon: CheckCircle },
  { id: "sleep", title: "Sleep", icon: Moon },
  { id: "nutrition", title: "Nutrition", icon: Utensils },
  { id: "exercise", title: "Exercise", icon: Dumbbell },
  { id: "stress", title: "Stress", icon: Brain },
  { id: "supplements", title: "Supplements", icon: Pill },
  { id: "notes", title: "Additional Notes", icon: CheckCircle },
]

const sleepQuestions = [
  { id: "hours", question: "How many hours did you sleep on average this week?", type: "slider", min: 4, max: 10 },
  {
    id: "quality",
    question: "How would you rate your sleep quality?",
    type: "options",
    options: ["Poor", "Fair", "Good", "Excellent"],
  },
  {
    id: "issues",
    question: "Any sleep issues this week?",
    type: "options",
    options: ["None", "Trouble falling asleep", "Waking up at night", "Waking too early"],
  },
]

const nutritionQuestions = [
  {
    id: "protein",
    question: "Did you hit your protein targets most days?",
    type: "options",
    options: ["Rarely", "Sometimes", "Most days", "Every day"],
  },
  {
    id: "water",
    question: "How much water did you drink daily on average?",
    type: "options",
    options: ["< 2L", "2-3L", "3-4L", "> 4L"],
  },
  {
    id: "meals",
    question: "How consistent were your meal times?",
    type: "options",
    options: ["Inconsistent", "Somewhat consistent", "Very consistent"],
  },
]

const exerciseQuestions = [
  { id: "workouts", question: "How many workouts did you complete this week?", type: "slider", min: 0, max: 7 },
  {
    id: "intensity",
    question: "How intense were your workouts?",
    type: "options",
    options: ["Light", "Moderate", "High", "Very High"],
  },
  {
    id: "recovery",
    question: "How is your recovery feeling?",
    type: "options",
    options: ["Poor", "Okay", "Good", "Great"],
  },
]

const stressQuestions = [
  { id: "level", question: "What was your average stress level this week?", type: "slider", min: 1, max: 10 },
  {
    id: "source",
    question: "What was your main source of stress?",
    type: "options",
    options: ["Work", "Family", "Health", "Finances", "Other", "None"],
  },
  {
    id: "coping",
    question: "Did you use any stress management techniques?",
    type: "options",
    options: ["None", "Meditation", "Exercise", "Breathing", "Other"],
  },
]

const supplementQuestions = [
  { id: "adherence", question: "How many days did you take all your supplements?", type: "slider", min: 0, max: 7 },
  {
    id: "issues",
    question: "Any issues with your supplements?",
    type: "options",
    options: ["None", "Forgot doses", "Side effects", "Ran out"],
  },
]

interface CheckInAnswers {
  mood: number
  sleepHours: number
  sleepQuality: string
  sleepIssues: string
  nutritionProtein: string
  nutritionWater: string
  nutritionMeals: string
  exerciseWorkouts: number
  exerciseIntensity: string
  exerciseRecovery: string
  stressLevel: number
  stressSource: string
  stressCoping: string
  supplementAdherence: number
  supplementIssues: string
  additionalNotes: string
}

export function PatientCheckin() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<CheckInAnswers>({
    mood: 7,
    sleepHours: 7,
    sleepQuality: "",
    sleepIssues: "",
    nutritionProtein: "",
    nutritionWater: "",
    nutritionMeals: "",
    exerciseWorkouts: 4,
    exerciseIntensity: "",
    exerciseRecovery: "",
    stressLevel: 5,
    stressSource: "",
    stressCoping: "",
    supplementAdherence: 7,
    supplementIssues: "",
    additionalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper to fetch current patient ID (Mocked for now, pending Auth Context)
  // In a real app, this would come from the session or an API call to /auth/me
  const getPatientId = () => "f4437a28-99f9-47b0-8a86-ba920ae432af"; // Using the ID from verification script

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // 1. Transform Answers to DTO
      const payload = {
        patientId: getPatientId(),
        type: "MONTHLY",
        date: new Date().toISOString(),
        notes: `Overall Mood: ${answers.mood}/10. \nAdditional Notes: ${answers.additionalNotes || 'None'}`,

        pillars: [
          // Sleep
          {
            category: "SLEEP",
            score: typeof answers.sleepQuality === 'string' && answers.sleepQuality === 'Excellent' ? 10 :
              typeof answers.sleepQuality === 'string' && answers.sleepQuality === 'Good' ? 8 : 5,
            notes: `Hours: ${answers.sleepHours}. Issues: ${answers.sleepIssues || 'None'}`
          },
          // Diet (Nutrition)
          {
            category: "DIET",
            score: answers.nutritionProtein === 'Every day' ? 10 : 7,
            notes: `Protein: ${answers.nutritionProtein}. Water: ${answers.nutritionWater}`
          },
          // Movement (Exercise)
          {
            category: "MOVEMENT",
            score: (answers.exerciseWorkouts as number) >= 5 ? 10 : (answers.exerciseWorkouts as number) * 2,
            notes: `Workouts: ${answers.exerciseWorkouts}. Intensity: ${answers.exerciseIntensity}`
          },
          // Mental Acuity (Stress/Mood)
          {
            category: "MENTAL_ACUITY",
            score: 10 - (answers.stressLevel as number), // Inverse of stress
            notes: `Stress Source: ${answers.stressSource}. Coping: ${answers.stressCoping}`
          }
        ],

        adherence: [
          {
            regimenId: "general-stack", // Placeholder until we load real regimens
            adherent: (answers.supplementAdherence as number) > 5,
            notes: `Adherence Days: ${answers.supplementAdherence}. Issues: ${answers.supplementIssues || 'None'}`
          }
        ]
      }

      console.log("Submitting Payload:", payload);

      const res = await fetch("http://localhost:3001/concierge/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error("Failed to submit check-in");
      }

      const data = await res.json();
      console.log("Success:", data);
      router.push("/dashboard?checkin=success");

    } catch (err) {
      console.error(err);
      alert("Error submitting check-in. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case "mood":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                How are you feeling overall this week? (1-10)
              </h3>
              <div className="space-y-4">
                <Slider
                  value={[answers.mood as number]}
                  onValueChange={(value) => setAnswers({ ...answers, mood: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 - Very Poor</span>
                  <span className="text-2xl font-bold text-primary">{answers.mood as number}</span>
                  <span>10 - Excellent</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "sleep":
        return (
          <div className="space-y-6">
            {sleepQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-medium text-foreground mb-4">{q.question}</h3>
                {q.type === "slider" ? (
                  <div className="space-y-4">
                    <Slider
                      value={[answers.sleepHours as number]}
                      onValueChange={(value) => setAnswers({ ...answers, sleepHours: value[0] })}
                      min={q.min}
                      max={q.max}
                      step={0.5}
                    />
                    <div className="text-center text-2xl font-bold text-primary">{answers.sleepHours} hours</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setAnswers({ ...answers, [q.id === "quality" ? "sleepQuality" : "sleepIssues"]: opt })
                        }
                        className={`p-3 border text-left transition-colors ${answers[q.id === "quality" ? "sleepQuality" : "sleepIssues"] === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "nutrition":
        return (
          <div className="space-y-6">
            {nutritionQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-medium text-foreground mb-4">{q.question}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers({ ...answers, [`nutrition${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers]: opt })
                      }
                      className={`p-3 border text-left transition-colors ${answers[`nutrition${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers] === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case "exercise":
        return (
          <div className="space-y-6">
            {exerciseQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-medium text-foreground mb-4">{q.question}</h3>
                {q.type === "slider" ? (
                  <div className="space-y-4">
                    <Slider
                      value={[answers.exerciseWorkouts as number]}
                      onValueChange={(value) => setAnswers({ ...answers, exerciseWorkouts: value[0] })}
                      min={q.min}
                      max={q.max}
                      step={1}
                    />
                    <div className="text-center text-2xl font-bold text-primary">
                      {answers.exerciseWorkouts} workouts
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setAnswers({
                            ...answers,
                            [`exercise${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers]: opt,
                          })
                        }
                        className={`p-3 border text-left transition-colors ${answers[`exercise${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers] === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "stress":
        return (
          <div className="space-y-6">
            {stressQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-medium text-foreground mb-4">{q.question}</h3>
                {q.type === "slider" ? (
                  <div className="space-y-4">
                    <Slider
                      value={[answers.stressLevel as number]}
                      onValueChange={(value) => setAnswers({ ...answers, stressLevel: value[0] })}
                      min={q.min}
                      max={q.max}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 - Very Low</span>
                      <span className="text-2xl font-bold text-primary">{answers.stressLevel}</span>
                      <span>10 - Very High</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setAnswers({ ...answers, [`stress${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers]: opt })
                        }
                        className={`p-3 border text-left transition-colors ${answers[`stress${q.id.charAt(0).toUpperCase() + q.id.slice(1)}` as keyof CheckInAnswers] === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "supplements":
        return (
          <div className="space-y-6">
            {supplementQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-medium text-foreground mb-4">{q.question}</h3>
                {q.type === "slider" ? (
                  <div className="space-y-4">
                    <Slider
                      value={[answers.supplementAdherence as number]}
                      onValueChange={(value) => setAnswers({ ...answers, supplementAdherence: value[0] })}
                      min={q.min}
                      max={q.max}
                      step={1}
                    />
                    <div className="text-center text-2xl font-bold text-primary">
                      {answers.supplementAdherence} days
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, supplementIssues: opt })}
                        className={`p-3 border text-left transition-colors ${answers.supplementIssues === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "notes":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Any additional notes or concerns you&apos;d like to share?
              </h3>
              <Textarea
                placeholder="Share anything else about how you're feeling, any changes you've noticed, questions for your care team, etc..."
                value={answers.additionalNotes as string}
                onChange={(e) => setAnswers({ ...answers, additionalNotes: e.target.value })}
                className="min-h-32 bg-muted/50 border-border"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Weekly Check-in</h1>
        <p className="text-muted-foreground">Let us know how you&apos;re doing this week</p>
      </div>

      {/* Progress */}
      <div className="border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">{steps[currentStep].title}</span>
        </div>
        <div className="h-2 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-border p-6 min-h-96">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="gap-2 bg-primary text-background hover:bg-primary/90">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-primary text-background hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Check-in"}
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
