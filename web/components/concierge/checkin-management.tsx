"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown, Eye, Clock, Moon, Utensils, Dumbbell, Brain, Pill } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckinDetailModal } from "./checkin-detail-modal"

const checkins = [
  {
    id: "1",
    patientId: "1",
    patientName: "Michael Chen",
    submittedAt: "Today, 2:30 PM",
    status: "pending",
    priority: "normal",
    pillars: { sleep: 85, nutrition: 72, exercise: 90, stress: 65, supplements: 95 },
    overallMood: 8,
    notes: "Feeling great this week. Energy levels are up.",
    flags: [],
  },
  {
    id: "2",
    patientId: "2",
    patientName: "David Thompson",
    submittedAt: "Yesterday, 4:15 PM",
    status: "pending",
    priority: "high",
    pillars: { sleep: 45, nutrition: 80, exercise: 60, stress: 40, supplements: 75 },
    overallMood: 5,
    notes: "Having trouble sleeping. Work stress is high.",
    flags: ["Low sleep score", "High stress"],
  },
  {
    id: "3",
    patientId: "4",
    patientName: "Robert Garcia",
    submittedAt: "Today, 9:00 AM",
    status: "reviewed",
    priority: "normal",
    pillars: { sleep: 92, nutrition: 88, exercise: 95, stress: 78, supplements: 100 },
    overallMood: 9,
    notes: "Excellent week. All metrics on track.",
    flags: [],
  },
  {
    id: "4",
    patientId: "5",
    patientName: "William Martinez",
    submittedAt: "2 days ago",
    status: "pending",
    priority: "medium",
    pillars: { sleep: 78, nutrition: 82, exercise: 88, stress: 70, supplements: 90 },
    overallMood: 7,
    notes: "Slight dip in motivation but maintaining routine.",
    flags: ["Decreased motivation noted"],
  },
  {
    id: "5",
    patientId: "3",
    patientName: "James Wilson",
    submittedAt: "3 days ago",
    status: "overdue",
    priority: "high",
    pillars: { sleep: 70, nutrition: 65, exercise: 55, stress: 72, supplements: 60 },
    overallMood: 6,
    notes: "Missed several workouts. Supplement compliance is down.",
    flags: ["Missed workouts", "Low supplement adherence"],
  },
]

const stats = [
  { label: "Pending Review", value: 3, color: "text-primary" },
  { label: "Reviewed Today", value: 5, color: "text-green-500" },
  { label: "Overdue", value: 2, color: "text-red-500" },
  { label: "Avg Response Time", value: "4.2h", color: "text-foreground" },
]

const pillarIcons = {
  sleep: Moon,
  nutrition: Utensils,
  exercise: Dumbbell,
  stress: Brain,
  supplements: Pill,
}

function getPillarColor(value: number) {
  if (value >= 80) return "bg-green-500"
  if (value >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return { text: "Pending", className: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30" }
    case "reviewed":
      return { text: "Reviewed", className: "text-green-500 bg-green-500/10 border-green-500/30" }
    case "overdue":
      return { text: "Overdue", className: "text-red-500 bg-red-500/10 border-red-500/30" }
    default:
      return { text: status, className: "text-muted-foreground bg-muted border-border" }
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return { text: "High", className: "text-red-500" }
    case "medium":
      return { text: "Medium", className: "text-yellow-500" }
    default:
      return { text: "Normal", className: "text-muted-foreground" }
  }
}

export function CheckinManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedCheckin, setSelectedCheckin] = useState<(typeof checkins)[0] | null>(null)

  const filteredCheckins = checkins.filter((checkin) => {
    const matchesSearch = checkin.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || checkin.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Check-in Management</h1>
        <p className="text-muted-foreground">Review and respond to patient check-ins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-4">
            <p className="text-xs font-mono uppercase text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Status"}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("reviewed")}>Reviewed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Overdue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Check-ins List */}
      <div className="border border-border">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
          <div className="col-span-3">Patient</div>
          <div className="col-span-2">Health Pillars</div>
          <div className="col-span-1 text-center">Mood</div>
          <div className="col-span-2">Flags</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredCheckins.map((checkin) => {
            const statusBadge = getStatusBadge(checkin.status)
            const priorityBadge = getPriorityBadge(checkin.priority)

            return (
              <div
                key={checkin.id}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors ${
                  checkin.status === "overdue" ? "bg-red-500/5" : ""
                }`}
              >
                {/* Patient */}
                <div className="col-span-3">
                  <Link
                    href={`/concierge/patients/${checkin.patientId}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {checkin.patientName}
                  </Link>
                  <p className={`text-xs font-mono uppercase ${priorityBadge.className}`}>
                    {priorityBadge.text} Priority
                  </p>
                </div>

                {/* Health Pillars */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    {Object.entries(checkin.pillars).map(([key, value]) => {
                      const Icon = pillarIcons[key as keyof typeof pillarIcons]
                      return (
                        <div
                          key={key}
                          className={`w-6 h-8 ${getPillarColor(value)} flex items-center justify-center cursor-help`}
                          title={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}%`}
                        >
                          <Icon className="w-3 h-3 text-white/80" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mood */}
                <div className="col-span-1 text-center">
                  <span
                    className={`text-lg font-bold ${
                      checkin.overallMood >= 7
                        ? "text-green-500"
                        : checkin.overallMood >= 5
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {checkin.overallMood}/10
                  </span>
                </div>

                {/* Flags */}
                <div className="col-span-2">
                  {checkin.flags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {checkin.flags.slice(0, 2).map((flag) => (
                        <span
                          key={flag}
                          className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/30"
                        >
                          {flag}
                        </span>
                      ))}
                      {checkin.flags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{checkin.flags.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No flags</span>
                  )}
                </div>

                {/* Submitted */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1 text-sm text-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {checkin.submittedAt}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={`text-xs font-mono uppercase px-2 py-1 border ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-transparent"
                    onClick={() => setSelectedCheckin(checkin)}
                  >
                    <Eye className="w-4 h-4" /> Review
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Check-in Detail Modal */}
      {selectedCheckin && <CheckinDetailModal checkin={selectedCheckin} onClose={() => setSelectedCheckin(null)} />}
    </div>
  )
}
