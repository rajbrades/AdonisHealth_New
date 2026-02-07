"use client"

import { useState } from "react"
import { Calendar, Video, MapPin, Clock, User, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Appointment {
  id: string
  title: string
  providerName: string
  providerRole: string
  date: string
  time: string
  duration: string
  type: "telehealth" | "in-person" | "lab-draw"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  location?: string
  notes?: string
  joinUrl?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    title: "Quarterly Provider Consultation",
    providerName: "Dr. Miller",
    providerRole: "Physician",
    date: "2026-02-20",
    time: "10:00 AM",
    duration: "30 min",
    type: "telehealth",
    status: "scheduled",
    notes: "Review February lab results, discuss protocol adjustments",
    joinUrl: "#",
  },
  {
    id: "apt-2",
    title: "Lab Draw — Hormone Panel",
    providerName: "Quest Diagnostics",
    providerRole: "Lab",
    date: "2026-02-10",
    time: "8:00 AM",
    duration: "15 min",
    type: "lab-draw",
    status: "scheduled",
    location: "Quest Diagnostics — 450 Sutter St, SF",
    notes: "12-hour fasting required. Bring requisition.",
  },
  {
    id: "apt-3",
    title: "Concierge Check-in Call",
    providerName: "Sarah J.",
    providerRole: "Concierge",
    date: "2026-02-14",
    time: "2:00 PM",
    duration: "15 min",
    type: "telehealth",
    status: "scheduled",
    joinUrl: "#",
  },
  {
    id: "apt-4",
    title: "Quarterly Provider Consultation",
    providerName: "Dr. Miller",
    providerRole: "Physician",
    date: "2026-01-15",
    time: "10:00 AM",
    duration: "30 min",
    type: "telehealth",
    status: "completed",
    notes: "Reviewed January labs, increased Test Cyp to 150mg/wk, adjusted Anastrozole schedule",
  },
  {
    id: "apt-5",
    title: "Lab Draw — Comprehensive Panel",
    providerName: "Quest Diagnostics",
    providerRole: "Lab",
    date: "2026-01-15",
    time: "7:30 AM",
    duration: "15 min",
    type: "lab-draw",
    status: "completed",
    location: "Quest Diagnostics — 450 Sutter St, SF",
  },
  {
    id: "apt-6",
    title: "Initial Consultation",
    providerName: "Dr. Miller",
    providerRole: "Physician",
    date: "2025-10-10",
    time: "11:00 AM",
    duration: "45 min",
    type: "telehealth",
    status: "completed",
    notes: "Initial evaluation, reviewed baseline labs, started TRT protocol",
  },
  {
    id: "apt-7",
    title: "Concierge Check-in Call",
    providerName: "Sarah J.",
    providerRole: "Concierge",
    date: "2025-12-20",
    time: "3:00 PM",
    duration: "15 min",
    type: "telehealth",
    status: "cancelled",
  },
]

function getTypeIcon(type: string) {
  switch (type) {
    case "telehealth":
      return <Video className="w-4 h-4" />
    case "in-person":
      return <MapPin className="w-4 h-4" />
    case "lab-draw":
      return <MapPin className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "telehealth": return "TELEHEALTH"
    case "in-person": return "IN-PERSON"
    case "lab-draw": return "LAB DRAW"
    default: return type.toUpperCase()
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "scheduled":
      return "bg-blue-500/10 text-blue-500"
    case "completed":
      return "bg-green-500/10 text-green-500"
    case "cancelled":
      return "bg-red-500/10 text-red-500"
    case "no-show":
      return "bg-red-500/10 text-red-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingAppointments = mockAppointments
    .filter(apt => apt.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastAppointments = mockAppointments
    .filter(apt => apt.status !== "scheduled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const renderAppointmentCard = (apt: Appointment) => {
    const dateObj = new Date(apt.date)
    const monthShort = dateObj.toLocaleDateString("en-US", { month: "short" })
    const dayNum = dateObj.getDate()

    return (
      <div key={apt.id} className="border border-border bg-card hover:border-primary/30 transition-colors">
        <div className="p-4 flex gap-4">
          {/* Date Block */}
          <div className="w-16 h-16 bg-primary/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs font-mono uppercase text-primary">{monthShort}</span>
            <span className="text-2xl font-bold text-foreground">{dayNum}</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-foreground">{apt.title}</h3>
              <span className={`text-xs font-mono uppercase px-2 py-0.5 shrink-0 ${getStatusStyle(apt.status)}`}>
                {apt.status === "no-show" ? "NO SHOW" : apt.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {apt.providerName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {apt.time} · {apt.duration}
              </span>
              <span className="flex items-center gap-1">
                {getTypeIcon(apt.type)}
                {getTypeLabel(apt.type)}
              </span>
            </div>

            {apt.location && (
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {apt.location}
              </p>
            )}

            {apt.notes && (
              <p className="text-sm text-muted-foreground">{apt.notes}</p>
            )}
          </div>

          {/* Actions */}
          {apt.status === "scheduled" && (
            <div className="flex flex-col gap-2 shrink-0">
              {apt.type === "telehealth" && (
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                  <Video className="w-3.5 h-3.5" />
                  Join
                </Button>
              )}
              <Button size="sm" variant="outline" className="bg-transparent">
                Reschedule
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-sm text-muted-foreground">
              {upcomingAppointments.length} upcoming appointment{upcomingAppointments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Next Appointment Highlight */}
      {upcomingAppointments.length > 0 && (
        <div className="border-2 border-primary/30 bg-primary/5 p-5">
          <p className="text-xs font-mono uppercase text-primary mb-2">Next Appointment</p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">{upcomingAppointments[0].title}</h3>
              <p className="text-muted-foreground">
                {new Date(upcomingAppointments[0].date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {" "}at {upcomingAppointments[0].time}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                With {upcomingAppointments[0].providerName} · {upcomingAppointments[0].duration} · {getTypeLabel(upcomingAppointments[0].type)}
              </p>
            </div>
            {upcomingAppointments[0].type === "telehealth" && (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Video className="w-4 h-4" />
                Join Call
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-border w-full justify-start bg-transparent p-0">
          <TabsTrigger value="upcoming" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAppointments.length === 0 ? (
            <div className="border border-border p-8 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastAppointments.length === 0 ? (
            <div className="border border-border p-8 text-center">
              <p className="text-muted-foreground">No past appointments</p>
            </div>
          ) : (
            pastAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
