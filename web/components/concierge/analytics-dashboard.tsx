"use client"

import { TrendingUp, TrendingDown, Users, Moon, Utensils, Dumbbell, Brain, Pill } from "lucide-react"

const overviewStats = [
  { label: "Total Active Patients", value: "47", change: "+8%", trend: "up" },
  { label: "Avg Compliance Rate", value: "87%", change: "+3%", trend: "up" },
  { label: "Check-ins This Month", value: "156", change: "-2%", trend: "down" },
  { label: "Avg Response Time", value: "3.8h", change: "-15%", trend: "up" },
]

const pillarAverages = [
  { name: "Sleep", icon: Moon, average: 74, change: "+5%", trend: "up" },
  { name: "Nutrition", icon: Utensils, average: 78, change: "+2%", trend: "up" },
  { name: "Exercise", icon: Dumbbell, average: 82, change: "+8%", trend: "up" },
  { name: "Stress", icon: Brain, average: 62, change: "-3%", trend: "down" },
  { name: "Supplements", icon: Pill, average: 89, change: "+1%", trend: "stable" },
]

const topPatients = [
  { name: "Robert Garcia", compliance: 98, trend: "up" },
  { name: "Michael Chen", compliance: 92, trend: "up" },
  { name: "William Martinez", compliance: 85, trend: "stable" },
]

const attentionNeeded = [
  { name: "James Wilson", issue: "Missed 3 check-ins", severity: "high" },
  { name: "David Thompson", issue: "Low stress score", severity: "medium" },
]

// Weekly trend data
const weeklyTrends = [
  { day: "Mon", checkins: 24, compliance: 85 },
  { day: "Tue", checkins: 28, compliance: 87 },
  { day: "Wed", checkins: 22, compliance: 84 },
  { day: "Thu", checkins: 31, compliance: 89 },
  { day: "Fri", checkins: 26, compliance: 86 },
  { day: "Sat", checkins: 15, compliance: 82 },
  { day: "Sun", checkins: 10, compliance: 80 },
]

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export function AnalyticsDashboard() {
  const maxCheckins = Math.max(...weeklyTrends.map((d) => d.checkins))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track patient trends and performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="bg-background p-6">
            <p className="text-xs font-mono uppercase text-muted-foreground">{stat.label}</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span
                className={`text-sm flex items-center gap-1 ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : stat.trend === "down" ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Trends Chart */}
        <div className="col-span-2 border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">Weekly Check-in Trends</h2>
          </div>
          <div className="p-6">
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-4">
              {weeklyTrends.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{day.checkins}</span>
                    <div
                      className="w-full bg-primary/80 hover:bg-primary transition-colors"
                      style={{ height: `${(day.checkins / maxCheckins) * 150}px` }}
                    />
                  </div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary" />
                <span className="text-sm text-muted-foreground">Check-ins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Pillars Average */}
        <div className="border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">Health Pillar Averages</h2>
            <p className="text-xs text-muted-foreground">Across all patients</p>
          </div>
          <div className="p-4 space-y-4">
            {pillarAverages.map((pillar) => (
              <div key={pillar.name} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <pillar.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{pillar.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(pillar.average)}`}>{pillar.average}%</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div className={`h-full ${getScoreBg(pillar.average)}`} style={{ width: `${pillar.average}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-foreground">Top Performers</h2>
          </div>
          <div className="divide-y divide-border">
            {topPatients.map((patient, index) => (
              <div key={patient.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground">{patient.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-500">{patient.compliance}%</span>
                  {patient.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-foreground">Needs Attention</h2>
          </div>
          <div className="divide-y divide-border">
            {attentionNeeded.map((patient) => (
              <div key={patient.name} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.issue}</p>
                </div>
                <span
                  className={`text-xs font-mono uppercase px-2 py-1 ${
                    patient.severity === "high" ? "text-red-500 bg-red-500/10" : "text-yellow-500 bg-yellow-500/10"
                  }`}
                >
                  {patient.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
