"use client"

import { useState } from "react"
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  User,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  MoreVertical,
  CalendarOff,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  prepNotes?: string
  appointmentCode?: string
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
    notes: "Enter appointment code on the iPad at check-in",
    prepNotes: "12-hour fasting required. No food or drinks except water after 8 PM the night before.",
    appointmentCode: "QD-7842-A",
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

function getStatusBadge(status: string): { className: string; icon: React.ReactNode; label: string } {
  switch (status) {
    case "scheduled":
      return {
        className: "bg-blue-500/20 text-blue-400",
        icon: <Clock className="w-3 h-3" />,
        label: "SCHEDULED",
      }
    case "completed":
      return {
        className: "bg-green-500/20 text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "COMPLETED",
      }
    case "cancelled":
      return {
        className: "bg-red-500/20 text-red-400",
        icon: <XCircle className="w-3 h-3" />,
        label: "CANCELLED",
      }
    case "no-show":
      return {
        className: "bg-red-500/20 text-red-400",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "NO SHOW",
      }
    default:
      return {
        className: "bg-muted text-muted-foreground",
        icon: null,
        label: status.toUpperCase(),
      }
  }
}

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const target = new Date(dateStr)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const diffMs = targetDay.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"
  if (diffDays > 1) return `in ${diffDays} days`
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`
  return ""
}

function convertTo24Hr(timeStr: string): string {
  const [time, modifier] = timeStr.split(" ")
  let [hours, minutes] = time.split(":").map(Number)
  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

export function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

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
    const relativeTime = getRelativeTime(apt.date)
    const statusBadge = getStatusBadge(apt.status)

    const isJoinable = (() => {
      if (apt.type !== "telehealth" || apt.status !== "scheduled") return false
      const aptDateTime = new Date(`${apt.date}T${convertTo24Hr(apt.time)}`)
      const now = new Date()
      const diffMin = (aptDateTime.getTime() - now.getTime()) / (1000 * 60)
      return diffMin <= 15
    })()

    return (
      <div key={apt.id} className="border border-border bg-card hover:border-primary/30 transition-colors">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Date Block */}
          <div className="w-16 h-16 bg-primary/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs font-mono uppercase text-primary">{monthShort}</span>
            <span className="text-2xl font-bold text-foreground">{dayNum}</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{apt.title}</h3>
                {relativeTime && (
                  <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                    {relativeTime}
                  </span>
                )}
              </div>
              {apt.status !== "scheduled" && (
                <span className={`text-xs font-mono uppercase px-2 py-0.5 shrink-0 inline-flex items-center gap-1 ${statusBadge.className}`}>
                  {statusBadge.icon}
                  {statusBadge.label}
                </span>
              )}
            </div>

            {/* Mobile relative time */}
            {relativeTime && (
              <p className="text-xs font-mono text-muted-foreground mb-1 sm:hidden">{relativeTime}</p>
            )}

            {/* Metadata row */}
            <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {apt.providerName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {apt.time} &middot; {apt.duration}
              </span>
              <span className="flex items-center gap-1">
                {getTypeIcon(apt.type)}
                {getTypeLabel(apt.type)}
              </span>
            </div>

            {/* Location */}
            {apt.location && (
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {apt.location}
              </p>
            )}

            {/* Appointment Code */}
            {apt.appointmentCode && (
              <div className="bg-primary/10 border border-primary/20 px-3 py-2 mb-2 inline-flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-muted-foreground">Appointment Code</span>
                <span className="text-sm font-mono font-bold text-primary tracking-wider">{apt.appointmentCode}</span>
              </div>
            )}

            {/* Prep Notes Callout */}
            {apt.prepNotes && (
              <div className="border-l-2 border-yellow-500/50 bg-yellow-500/5 pl-3 py-2 mb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-mono uppercase text-yellow-500">Prep Required</span>
                </div>
                <p className="text-sm text-foreground">{apt.prepNotes}</p>
              </div>
            )}

            {/* Regular notes */}
            {apt.notes && (
              <p className="text-sm text-muted-foreground">{apt.notes}</p>
            )}
          </div>

          {/* Actions Column */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {/* Scheduled appointment actions */}
            {apt.status === "scheduled" && (
              <>
                {/* Join Call button with tooltip */}
                {apt.type === "telehealth" && (
                  isJoinable ? (
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                      <Video className="w-3.5 h-3.5" />
                      Join
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Button
                            size="sm"
                            className="bg-primary/30 text-primary-foreground gap-1 cursor-not-allowed"
                            disabled
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Available 15 min before appointment
                      </TooltipContent>
                    </Tooltip>
                  )
                )}

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <MoreVertical className="w-3.5 h-3.5" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="cursor-pointer">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Past appointment actions */}
            {apt.status === "completed" && (
              <Button size="sm" variant="outline" className="bg-transparent gap-1">
                <FileText className="w-3.5 h-3.5" />
                Summary
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
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
        <Button
          onClick={() => setRequestDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Request Appointment
        </Button>
      </div>

      {/* Next Appointment Highlight */}
      {upcomingAppointments.length > 0 && (() => {
        const next = upcomingAppointments[0]
        const relativeTime = getRelativeTime(next.date)
        const isJoinable = (() => {
          if (next.type !== "telehealth") return false
          const aptDateTime = new Date(`${next.date}T${convertTo24Hr(next.time)}`)
          const now = new Date()
          const diffMin = (aptDateTime.getTime() - now.getTime()) / (1000 * 60)
          return diffMin <= 15
        })()

        return (
          <div className="border-2 border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-mono uppercase text-primary">Next Appointment</p>
              {relativeTime && (
                <span className="text-xs font-mono uppercase text-primary/70">
                  &mdash; {relativeTime}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{next.title}</h3>
                <p className="text-muted-foreground">
                  {new Date(next.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  {" "}at {next.time}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  With {next.providerName} &middot; {next.duration} &middot; {getTypeLabel(next.type)}
                </p>
              </div>
              {next.type === "telehealth" && (
                isJoinable ? (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Video className="w-4 h-4" />
                    Join Call
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          className="bg-primary/30 text-primary-foreground gap-2 cursor-not-allowed"
                          disabled
                        >
                          <Video className="w-4 h-4" />
                          Join Call
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Available 15 minutes before your appointment
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </div>
        )
      })()}

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
            <div className="border border-border p-12 text-center">
              <CalendarOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Upcoming Appointments</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                You do not have any scheduled appointments. Request one and your concierge will coordinate the details.
              </p>
              <Button
                onClick={() => setRequestDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Appointment
              </Button>
            </div>
          ) : (
            upcomingAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastAppointments.length === 0 ? (
            <div className="border border-border p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Past Appointments</h3>
              <p className="text-sm text-muted-foreground">
                Your appointment history will appear here after your first visit.
              </p>
            </div>
          ) : (
            pastAppointments.map(renderAppointmentCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Request Appointment Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Request an Appointment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Your wellness concierge will coordinate scheduling based on your preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/30 p-4 border border-border">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-3">How It Works</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono mt-0.5">1.</span>
                  <span>Submit your appointment request below</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono mt-0.5">2.</span>
                  <span>Your concierge will confirm availability within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono mt-0.5">3.</span>
                  <span>You will receive a confirmation with appointment details</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setRequestDialogOpen(false)}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setRequestDialogOpen(false)}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
