"use client"

import { ClipboardCheck, FileText, MessageSquare, Pill, Calendar } from "lucide-react"

const timelineEvents = [
  {
    id: "1",
    type: "checkin",
    title: "Weekly Check-in Completed",
    description: "Patient reported improved energy levels and better sleep quality.",
    date: "Today, 2:30 PM",
    icon: ClipboardCheck,
  },
  {
    id: "2",
    type: "lab",
    title: "Lab Results Received",
    description: "Total T: 850 ng/dL, Free T: 22 pg/mL - All markers in optimal range.",
    date: "Dec 15, 2025",
    icon: FileText,
  },
  {
    id: "3",
    type: "message",
    title: "Message Sent",
    description: "Reminder about injection timing and upcoming lab work.",
    date: "Dec 12, 2025",
    icon: MessageSquare,
  },
  {
    id: "4",
    type: "medication",
    title: "Protocol Adjustment",
    description: "Anastrozole added as PRN based on E2 levels.",
    date: "Sep 1, 2025",
    icon: Pill,
  },
  {
    id: "5",
    type: "appointment",
    title: "Initial Consultation",
    description: "Treatment plan established. TRT protocol initiated.",
    date: "Aug 15, 2025",
    icon: Calendar,
  },
]

function getEventColor(type: string) {
  switch (type) {
    case "checkin":
      return "bg-green-500"
    case "lab":
      return "bg-blue-500"
    case "message":
      return "bg-purple-500"
    case "medication":
      return "bg-primary"
    case "appointment":
      return "bg-cyan-500"
    default:
      return "bg-muted-foreground"
  }
}

export function PatientTimeline() {
  return (
    <div className="border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Activity Timeline</h2>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {/* Events */}
        <div className="space-y-6">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative flex gap-6">
              {/* Icon */}
              <div
                className={`w-12 h-12 ${getEventColor(event.type)} flex items-center justify-center z-10 flex-shrink-0`}
              >
                <event.icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
