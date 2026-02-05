"use client"

import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Pill,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Moon,
  Utensils,
  Dumbbell,
  Brain,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { TimelineFeed } from "@/components/patient/timeline-feed"

// Mock patient data
const patientData = {
  id: "1",
  name: "Michael Chen",
  age: 42,
  program: "TRT + Optimization",
  startDate: "Aug 15, 2025",
  concierge: "Sarah Johnson",
  lastVisit: "Dec 1, 2025",
  status: "On Track",

  // Clinical Summary
  diagnosis: "Hypogonadism, secondary",
  chiefComplaint: "Fatigue, decreased libido, difficulty building muscle",
  treatmentGoals: ["Optimize testosterone levels", "Improve energy and vitality", "Support muscle development"],

  // Current Protocol
  medications: [
    { name: "Testosterone Cypionate", dose: "150mg", frequency: "Weekly (split BIW)", route: "IM", since: "Aug 2025" },
    { name: "HCG", dose: "500 IU", frequency: "2x/week", route: "SQ", since: "Aug 2025" },
    { name: "Anastrozole", dose: "0.5mg", frequency: "PRN", route: "PO", since: "Sep 2025" },
  ],

  // Lab Trends
  labHistory: [
    { date: "Dec 15, 2025", totalT: 850, freeT: 22, e2: 28, hct: 48, psa: 0.8 },
    { date: "Oct 15, 2025", totalT: 720, freeT: 18, e2: 32, hct: 46, psa: 0.7 },
    { date: "Aug 15, 2025", totalT: 280, freeT: 6, e2: 18, hct: 42, psa: 0.6 },
  ],

  // Health Pillars Summary
  pillars: {
    sleep: { score: 85, trend: "up" },
    nutrition: { score: 72, trend: "stable" },
    exercise: { score: 90, trend: "up" },
    stress: { score: 65, trend: "down" },
    supplements: { score: 95, trend: "stable" },
  },

  // Recent Notes
  recentNotes: [
    {
      date: "Dec 15, 2025",
      author: "Sarah J.",
      note: "Patient reports significant improvement in energy. Sleep quality improving.",
    },
    {
      date: "Dec 1, 2025",
      author: "Dr. Miller",
      note: "Labs excellent. Continue current protocol. Recheck in 8 weeks.",
    },
  ],

  // Alerts
  alerts: [],

  // Compliance
  compliance: {
    medicationAdherence: 95,
    checkinCompletion: 100,
    labCompletion: 100,
  },
}

const pillarConfig = {
  sleep: { icon: Moon, label: "Sleep" },
  nutrition: { icon: Utensils, label: "Nutrition" },
  exercise: { icon: Dumbbell, label: "Exercise" },
  stress: { icon: Brain, label: "Stress" },
  supplements: { icon: Activity, label: "Supplements" },
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-3 h-3 text-green-500" />
    case "down":
      return <TrendingDown className="w-3 h-3 text-red-500" />
    default:
      return null
  }
}

export function PatientOnePager({ patientId }: { patientId: string }) {
  const [clinicalNote, setClinicalNote] = useState("")

  const latestLab = patientData.labHistory[0]
  const baselineLab = patientData.labHistory[patientData.labHistory.length - 1]

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/provider"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Patient Header - One Pager Style */}
      <div className="border border-border">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{patientData.name}</h1>
                <span className="text-xs font-mono uppercase px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/30">
                  {patientData.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                {patientData.age}yo • {patientData.program} • Since {patientData.startDate}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="text-foreground">Dx:</span> {patientData.diagnosis}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Wellness Concierge</p>
              <p className="font-medium text-foreground">{patientData.concierge}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-px bg-border">
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Medication</p>
            <p className="text-xl font-bold text-foreground">{patientData.compliance.medicationAdherence}%</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Check-ins</p>
            <p className="text-xl font-bold text-foreground">{patientData.compliance.checkinCompletion}%</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Total T</p>
            <p className="text-xl font-bold text-green-500">{latestLab.totalT}</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Free T</p>
            <p className="text-xl font-bold text-green-500">{latestLab.freeT}</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">E2</p>
            <p className="text-xl font-bold text-foreground">{latestLab.e2}</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">HCT</p>
            <p className="text-xl font-bold text-foreground">{latestLab.hct}%</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Clinical Info */}
        <div className="col-span-2 space-y-6">
          {/* Current Protocol */}
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Current Protocol</h2>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-mono uppercase text-muted-foreground border-b border-border">
                    <th className="text-left pb-2">Medication</th>
                    <th className="text-left pb-2">Dose</th>
                    <th className="text-left pb-2">Frequency</th>
                    <th className="text-left pb-2">Route</th>
                    <th className="text-left pb-2">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.medications.map((med) => (
                    <tr key={med.name} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{med.name}</td>
                      <td className="py-3 text-foreground">{med.dose}</td>
                      <td className="py-3 text-foreground">{med.frequency}</td>
                      <td className="py-3 text-foreground">{med.route}</td>
                      <td className="py-3 text-muted-foreground">{med.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Trends */}
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">Lab Trends</h2>
              </div>
              <span className="text-xs text-muted-foreground">Baseline → Current</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {[
                  {
                    label: "Total T",
                    baseline: baselineLab.totalT,
                    current: latestLab.totalT,
                    unit: "ng/dL",
                    range: "300-1000",
                  },
                  {
                    label: "Free T",
                    baseline: baselineLab.freeT,
                    current: latestLab.freeT,
                    unit: "pg/mL",
                    range: "9-30",
                  },
                  {
                    label: "Estradiol",
                    baseline: baselineLab.e2,
                    current: latestLab.e2,
                    unit: "pg/mL",
                    range: "10-40",
                  },
                  { label: "Hematocrit", baseline: baselineLab.hct, current: latestLab.hct, unit: "%", range: "38-50" },
                  { label: "PSA", baseline: baselineLab.psa, current: latestLab.psa, unit: "ng/mL", range: "0-4" },
                ].map((lab) => {
                  const change = lab.current - lab.baseline
                  const changePercent = ((change / lab.baseline) * 100).toFixed(0)
                  return (
                    <div key={lab.label} className="bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">{lab.label}</p>
                      <p className="text-xl font-bold text-foreground">
                        {lab.current}
                        <span className="text-xs font-normal text-muted-foreground ml-1">{lab.unit}</span>
                      </p>
                      <p
                        className={`text-xs ${change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {change > 0 ? "+" : ""}
                        {changePercent}% from baseline
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Ref: {lab.range}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-foreground">Patient Timeline</h2>
            </div>

            {/* Quick Note Entry */}
            <div className="p-4 border-b border-border bg-muted/10">
              <Textarea
                placeholder="Add a quick note..."
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                className="bg-background border-border mb-2 min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button size="sm" className="bg-primary text-background hover:bg-primary/90">Post Note</Button>
              </div>
            </div>

            <div className="p-4">
              <TimelineFeed patientId={patientId} />
            </div>
          </div>
        </div>

        {/* Right Column - Health Summary */}
        <div className="space-y-6">
          {/* Alerts */}
          {patientData.alerts.length > 0 ? (
            <div className="border border-red-500/50 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-red-500">Clinical Alerts</h3>
              </div>
              {/* Alert content would go here */}
            </div>
          ) : (
            <div className="border border-green-500/50 bg-green-500/5 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 font-medium">No clinical alerts</p>
              </div>
            </div>
          )}

          {/* Health Pillars */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-foreground">Health Pillars</h2>
              <p className="text-xs text-muted-foreground">Patient-reported wellness metrics</p>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(patientData.pillars).map(([key, pillar]) => {
                const config = pillarConfig[key as keyof typeof pillarConfig]
                const Icon = config.icon
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(pillar.score)}`}>{pillar.score}%</span>
                      {getTrendIcon(pillar.trend)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Treatment Goals */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-foreground">Treatment Goals</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {patientData.treatmentGoals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-border p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <FileText className="w-4 h-4" /> Order Labs
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Pill className="w-4 h-4" /> Adjust Protocol
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Clock className="w-4 h-4" /> Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
