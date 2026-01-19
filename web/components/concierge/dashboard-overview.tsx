"use client"

import { Users, ClipboardCheck, AlertTriangle, TrendingUp, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Total Patients", value: "47", change: "+3 this week", icon: Users },
  { label: "Pending Check-ins", value: "12", change: "5 overdue", icon: ClipboardCheck, alert: true },
  { label: "Alerts", value: "4", change: "Requires attention", icon: AlertTriangle, alert: true },
  { label: "Avg. Compliance", value: "87%", change: "+2% vs last month", icon: TrendingUp },
]

const recentPatients = [
  {
    id: "1",
    name: "Michael Chen",
    lastCheckin: "2 hours ago",
    status: "On Track",
    pillars: { sleep: 85, nutrition: 72, exercise: 90, stress: 65 },
  },
  {
    id: "2",
    name: "David Thompson",
    lastCheckin: "1 day ago",
    status: "Needs Attention",
    pillars: { sleep: 45, nutrition: 80, exercise: 60, stress: 40 },
  },
  {
    id: "3",
    name: "James Wilson",
    lastCheckin: "3 days ago",
    status: "Overdue",
    pillars: { sleep: 70, nutrition: 65, exercise: 55, stress: 72 },
  },
  {
    id: "4",
    name: "Robert Garcia",
    lastCheckin: "5 hours ago",
    status: "On Track",
    pillars: { sleep: 92, nutrition: 88, exercise: 95, stress: 78 },
  },
]

const pendingTasks = [
  { id: "1", type: "Check-in Review", patient: "David Thompson", priority: "High", time: "30 min ago" },
  { id: "2", type: "Lab Results", patient: "Michael Chen", priority: "Medium", time: "2 hours ago" },
  { id: "3", type: "Message", patient: "James Wilson", priority: "Low", time: "1 day ago" },
]

function getPillarColor(value: number) {
  if (value >= 80) return "bg-green-500"
  if (value >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

function getStatusColor(status: string) {
  switch (status) {
    case "On Track":
      return "text-green-500 bg-green-500/10"
    case "Needs Attention":
      return "text-yellow-500 bg-yellow-500/10"
    case "Overdue":
      return "text-red-500 bg-red-500/10"
    default:
      return "text-muted-foreground bg-muted"
  }
}

export function ConciergeDashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Sarah. Here&apos;s your overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.alert ? "text-primary" : "text-foreground"}`}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${stat.alert ? "text-primary/80" : "text-muted-foreground"}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-2 ${stat.alert ? "bg-primary/10" : "bg-muted"}`}>
                <stat.icon className={`w-5 h-5 ${stat.alert ? "text-primary" : "text-muted-foreground"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="col-span-2 border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Recent Patients</h2>
            <Link href="/concierge/patients" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/concierge/patients/${patient.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center">
                    <span className="text-sm font-bold text-muted-foreground">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Last check-in: {patient.lastCheckin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {/* Health Pillars Mini View */}
                  <div className="flex items-center gap-1">
                    {Object.entries(patient.pillars).map(([key, value]) => (
                      <div key={key} className={`w-2 h-6 ${getPillarColor(value)}`} title={`${key}: ${value}%`} />
                    ))}
                  </div>
                  <span className={`text-xs font-mono uppercase px-2 py-1 ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Pending Tasks</h2>
            <span className="text-xs font-mono uppercase text-primary bg-primary/10 px-2 py-1">
              {pendingTasks.length} items
            </span>
          </div>
          <div className="divide-y divide-border">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{task.type}</p>
                    <p className="text-sm text-muted-foreground">{task.patient}</p>
                  </div>
                  <span
                    className={`text-xs font-mono uppercase px-2 py-1 ${
                      task.priority === "High"
                        ? "text-red-500 bg-red-500/10"
                        : task.priority === "Medium"
                          ? "text-yellow-500 bg-yellow-500/10"
                          : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {task.time}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full bg-transparent">
              View All Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
