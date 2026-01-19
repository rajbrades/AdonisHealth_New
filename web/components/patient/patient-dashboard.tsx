"use client"

import Link from "next/link"
import { Moon, Utensils, Dumbbell, Brain, Pill, ArrowRight, Calendar, MessageSquare, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const healthPillars = [
  { name: "Sleep", icon: Moon, score: 85, trend: "+5%", status: "Good" },
  { name: "Nutrition", icon: Utensils, score: 72, trend: "+2%", status: "Moderate" },
  { name: "Exercise", icon: Dumbbell, score: 90, trend: "+8%", status: "Excellent" },
  { name: "Stress", icon: Brain, score: 65, trend: "-3%", status: "Needs Work" },
  { name: "Supplements", icon: Pill, score: 95, trend: "+1%", status: "Excellent" },
]

const upcomingTasks = [
  { title: "Weekly Check-in", due: "In 5 days", type: "checkin" },
  { title: "Lab Work", due: "Jan 20, 2026", type: "lab" },
  { title: "Provider Consultation", due: "Jan 25, 2026", type: "appointment" },
]

const recentMessages = [
  { from: "Sarah J. (Concierge)", preview: "Great progress this week! Keep up the...", time: "2h ago" },
  { from: "Dr. Miller", preview: "Your latest lab results look excellent...", time: "2 days ago" },
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

export function PatientDashboard() {
  // Calculate overall score
  const overallScore = Math.round(healthPillars.reduce((sum, p) => sum + p.score, 0) / healthPillars.length)

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <div className="border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-muted-foreground">Overall Health Score</p>
            <p className={`text-5xl font-bold mt-2 ${getScoreColor(overallScore)}`}>{overallScore}%</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              +4% from last month
            </p>
          </div>
          <Link href="/patient/checkin">
            <Button className="gap-2 bg-primary text-background hover:bg-primary/90">
              Complete Check-in <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Health Pillars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Health Pillars</h2>
          <Link href="/patient/pillars" className="text-sm text-primary hover:underline flex items-center gap-1">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {healthPillars.map((pillar) => (
            <div key={pillar.name} className="border border-border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                  <pillar.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{pillar.name}</span>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(pillar.score)}`}>{pillar.score}%</p>
              <div className="h-2 bg-muted mt-2 mb-2">
                <div className={`h-full ${getScoreBg(pillar.score)}`} style={{ width: `${pillar.score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{pillar.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Upcoming</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {upcomingTasks.map((task) => (
              <div
                key={task.title}
                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.due}</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  {task.type === "checkin" ? "Start" : "View"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Messages</h2>
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {recentMessages.map((msg) => (
              <Link key={msg.from} href="/patient/messages" className="p-4 block hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{msg.from}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.preview}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <Link href="/patient/messages">
              <Button variant="outline" className="w-full bg-transparent">
                View All Messages
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Current Medications Quick View */}
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground">Current Medications</h2>
          <Link href="/patient/medications" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-px bg-border">
          {[
            { name: "Testosterone Cypionate", dose: "150mg", freq: "Weekly" },
            { name: "HCG", dose: "500 IU", freq: "2x/week" },
            { name: "Vitamin D3", dose: "5000 IU", freq: "Daily" },
            { name: "Fish Oil", dose: "2000mg", freq: "Daily" },
          ].map((med) => (
            <div key={med.name} className="bg-background p-4">
              <p className="font-medium text-foreground text-sm">{med.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {med.dose} • {med.freq}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
