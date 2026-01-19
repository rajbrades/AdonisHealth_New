"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const patients = [
  {
    id: "1",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 123-4567",
    age: 42,
    program: "TRT + Optimization",
    lastCheckin: "2 hours ago",
    nextCheckin: "In 5 days",
    status: "On Track",
    compliance: 92,
    pillars: { sleep: 85, nutrition: 72, exercise: 90, stress: 65, supplements: 95 },
  },
  {
    id: "2",
    name: "David Thompson",
    email: "david.t@email.com",
    phone: "(555) 234-5678",
    age: 38,
    program: "Natural Boosters",
    lastCheckin: "1 day ago",
    nextCheckin: "Overdue",
    status: "Needs Attention",
    compliance: 68,
    pillars: { sleep: 45, nutrition: 80, exercise: 60, stress: 40, supplements: 75 },
  },
  {
    id: "3",
    name: "James Wilson",
    email: "jwilson@email.com",
    phone: "(555) 345-6789",
    age: 55,
    program: "TRT",
    lastCheckin: "3 days ago",
    nextCheckin: "Overdue",
    status: "Overdue",
    compliance: 45,
    pillars: { sleep: 70, nutrition: 65, exercise: 55, stress: 72, supplements: 60 },
  },
  {
    id: "4",
    name: "Robert Garcia",
    email: "r.garcia@email.com",
    phone: "(555) 456-7890",
    age: 47,
    program: "Sexual Wellness",
    lastCheckin: "5 hours ago",
    nextCheckin: "In 7 days",
    status: "On Track",
    compliance: 98,
    pillars: { sleep: 92, nutrition: 88, exercise: 95, stress: 78, supplements: 100 },
  },
  {
    id: "5",
    name: "William Martinez",
    email: "will.m@email.com",
    phone: "(555) 567-8901",
    age: 35,
    program: "TRT + Sexual Wellness",
    lastCheckin: "12 hours ago",
    nextCheckin: "In 3 days",
    status: "On Track",
    compliance: 85,
    pillars: { sleep: 78, nutrition: 82, exercise: 88, stress: 70, supplements: 90 },
  },
]

function getPillarColor(value: number) {
  if (value >= 80) return "bg-green-500"
  if (value >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

function getStatusColor(status: string) {
  switch (status) {
    case "On Track":
      return "text-green-500 bg-green-500/10 border-green-500/30"
    case "Needs Attention":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
    case "Overdue":
      return "text-red-500 bg-red-500/10 border-red-500/30"
    default:
      return "text-muted-foreground bg-muted border-border"
  }
}

export function PatientList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage and monitor your patient roster</p>
        </div>
        <Button className="bg-primary text-background hover:bg-primary/90">Add Patient</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              {statusFilter || "All Status"}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("On Track")}>On Track</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Needs Attention")}>Needs Attention</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Overdue")}>Overdue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Patient Table */}
      <div className="border border-border">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
          <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-foreground">
            Patient <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="col-span-2">Program</div>
          <div className="col-span-2">Health Pillars</div>
          <div className="col-span-1 text-center">Compliance</div>
          <div className="col-span-2">Last Check-in</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
            >
              {/* Patient Info */}
              <div className="col-span-3">
                <Link href={`/concierge/patients/${patient.id}`} className="hover:text-primary">
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                </Link>
              </div>

              {/* Program */}
              <div className="col-span-2">
                <span className="text-sm text-foreground">{patient.program}</span>
              </div>

              {/* Health Pillars */}
              <div className="col-span-2">
                <div className="flex items-center gap-1">
                  {Object.entries(patient.pillars).map(([key, value]) => (
                    <div
                      key={key}
                      className={`w-3 h-8 ${getPillarColor(value)} cursor-help`}
                      title={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}%`}
                    />
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="col-span-1 text-center">
                <span
                  className={`text-sm font-bold ${
                    patient.compliance >= 80
                      ? "text-green-500"
                      : patient.compliance >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {patient.compliance}%
                </span>
              </div>

              {/* Last Check-in */}
              <div className="col-span-2">
                <p className="text-sm text-foreground">{patient.lastCheckin}</p>
                <p
                  className={`text-xs ${patient.nextCheckin === "Overdue" ? "text-red-500" : "text-muted-foreground"}`}
                >
                  Next: {patient.nextCheckin}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <span className={`text-xs font-mono uppercase px-2 py-1 border ${getStatusColor(patient.status)}`}>
                  {patient.status.split(" ")[0]}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem asChild>
                      <Link href={`/concierge/patients/${patient.id}`} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" /> View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" /> Request Check-in
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Send Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredPatients.length} of {patients.length} patients
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
