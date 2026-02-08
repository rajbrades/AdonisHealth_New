"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Appointment {
  id: string
  title: string
  providerName: string
  providerRole: string
  date: string
  time: string
  duration: string
  type: "telehealth" | "in-person" | "lab-draw"
  status: "scheduled" | "completed" | "cancelled" | "no-show" | "pending"
  location?: string
  notes?: string
  prepNotes?: string
  appointmentCode?: string
  joinUrl?: string
}

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
    case "pending":
      return {
        className: "bg-yellow-500/20 text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "PENDING",
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
  if (!timeStr.includes(" ")) return timeStr + ":00"
  const [time, modifier] = timeStr.split(" ")
  let [hours, minutes] = time.split(":").map(Number)
  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

export function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Reschedule / Cancel Dialog States
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Request Dialog State
  const [requestReason, setRequestReason] = useState("review-labs")
  const [requestNotes, setRequestNotes] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const data = await apiClient.get<any[]>("/appointments")
      const transformed = data.map((apt: any) => {
        const dateObj = new Date(apt.date)
        return {
          id: apt.id,
          title: apt.title,
          providerName: apt.provider ? `Dr. ${apt.provider.lastName}` : "TBD",
          providerRole: "Provider", // simplified
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: `${apt.duration} min`,
          type: apt.type.toLowerCase().replace('_', '-'),
          status: apt.status.toLowerCase(),
          location: apt.location,
          notes: apt.notes,
        } as Appointment
      })
      setAppointments(transformed)
    } catch (error) {
      console.error("Failed to fetch appointments", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper to force cleanup of Radix UI styles
  const forceUnlockScroll = () => {
    setTimeout(() => {
      document.body.style.pointerEvents = ""
      document.body.style.overflow = ""
    }, 500)
  }

  const handleCancel = async () => {
    if (!selectedAppointment) return
    try {
      await apiClient.post(`/appointments/${selectedAppointment.id}/cancel`, { reason: "Patient requested via portal" })
      toast.success("Appointment cancelled successfully")
      setCancelDialogOpen(false)
      forceUnlockScroll()
      // Wait for dialog animation to complete before fetching to avoid scroll lock issues
      setTimeout(() => {
        fetchAppointments()
      }, 500)
    } catch (error) {
      toast.error("Failed to cancel appointment")
    }
  }

  const handleReschedule = async () => {
    if (!selectedAppointment) return
    try {
      // Send request without date - backend will handle it as PENDING
      await apiClient.post(`/appointments/${selectedAppointment.id}/reschedule`, {})
      toast.success("Reschedule request submitted successfully")
      setRescheduleDialogOpen(false)
      forceUnlockScroll()
      // Wait for dialog animation to complete before fetching to avoid scroll lock issues
      setTimeout(() => {
        fetchAppointments()
      }, 500)
    } catch (error) {
      toast.error("Failed to submit reschedule request")
    }
  }

  const handleRequest = async () => {
    const reasonTitles: Record<string, string> = {
      "review-labs": "Lab Results Review",
      "discuss-protocol": "Protocol/Dosage Discussion",
      "new-concern": "New Health Concern",
      "check-in": "General Check-in"
    }

    try {
      await apiClient.post("/appointments", {
        title: reasonTitles[requestReason] || "Telehealth Consultation",
        type: "TELEHEALTH",
        date: new Date(),
        duration: 30, // default
        status: "PENDING",
        notes: requestNotes || "Patient requested appointment via portal",
      })
      toast.success("Appointment request submitted successfully")
      setRequestDialogOpen(false)
      setRequestNotes("")
      forceUnlockScroll()
      // Wait for dialog animation to complete before fetching to avoid scroll lock issues
      setTimeout(() => {
        fetchAppointments()
      }, 500)
    } catch (error) {
      toast.error("Failed to submit appointment request")
    }
  }

  const upcomingAppointments = appointments
    .filter(apt => apt.status === "scheduled" || apt.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastAppointments = appointments
    .filter(apt => apt.status !== "scheduled" && apt.status !== "pending")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const renderAppointmentCard = (apt: Appointment) => {
    const isPending = apt.status === "pending"
    const dateObj = new Date(apt.date)
    const monthShort = isPending ? "REQ" : dateObj.toLocaleDateString("en-US", { month: "short" })
    const dayNum = isPending ? "--" : dateObj.getDate()
    const relativeTime = isPending ? "Pending Confirmation" : getRelativeTime(apt.date)
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
          <div className={`w-16 h-16 ${isPending ? 'bg-muted' : 'bg-primary/10'} flex flex-col items-center justify-center shrink-0 rounded-md`}>
            <span className={`text-xs font-mono uppercase ${isPending ? 'text-muted-foreground' : 'text-primary'}`}>{monthShort}</span>
            <span className={`text-2xl font-bold ${isPending ? 'text-muted-foreground' : 'text-foreground'}`}>{dayNum}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{apt.title}</h3>
                {relativeTime && !isPending && (
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

            {relativeTime && !isPending && (
              <p className="text-xs font-mono text-muted-foreground mb-1 sm:hidden">{relativeTime}</p>
            )}

            <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {apt.providerName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isPending ? "To be scheduled" : `${apt.time} · ${apt.duration} min`}
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

            {apt.appointmentCode && (
              <div className="bg-primary/10 border border-primary/20 px-3 py-2 mb-2 inline-flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-muted-foreground">Appointment Code</span>
                <span className="text-sm font-mono font-bold text-primary tracking-wider">{apt.appointmentCode}</span>
              </div>
            )}

            {apt.prepNotes && (
              <div className="border-l-2 border-yellow-500/50 bg-yellow-500/5 pl-3 py-2 mb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-mono uppercase text-yellow-500">Prep Required</span>
                </div>
                <p className="text-sm text-foreground">{apt.prepNotes}</p>
              </div>
            )}

            {apt.notes && (
              <p className="text-sm text-muted-foreground">{apt.notes}</p>
            )}
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            {apt.status === "scheduled" && (
              <>
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <MoreVertical className="w-3.5 h-3.5" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt)
                        setRescheduleDialogOpen(true)
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt)
                        setCancelDialogOpen(true)
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {apt.status === "completed" && (
              <Button size="sm" variant="outline" className="bg-transparent gap-1">
                <FileText className="w-3.5 h-3.5" />
                Summary
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}

            {apt.status === "pending" && (
              <div className="bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-center">
                <p className="text-xs text-yellow-500 font-medium">Pending Confirmation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="border border-border">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAppointment && (
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">{selectedAppointment.title}</p>
                <p className="text-sm text-muted-foreground">{selectedAppointment.date} at {selectedAppointment.time}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Appointment</Button>
            <Button variant="destructive" onClick={handleCancel}>Confirm Cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="border border-border">
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Submit a request to reschedule this appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedAppointment && (
              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="font-medium">Current: {selectedAppointment.title}</p>
                <p className="text-sm text-muted-foreground">{selectedAppointment.date} at {selectedAppointment.time}</p>
              </div>
            )}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
              <p className="text-sm text-foreground">
                Your concierge will reach out shortly to coordinate a new time (typically within 24 hours).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReschedule}>Request Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Appointment Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="border border-border sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Request an Appointment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Submit your preferences and your concierge will confirm the appointment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Reason for Request</Label>
              <Select value={requestReason} onValueChange={setRequestReason}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review-labs" className="focus:text-yellow-500 focus:bg-yellow-500/10 cursor-pointer">Review Lab Results</SelectItem>
                  <SelectItem value="discuss-protocol" className="focus:text-yellow-500 focus:bg-yellow-500/10 cursor-pointer">Discuss Protocol/Dosage</SelectItem>
                  <SelectItem value="new-concern" className="focus:text-yellow-500 focus:bg-yellow-500/10 cursor-pointer">New Health Concern</SelectItem>
                  <SelectItem value="check-in" className="focus:text-yellow-500 focus:bg-yellow-500/10 cursor-pointer">General Check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <div className="grid gap-2">
              <Label htmlFor="notes">Notes or Specific Concerns</Label>
              <Textarea
                id="notes"
                placeholder="Please describe what you'd like to discuss..."
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-md border border-border mt-2">
              <div className="flex items-center gap-2 text-sm text-yellow-500 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Please Note</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a request only. Your appointment is not confirmed until you receive a notification from your concierge.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRequestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequest}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
