"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, AlertTriangle, FileText, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RefillRequest {
  id: string
  patientName: string
  patientId: string
  patientAvatar?: string
  medication: string
  dose: string
  frequency: string
  remainingDoses: number
  urgency: "high" | "medium" | "low"
  requestedDate: string
}

interface SideEffectReport {
  id: string
  patientName: string
  patientId: string
  patientAvatar?: string
  medication: string
  sideEffect: string
  severity: "mild" | "moderate" | "severe"
  reportedDate: string
  status: "pending" | "reviewed" | "escalated"
}

interface AdherenceAlert {
  patientName: string
  patientId: string
  patientAvatar?: string
  medication: string
  adherenceRate: number
  missedDoses: number
  lastContact: string
}

const mockRefillRequests: RefillRequest[] = [
  {
    id: "1",
    patientName: "Michael Chen",
    patientId: "1",
    medication: "Testosterone Cypionate",
    dose: "150mg",
    frequency: "Weekly",
    remainingDoses: 1,
    urgency: "high",
    requestedDate: "2026-01-19"
  },
  {
    id: "2",
    patientName: "James Wilson",
    patientId: "2",
    medication: "HCG",
    dose: "500 IU",
    frequency: "2x/week",
    remainingDoses: 4,
    urgency: "medium",
    requestedDate: "2026-01-20"
  }
]

const mockSideEffectReports: SideEffectReport[] = [
  {
    id: "1",
    patientName: "Robert Thompson",
    patientId: "3",
    medication: "Anastrozole",
    sideEffect: "Joint stiffness in morning",
    severity: "mild",
    reportedDate: "2026-01-21",
    status: "pending"
  }
]

const mockAdherenceAlerts: AdherenceAlert[] = [
  {
    patientName: "David Miller",
    patientId: "4",
    medication: "HCG",
    adherenceRate: 65,
    missedDoses: 7,
    lastContact: "2 weeks ago"
  },
  {
    patientName: "John Anderson",
    patientId: "5",
    medication: "Testosterone Cypionate",
    adherenceRate: 78,
    missedDoses: 4,
    lastContact: "5 days ago"
  }
]

export function ConciergeMedications() {
  const [activeTab, setActiveTab] = useState("refills")

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-500 bg-red-500/10"
      case "medium": return "text-yellow-500 bg-yellow-500/10"
      case "low": return "text-green-500 bg-green-500/10"
      default: return "text-muted-foreground bg-muted"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe": return "text-red-500 bg-red-500/10"
      case "moderate": return "text-yellow-500 bg-yellow-500/10"
      case "mild": return "text-green-500 bg-green-500/10"
      default: return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medication Management</h1>
            <p className="text-sm text-muted-foreground">
              {mockRefillRequests.length} pending refills • {mockSideEffectReports.length} side effect reports
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b border-border w-full justify-start bg-transparent p-0">
            <TabsTrigger 
              value="refills" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none relative"
            >
              Refill Requests
              {mockRefillRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-background rounded-full">
                  {mockRefillRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="sideeffects"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none relative"
            >
              Side Effects
              {mockSideEffectReports.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {mockSideEffectReports.filter(r => r.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="adherence"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Adherence Alerts ({mockAdherenceAlerts.length})
            </TabsTrigger>
          </TabsList>

          {/* Refill Requests Tab */}
          <TabsContent value="refills" className="mt-6">
            <div className="border border-border">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
                <div className="col-span-2">Patient</div>
                <div className="col-span-2">Medication</div>
                <div>Remaining</div>
                <div>Urgency</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {mockRefillRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                    <div className="col-span-2">
                      <Link href={`/concierge/patients/${request.patientId}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <Avatar className="w-8 h-8 border border-border">
                          <AvatarImage src={request.patientAvatar || "/placeholder.svg"} alt={request.patientName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {request.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{request.patientName}</p>
                          <p className="text-xs text-muted-foreground">ID: {request.patientId}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-foreground">{request.medication}</p>
                      <p className="text-sm text-muted-foreground">{request.dose} • {request.frequency}</p>
                    </div>
                    <div>
                      <p className="text-foreground">{request.remainingDoses} dose{request.remainingDoses !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-mono uppercase px-2 py-1 ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" className="bg-primary text-background hover:bg-primary/90">
                        Process Refill
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Side Effects Tab */}
          <TabsContent value="sideeffects" className="mt-6">
            <div className="border border-border">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
                <div className="col-span-2">Patient</div>
                <div className="col-span-2">Medication</div>
                <div className="col-span-2">Side Effect</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {mockSideEffectReports.map((report) => (
                  <div key={report.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                    <div className="col-span-2">
                      <Link href={`/concierge/patients/${report.patientId}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <Avatar className="w-8 h-8 border border-border">
                          <AvatarImage src={report.patientAvatar || "/placeholder.svg"} alt={report.patientName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {report.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{report.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.reportedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-foreground">{report.medication}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-foreground">{report.sideEffect}</p>
                      <span className={`text-xs font-mono uppercase px-2 py-0.5 ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                        Escalate to Provider
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark Reviewed
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Adherence Alerts Tab */}
          <TabsContent value="adherence" className="mt-6">
            <div className="border border-border">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
                <div className="col-span-2">Patient</div>
                <div>Medication</div>
                <div>Adherence</div>
                <div>Last Contact</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {mockAdherenceAlerts.map((alert, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                    <div className="col-span-2">
                      <Link href={`/concierge/patients/${alert.patientId}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <Avatar className="w-8 h-8 border border-border">
                          <AvatarImage src={alert.patientAvatar || "/placeholder.svg"} alt={alert.patientName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {alert.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{alert.patientName}</p>
                          <p className="text-xs text-muted-foreground">{alert.missedDoses} missed doses</p>
                        </div>
                      </Link>
                    </div>
                    <div>
                      <p className="text-foreground">{alert.medication}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted max-w-[80px]">
                          <div 
                            className={`h-full ${alert.adherenceRate >= 80 ? 'bg-green-500' : alert.adherenceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${alert.adherenceRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground">{alert.adherenceRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{alert.lastContact}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" className="bg-primary text-background hover:bg-primary/90">
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
