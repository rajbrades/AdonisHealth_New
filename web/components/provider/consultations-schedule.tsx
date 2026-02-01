"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Video, Phone, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const consultations = [
  {
    id: "1",
    patientId: "1",
    patientName: "Michael Chen",
    patientInitials: "MC",
    patientImage: null,
    type: "Lab Review",
    time: "10:00 AM",
    duration: "30 min",
    mode: "video",
    status: "upcoming",
    hasPrep: true,
  },
  {
    id: "2",
    patientId: "2",
    patientName: "James Wilson",
    patientInitials: "JW",
    patientImage: null,
    type: "Follow-up",
    time: "11:00 AM",
    duration: "20 min",
    mode: "phone",
    status: "upcoming",
    hasPrep: true,
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Robert Martinez",
    patientInitials: "RM",
    patientImage: null,
    type: "Initial Consultation",
    time: "2:00 PM",
    duration: "45 min",
    mode: "video",
    status: "upcoming",
    hasPrep: false,
  },
]

export function ConsultationsSchedule() {
  const [selectedDate] = useState(new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consultations</h1>
          <p className="text-muted-foreground mt-1">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Consultation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-border border border-border">
        <div className="bg-background p-4">
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground mt-1">Today's Consultations</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-2xl font-bold text-foreground">2</p>
          <p className="text-xs text-muted-foreground mt-1">Prep Needed</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-2xl font-bold text-foreground">1:30</p>
          <p className="text-xs text-muted-foreground mt-1">Avg Duration</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground mt-1">This Week</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Today's Schedule</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-4">
                {/* Time */}
                <div className="w-24 flex-shrink-0">
                  <p className="text-mono-upper text-xs text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{consultation.time}</p>
                  <p className="text-xs text-muted-foreground">{consultation.duration}</p>
                </div>

                {/* Patient Info */}
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-12 h-12 border border-border">
                    <AvatarImage src={consultation.patientImage || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {consultation.patientInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/provider/patients/${consultation.patientId}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {consultation.patientName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-2 py-0.5 text-xs border border-border bg-background">
                            {consultation.type}
                          </span>
                          {consultation.mode === "video" ? (
                            <Video className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <Phone className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {consultation.hasPrep && (
                        <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20">
                          Prep Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-border hover:border-primary hover:text-primary bg-transparent"
                  >
                    <Link href={`/provider/patients/${consultation.patientId}`}>
                      View Patient
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href={`/provider/consultations/${consultation.id}/note`}>
                      <FileText className="w-4 h-4 mr-2" />
                      Start Note
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
