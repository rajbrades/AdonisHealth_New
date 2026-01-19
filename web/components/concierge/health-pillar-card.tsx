"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface HealthPillarCardProps {
  name: string
  icon: LucideIcon
  score: number
  trend: string
  lastUpdate: string
  data: number[]
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
      return <Minus className="w-3 h-3 text-muted-foreground" />
  }
}

export function HealthPillarCard({ name, icon: Icon, score, trend, lastUpdate, data }: HealthPillarCardProps) {
  return (
    <div className="border border-border p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
        <div className="flex items-center gap-1">{getTrendIcon(trend)}</div>
      </div>

      {/* Mini Sparkline */}
      <div className="h-8 flex items-end gap-0.5 mb-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 bg-primary/30" style={{ height: `${(value / 100) * 100}%` }} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{lastUpdate}</p>
    </div>
  )
}
