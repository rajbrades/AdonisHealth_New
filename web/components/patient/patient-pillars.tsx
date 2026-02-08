"use client"

import { Moon, Utensils, Dumbbell, Brain, Pill, TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const pillarsData = {
  sleep: {
    icon: Moon,
    label: "Sleep",
    score: 85,
    trend: "up",
    change: "+5%",
    description: "Your sleep has improved significantly this month",
    weeklyData: [72, 78, 80, 75, 82, 85, 85],
    tips: [
      "Maintain your consistent bedtime routine",
      "Keep avoiding screens 1 hour before bed",
      "Consider adding magnesium supplementation",
    ],
    metrics: [
      { label: "Avg Hours", value: "7.2h" },
      { label: "Quality", value: "Good" },
      { label: "Consistency", value: "High" },
    ],
  },
  nutrition: {
    icon: Utensils,
    label: "Nutrition",
    score: 72,
    trend: "stable",
    change: "+2%",
    description: "Steady progress, room for improvement in protein intake",
    weeklyData: [68, 70, 72, 71, 70, 73, 72],
    tips: [
      "Increase protein intake to 1g per lb of body weight",
      "Add more vegetables to each meal",
      "Track your macros for better awareness",
    ],
    metrics: [
      { label: "Protein", value: "145g/day" },
      { label: "Hydration", value: "3L/day" },
      { label: "Meal Timing", value: "Good" },
    ],
  },
  exercise: {
    icon: Dumbbell,
    label: "Exercise",
    score: 90,
    trend: "up",
    change: "+8%",
    description: "Excellent workout consistency and progressive overload",
    weeklyData: [82, 85, 88, 87, 89, 90, 90],
    tips: [
      "Great job maintaining 5 workouts per week",
      "Consider adding a deload week next month",
      "Focus on compound movements for strength",
    ],
    metrics: [
      { label: "Workouts/Week", value: "5" },
      { label: "Intensity", value: "High" },
      { label: "Recovery", value: "Good" },
    ],
  },
  stress: {
    icon: Brain,
    label: "Stress",
    score: 65,
    trend: "down",
    change: "-3%",
    description: "Stress levels are elevated, focus on recovery strategies",
    weeklyData: [55, 58, 60, 62, 63, 64, 65],
    tips: [
      "Practice 10 minutes of daily meditation",
      "Take short breaks during work hours",
      "Consider speaking with your concierge about stress management",
    ],
    metrics: [
      { label: "Level", value: "Moderate" },
      { label: "Main Source", value: "Work" },
      { label: "Coping", value: "Active" },
    ],
  },
  supplements: {
    icon: Pill,
    label: "Supplements",
    score: 95,
    trend: "stable",
    change: "+1%",
    description: "Excellent adherence to your supplement protocol",
    weeklyData: [92, 94, 95, 95, 94, 95, 95],
    tips: [
      "Keep up the great consistency",
      "Set reminders if you haven't already",
      "Store supplements in visible locations",
    ],
    metrics: [
      { label: "Adherence", value: "98%" },
      { label: "Timing", value: "Consistent" },
      { label: "Side Effects", value: "None" },
    ],
  },
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-400"  // Muted green for dark theme
  if (score >= 60) return "text-[#FCD24E]"    // Adonis yellow
  return "text-rose-400"                       // Muted red for dark theme
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500"    // Muted green
  if (score >= 60) return "bg-[#FCD24E]"      // Adonis yellow
  return "bg-rose-500"                         // Muted red
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-emerald-400" />
    case "down":
      return <TrendingDown className="w-4 h-4 text-rose-400" />
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />
  }
}

export function PatientPillars() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Pillars</h1>
        <p className="text-muted-foreground">Track your progress across all wellness dimensions</p>
      </div>

      {/* Pillars */}
      <div className="space-y-6">
        {Object.entries(pillarsData).map(([key, pillar]) => {
          const Icon = pillar.icon

          return (
            <div key={key} className="border border-border">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{pillar.label}</h2>
                      <p className="text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getScoreColor(pillar.score)}`}>{pillar.score}%</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getTrendIcon(pillar.trend)}
                      <span
                        className={`text-sm ${pillar.trend === "up" ? "text-emerald-400" : pillar.trend === "down" ? "text-rose-400" : "text-muted-foreground"}`}
                      >
                        {pillar.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Weekly Chart */}
                  <div>
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-3">7-Day Trend</p>
                    <TooltipProvider>
                      <div className="h-24 flex items-end gap-1">
                        {pillar.weeklyData.map((value, index) => {
                          // Convert percentage (0-100) to 1-10 scale with one decimal
                          const rating = ((value / 100) * 10).toFixed(1)

                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex-1 ${getScoreBg(value)} hover:opacity-80 transition-opacity cursor-pointer`}
                                  style={{ height: `${value}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs font-semibold">Rating: {rating}/10</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipProvider>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>7d ago</span>
                      <span>Today</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-3">Key Metrics</p>
                    <div className="space-y-2">
                      {pillar.metrics.map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="text-sm font-medium text-foreground">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Recommendations
                    </p>
                    <ul className="space-y-2">
                      {pillar.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
