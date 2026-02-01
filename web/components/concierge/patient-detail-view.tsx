"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  ClipboardCheck,
  FileText,
  Edit,
  Moon,
  Utensils,
  Dumbbell,
  Brain,
  Pill,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthPillarCard } from "./health-pillar-card"
import { MedicationsList } from "./medications-list"
import { PatientTimeline } from "./patient-timeline"

// Mock patient data
const patientData = {
  id: "1",
  name: "Michael Chen",
  email: "michael.chen@email.com",
  phone: "(555) 123-4567",
  age: 42,
  dob: "1984-03-15",
  program: "TRT + Optimization",
  startDate: "2025-08-15",
  status: "On Track",
  compliance: 92,
  provider: "Dr. James Miller",
  lastCheckin: "2 hours ago",
  nextCheckin: "In 5 days",
  goals: ["Increase energy", "Improve sleep quality", "Build muscle mass", "Reduce stress"],
  pillars: {
    sleep: {
      score: 85,
      trend: "up",
      lastUpdate: "2 hours ago",
      metrics: {
        avgHours: 7.2,
        quality: "Good",
        consistency: "High",
      },
      recentData: [72, 78, 80, 75, 82, 85, 85],
    },
    nutrition: {
      score: 72,
      trend: "stable",
      lastUpdate: "2 hours ago",
      metrics: {
        proteinIntake: "145g/day",
        hydration: "Good",
        mealTiming: "Moderate",
      },
      recentData: [68, 70, 72, 71, 70, 73, 72],
    },
    exercise: {
      score: 90,
      trend: "up",
      lastUpdate: "1 day ago",
      metrics: {
        weeklyWorkouts: 5,
        intensity: "High",
        recovery: "Good",
      },
      recentData: [82, 85, 88, 87, 89, 90, 90],
    },
    stress: {
      score: 65,
      trend: "down",
      lastUpdate: "2 hours ago",
      metrics: {
        level: "Moderate",
        copingStrategies: "Active",
        workLifeBalance: "Improving",
      },
      recentData: [55, 58, 60, 62, 63, 64, 65],
    },
    supplements: {
      score: 95,
      trend: "stable",
      lastUpdate: "1 day ago",
      metrics: {
        adherence: "98%",
        timing: "Consistent",
        sideEffects: "None",
      },
      recentData: [92, 94, 95, 95, 94, 95, 95],
    },
  },
  medications: [
    {
      name: "Testosterone Cypionate",
      dosage: "150mg",
      frequency: "Weekly (BIW)",
      route: "IM",
      status: "Active",
      startDate: "2025-08-15",
    },
    {
      name: "HCG",
      dosage: "500 IU",
      frequency: "Twice Weekly",
      route: "SQ",
      status: "Active",
      startDate: "2025-08-15",
    },
    {
      name: "Anastrozole",
      dosage: "0.5mg",
      frequency: "As needed",
      route: "PO",
      status: "PRN",
      startDate: "2025-09-01",
    },
    {
      name: "Vitamin D3",
      dosage: "5000 IU",
      frequency: "Daily",
      route: "PO",
      status: "Active",
      startDate: "2025-08-15",
    },
    { name: "Fish Oil", dosage: "2000mg", frequency: "Daily", route: "PO", status: "Active", startDate: "2025-08-15" },
  ],
  labResults: {
    lastTest: "2025-12-15",
    totalT: { value: 850, unit: "ng/dL", range: "300-1000", status: "optimal" },
    freeT: { value: 22, unit: "pg/mL", range: "9-30", status: "optimal" },
    estradiol: { value: 28, unit: "pg/mL", range: "10-40", status: "optimal" },
    hematocrit: { value: 48, unit: "%", range: "38-50", status: "normal" },
    psa: { value: 0.8, unit: "ng/mL", range: "0-4", status: "normal" },
  },
}

const pillarConfig = {
  sleep: { icon: Moon, label: "Sleep", color: "blue" },
  nutrition: { icon: Utensils, label: "Nutrition", color: "green" },
  exercise: { icon: Dumbbell, label: "Exercise", color: "orange" },
  stress: { icon: Brain, label: "Stress", color: "purple" },
  supplements: { icon: Pill, label: "Supplements", color: "cyan" },
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "On Track":
      return "text-green-500 bg-green-500/10 border-green-500/30"
    case "Needs Attention":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
    case "Overdue":
      return "text-red-500 bg-red-500/10 border-red-500/30"
    default:
      return "text-muted-foreground bg-muted border-border"
  }
}

export function PatientDetailView({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate overall health score
  const overallScore = Math.round(
    Object.values(patientData.pillars).reduce((sum, pillar) => sum + pillar.score, 0) /
      Object.keys(patientData.pillars).length,
  )

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/concierge/patients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="border border-border">
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {patientData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{patientData.name}</h1>
                <span className={`text-xs font-mono uppercase px-2 py-1 border ${getStatusColor(patientData.status)}`}>
                  {patientData.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                {patientData.program} • Age {patientData.age}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {patientData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {patientData.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {patientData.goals.map((goal) => (
                  <span key={goal} className="text-xs bg-muted px-2 py-1 text-muted-foreground">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <MessageSquare className="w-4 h-4" /> Message
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ClipboardCheck className="w-4 h-4" /> Request Check-in
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileText className="w-4 h-4" /> View Labs
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-5 gap-px bg-border border-t border-border">
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Overall Score</p>
            <p className="text-2xl font-bold text-primary mt-1">{overallScore}%</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Compliance</p>
            <p className="text-2xl font-bold text-foreground mt-1">{patientData.compliance}%</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Last Check-in</p>
            <p className="text-lg font-medium text-foreground mt-1">{patientData.lastCheckin}</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Next Check-in</p>
            <p className="text-lg font-medium text-foreground mt-1">{patientData.nextCheckin}</p>
          </div>
          <div className="bg-background p-4 text-center">
            <p className="text-xs font-mono uppercase text-muted-foreground">Provider</p>
            <p className="text-lg font-medium text-foreground mt-1">{patientData.provider}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-border w-full justify-start gap-0 h-auto p-0">
          <TabsTrigger
            value="overview"
            className="bg-transparent border-0 border-b-4 border-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-3 font-semibold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="pillars"
            className="bg-transparent border-0 border-b-4 border-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-3 font-semibold"
          >
            Health Pillars
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="bg-transparent border-0 border-b-4 border-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-3 font-semibold"
          >
            Medications
          </TabsTrigger>
          <TabsTrigger
            value="labs"
            className="bg-transparent border-0 border-b-4 border-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-3 font-semibold"
          >
            Lab Results
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="bg-transparent border-0 border-b-4 border-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-3 font-semibold"
          >
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Health Pillars Grid */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Health Pillars</h2>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(patientData.pillars).map(([key, pillar]) => {
                const config = pillarConfig[key as keyof typeof pillarConfig]
                return (
                  <HealthPillarCard
                    key={key}
                    name={config.label}
                    icon={config.icon}
                    score={pillar.score}
                    trend={pillar.trend}
                    lastUpdate={pillar.lastUpdate}
                    data={pillar.recentData}
                  />
                )
              })}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Current Medications */}
            <div className="border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground">Current Medications</h2>
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {patientData.medications.filter((m) => m.status === "Active").length} active
                </span>
              </div>
              <div className="p-4 space-y-3">
                {patientData.medications.slice(0, 4).map((med) => (
                  <div key={med.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono uppercase px-2 py-1 ${
                        med.status === "Active" ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      {med.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Link href={`/concierge/patients/${patientId}/medications`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Medications
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Lab Results */}
            <div className="border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground">Recent Lab Results</h2>
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {patientData.labResults.lastTest}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(patientData.labResults)
                  .filter(([key]) => key !== "lastTest")
                  .map(([key, result]) => {
                    const lab = result as { value: number; unit: string; range: string; status: string }
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {key === "totalT"
                              ? "Total Testosterone"
                              : key === "freeT"
                                ? "Free Testosterone"
                                : key.charAt(0).toUpperCase() + key.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">Range: {lab.range}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            {lab.value} {lab.unit}
                          </p>
                          <span
                            className={`text-xs font-mono uppercase ${
                              lab.status === "optimal"
                                ? "text-green-500"
                                : lab.status === "normal"
                                  ? "text-foreground"
                                  : "text-yellow-500"
                            }`}
                          >
                            {lab.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <div className="p-4 border-t border-border">
                <Link href={`/concierge/patients/${patientId}/labs`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Full Report
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Health Pillars Tab */}
        <TabsContent value="pillars" className="mt-6 space-y-6">
          {Object.entries(patientData.pillars).map(([key, pillar]) => {
            const config = pillarConfig[key as keyof typeof pillarConfig]
            return (
              <div key={key} className="border border-border p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                      <config.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{config.label}</h3>
                      <p className="text-sm text-muted-foreground">Last updated {pillar.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground">{pillar.score}%</p>
                      <div className="flex items-center gap-1 justify-end">
                        {getTrendIcon(pillar.trend)}
                        <span className="text-sm text-muted-foreground capitalize">{pillar.trend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(pillar.metrics).map(([metricKey, metricValue]) => (
                    <div key={metricKey} className="bg-muted/50 p-4">
                      <p className="text-xs font-mono uppercase text-muted-foreground">
                        {metricKey.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-lg font-bold text-foreground mt-1">{metricValue}</p>
                    </div>
                  ))}
                </div>

                {/* Mini Chart */}
                <div className="mt-4 h-16 flex items-end gap-1">
                  {pillar.recentData.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors"
                      style={{ height: `${value}%` }}
                      title={`${value}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-6">
          <MedicationsList medications={patientData.medications} />
        </TabsContent>

        {/* Labs Tab */}
        <TabsContent value="labs" className="mt-6">
          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Lab Results</h2>
                <p className="text-muted-foreground">Last test: {patientData.labResults.lastTest}</p>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <FileText className="w-4 h-4" /> Download Report
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(patientData.labResults)
                .filter(([key]) => key !== "lastTest")
                .map(([key, result]) => {
                  const lab = result as { value: number; unit: string; range: string; status: string }
                  return (
                    <div key={key} className="border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-foreground">
                            {key === "totalT"
                              ? "Total Testosterone"
                              : key === "freeT"
                                ? "Free Testosterone"
                                : key.charAt(0).toUpperCase() + key.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">Reference: {lab.range}</p>
                        </div>
                        {lab.status === "optimal" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : lab.status === "normal" ? (
                          <CheckCircle className="w-5 h-5 text-foreground" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {lab.value}
                        <span className="text-lg font-normal text-muted-foreground ml-1">{lab.unit}</span>
                      </p>
                      <span
                        className={`text-xs font-mono uppercase mt-2 inline-block px-2 py-1 ${
                          lab.status === "optimal"
                            ? "text-green-500 bg-green-500/10"
                            : lab.status === "normal"
                              ? "text-foreground bg-muted"
                              : "text-yellow-500 bg-yellow-500/10"
                        }`}
                      >
                        {lab.status}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-6">
          <PatientTimeline />
        </TabsContent>
      </Tabs>
    </div>
  )
}
