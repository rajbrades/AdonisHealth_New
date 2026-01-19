"use client"

import { X, Moon, Utensils, Dumbbell, Brain, Pill, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface CheckinDetailModalProps {
  checkin: {
    id: string
    patientId: string
    patientName: string
    submittedAt: string
    status: string
    priority: string
    pillars: { sleep: number; nutrition: number; exercise: number; stress: number; supplements: number }
    overallMood: number
    notes: string
    flags: string[]
  }
  onClose: () => void
}

const pillarDetails = {
  sleep: {
    icon: Moon,
    label: "Sleep",
    questions: [
      { q: "Average hours of sleep", a: "7.2 hours" },
      { q: "Sleep quality", a: "Good - minimal interruptions" },
      { q: "Time to fall asleep", a: "15-20 minutes" },
    ],
  },
  nutrition: {
    icon: Utensils,
    label: "Nutrition",
    questions: [
      { q: "Daily protein intake", a: "145g average" },
      { q: "Water consumption", a: "3L daily" },
      { q: "Meal consistency", a: "4 meals/day on schedule" },
    ],
  },
  exercise: {
    icon: Dumbbell,
    label: "Exercise",
    questions: [
      { q: "Workouts this week", a: "5 sessions" },
      { q: "Training intensity", a: "High - progressive overload" },
      { q: "Recovery feeling", a: "Good, minimal soreness" },
    ],
  },
  stress: {
    icon: Brain,
    label: "Stress",
    questions: [
      { q: "Overall stress level", a: "Moderate (6/10)" },
      { q: "Main stressors", a: "Work deadlines" },
      { q: "Coping strategies used", a: "Meditation, exercise" },
    ],
  },
  supplements: {
    icon: Pill,
    label: "Supplements",
    questions: [
      { q: "Adherence rate", a: "95% this week" },
      { q: "Any missed doses", a: "1 missed vitamin D dose" },
      { q: "Side effects", a: "None reported" },
    ],
  },
}

function getPillarColor(value: number) {
  if (value >= 80) return "text-green-500 bg-green-500/10"
  if (value >= 60) return "text-yellow-500 bg-yellow-500/10"
  return "text-red-500 bg-red-500/10"
}

export function CheckinDetailModal({ checkin, onClose }: CheckinDetailModalProps) {
  const [responseNote, setResponseNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-background z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">Check-in Review</h2>
            <p className="text-muted-foreground">
              {checkin.patientName} • Submitted {checkin.submittedAt}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Flags Alert */}
          {checkin.flags.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-500">Attention Required</h3>
                  <ul className="mt-2 space-y-1">
                    {checkin.flags.map((flag) => (
                      <li key={flag} className="text-sm text-red-400">
                        • {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Overall Mood & Notes */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-border p-4">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Overall Mood</p>
              <p
                className={`text-4xl font-bold ${
                  checkin.overallMood >= 7
                    ? "text-green-500"
                    : checkin.overallMood >= 5
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {checkin.overallMood}/10
              </p>
            </div>
            <div className="border border-border p-4">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Patient Notes</p>
              <p className="text-foreground">{checkin.notes}</p>
            </div>
          </div>

          {/* Health Pillars Detail */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Health Pillars Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(checkin.pillars).map(([key, value]) => {
                const detail = pillarDetails[key as keyof typeof pillarDetails]
                const Icon = detail.icon

                return (
                  <div key={key} className="border border-border">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{detail.label}</span>
                      </div>
                      <span className={`text-2xl font-bold px-3 py-1 ${getPillarColor(value)}`}>{value}%</span>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-4">
                      {detail.questions.map((item) => (
                        <div key={item.q}>
                          <p className="text-xs text-muted-foreground mb-1">{item.q}</p>
                          <p className="text-sm font-medium text-foreground">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Response Section */}
          <div className="border border-border p-4">
            <h3 className="font-bold text-foreground mb-4">Concierge Response</h3>
            <Textarea
              placeholder="Add notes or recommendations for the patient..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              className="bg-muted/50 border-border min-h-24 mb-4"
            />
            <div className="flex items-center justify-between">
              <Button variant="outline" className="gap-2 bg-transparent">
                <MessageSquare className="w-4 h-4" /> Send Message to Patient
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose} className="bg-transparent">
                  Cancel
                </Button>
                <Button
                  className="gap-2 bg-primary text-background hover:bg-primary/90"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? "Marking..." : "Mark as Reviewed"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
