"use client"

import Link from "next/link"
import {
  Users,
  AlertTriangle,
  FileText,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MedicationRequests } from "./medication-requests"

const stats = [
  { label: "Total Active Patients", value: "127", change: "+12 this month", icon: Users },
  { label: "Needs Clinical Review", value: "4", change: "Action required", icon: AlertTriangle, alert: true },
  { label: "Pending Lab Reviews", value: "8", change: "3 flagged", icon: FileText },
  { label: "Prescriptions This Week", value: "23", change: "+8 vs last week", icon: ClipboardCheck },
]

const needsReview = [
  {
    id: "1",
    name: "David Thompson",
    reason: "Elevated Hematocrit",
    value: "52%",
    urgency: "high",
    lastReview: "2 weeks ago",
  },
  {
    id: "2",
    name: "James Wilson",
    reason: "Missed 3 Check-ins",
    value: "Non-compliant",
    urgency: "medium",
    lastReview: "1 month ago",
  },
  {
    id: "3",
    name: "Mark Anderson",
    reason: "Low Free T Despite TRT",
    value: "8 pg/mL",
    urgency: "high",
    lastReview: "1 week ago",
  },
  {
    id: "4",
    name: "Peter Brown",
    reason: "Reported Side Effects",
    value: "Mood changes",
    urgency: "medium",
    lastReview: "3 days ago",
  },
]

const recentLabs = [
  {
    id: "1",
    name: "Michael Chen",
    date: "Today",
    status: "optimal",
    summary: "All markers in range",
    totalT: 850,
    freeT: 22,
  },
  {
    id: "2",
    name: "Robert Garcia",
    date: "Yesterday",
    status: "optimal",
    summary: "Excellent response to treatment",
    totalT: 920,
    freeT: 25,
  },
  {
    id: "3",
    name: "David Thompson",
    date: "2 days ago",
    status: "flagged",
    summary: "Hematocrit elevated - review needed",
    totalT: 780,
    freeT: 19,
  },
]

const populationMetrics = [
  { label: "Avg Total T", value: "685 ng/dL", trend: "up", change: "+45" },
  { label: "Avg Free T", value: "18.2 pg/mL", trend: "up", change: "+2.1" },
  { label: "Compliance Rate", value: "87%", trend: "up", change: "+3%" },
  { label: "Satisfaction Score", value: "4.8/5", trend: "stable", change: "0" },
]

export function ProviderDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Provider Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Miller. Here&apos;s your clinical overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.alert ? "text-red-500" : "text-foreground"}`}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${stat.alert ? "text-red-500/80" : "text-muted-foreground"}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-2 ${stat.alert ? "bg-red-500/10" : "bg-muted"}`}>
                <stat.icon className={`w-5 h-5 ${stat.alert ? "text-red-500" : "text-muted-foreground"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Needs Clinical Review */}
        <div className="col-span-2 border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between bg-red-500/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-foreground">Needs Clinical Review</h2>
            </div>
            <Link href="/provider/review" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {needsReview.map((patient) => (
              <div
                key={patient.id}
                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 ${patient.urgency === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold ${patient.urgency === "high" ? "text-red-500" : "text-yellow-500"}`}>
                      {patient.value}
                    </p>
                    <p className="text-xs text-muted-foreground">Last: {patient.lastReview}</p>
                  </div>
                  <Link href={`/provider/patients/${patient.id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Population Metrics */}
        {/* <div className="border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">Population Metrics</h2>
            <p className="text-xs text-muted-foreground">Across all active patients</p>
          </div>
          <div className="divide-y divide-border">
            {populationMetrics.map((metric) => (
              <div key={metric.label} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-bold text-foreground">{metric.value}</p>
                </div>
                <div
                  className={`flex items-center gap-1 ${metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : metric.trend === "down" ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  <span className="text-sm">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}


        {/* Upcoming Appointments (New Feature) */}
        <div className="col-span-1 border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Next Appointments</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Consultation (Follow-up)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">10:00 AM</p>
                  <p className="text-xs text-green-600">Confirmed</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
                  <Sparkles className="w-3 h-3" />
                  Briefing Ready
                </div>
              </div>
              <Link href="/provider/consultations/2745a5aa-3da0-43a5-82cf-5759a72d968f">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  Start Visit
                </Button>
              </Link>
            </div>
          </div>
        </div>


        {/* Medication Requests */}
        <MedicationRequests compact />

        {/* Recent Labs */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Recent Lab Results</h2>
            <Link href="/provider/labs" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border">
            {recentLabs.map((lab) => (
              <div
                key={lab.id}
                className={`bg-background p-4 ${lab.status === "flagged" ? "border-l-2 border-red-500" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{lab.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {lab.date}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono uppercase px-2 py-1 ${lab.status === "optimal" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                      }`}
                  >
                    {lab.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lab.summary}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Total T</p>
                    <p className="font-bold text-foreground">{lab.totalT} ng/dL</p>
                  </div>
                  <div className="bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Free T</p>
                    <p className="font-bold text-foreground">{lab.freeT} pg/mL</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
