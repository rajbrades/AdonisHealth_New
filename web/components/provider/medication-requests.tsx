"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, CheckCircle, XCircle, Plus, Minus, RefreshCw, X, Pill, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MedicationRequest {
  id: string
  patientId: string
  patientName: string
  requestType: "increase" | "decrease" | "change" | "discontinue" | "new"
  medication: string
  currentDosage?: string
  proposedDosage?: string
  proposedFrequency?: string
  reason: string
  clinicalNotes?: string
  urgency: "routine" | "priority" | "urgent"
  status: "pending" | "approved" | "denied"
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

const mockRequests: MedicationRequest[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Michael Chen",
    requestType: "increase",
    medication: "Testosterone Cypionate",
    currentDosage: "150mg weekly",
    proposedDosage: "200mg",
    proposedFrequency: "weekly",
    reason:
      "Patient reports fatigue and energy levels not improving. Labs show Total T at lower end of optimal range (550 ng/dL).",
    clinicalNotes: "Patient has been compliant with current protocol for 3 months. No adverse effects reported.",
    urgency: "routine",
    status: "pending",
    requestedBy: "Sarah Johnson (Concierge)",
    requestedAt: "2 hours ago",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Robert Garcia",
    requestType: "new",
    medication: "Anastrozole",
    proposedDosage: "0.5mg",
    proposedFrequency: "twice weekly",
    reason: "Elevated estradiol on recent labs (48 pg/mL). Patient reporting water retention and mood changes.",
    clinicalNotes: "E2 was 28 pg/mL at baseline. Has been on TRT for 4 months.",
    urgency: "priority",
    status: "pending",
    requestedBy: "Mike Williams (Concierge)",
    requestedAt: "4 hours ago",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "David Thompson",
    requestType: "discontinue",
    medication: "HCG",
    currentDosage: "500 IU twice weekly",
    reason: "Patient no longer interested in fertility preservation. Requests simplification of protocol.",
    urgency: "routine",
    status: "pending",
    requestedBy: "Sarah Johnson (Concierge)",
    requestedAt: "1 day ago",
  },
  {
    id: "4",
    patientId: "4",
    patientName: "James Wilson",
    requestType: "change",
    medication: "Sildenafil",
    currentDosage: "50mg as needed",
    proposedDosage: "100mg",
    proposedFrequency: "as needed",
    reason: "Patient reports 50mg is no longer effective. Has tried timing adjustments without improvement.",
    urgency: "urgent",
    status: "pending",
    requestedBy: "Mike Williams (Concierge)",
    requestedAt: "30 minutes ago",
  },
]

const getRequestTypeIcon = (type: string) => {
  switch (type) {
    case "increase":
      return <Plus className="w-4 h-4" />
    case "decrease":
      return <Minus className="w-4 h-4" />
    case "change":
      return <RefreshCw className="w-4 h-4" />
    case "discontinue":
      return <X className="w-4 h-4" />
    case "new":
      return <Pill className="w-4 h-4" />
    default:
      return <Pill className="w-4 h-4" />
  }
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return "text-red-500 bg-red-500/10 border-red-500/30"
    case "priority":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
    default:
      return "text-muted-foreground bg-muted border-border"
  }
}

interface MedicationRequestsProps {
  compact?: boolean
}

export function MedicationRequests({ compact = false }: MedicationRequestsProps) {
  const [requests] = useState(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequest | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingRequests = requests.filter((r) => r.status === "pending")

  const handleReview = async (action: "approve" | "deny") => {
    if (!selectedRequest) return
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    setSelectedRequest(null)
    setReviewNotes("")
  }

  if (compact) {
    return (
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Medication Requests</h2>
          </div>
          <Link href="/provider/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {pendingRequests.slice(0, 3).map((request) => (
            <div
              key={request.id}
              className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-10 ${request.urgency === "urgent" ? "bg-red-500" : request.urgency === "priority" ? "bg-yellow-500" : "bg-muted-foreground"}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{request.patientName}</span>
                    <span
                      className={`text-xs font-mono uppercase px-2 py-0.5 border ${getUrgencyColor(request.urgency)}`}
                    >
                      {request.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {getRequestTypeIcon(request.requestType)}
                    <span className="capitalize">{request.requestType}</span> - {request.medication}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{request.requestedAt}</span>
              </div>
            </div>
          ))}
        </div>
        {pendingRequests.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No pending medication requests</div>
        )}

        {/* Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedRequest(null)} />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border">
              <div className="sticky top-0 bg-background p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Review Medication Request</h2>
                  <p className="text-sm text-muted-foreground mt-1">Requested by {selectedRequest.requestedBy}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 border border-border">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{selectedRequest.patientName}</p>
                    <Link
                      href={`/provider/patients/${selectedRequest.patientId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Patient Record
                    </Link>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`text-xs font-mono uppercase px-3 py-1 border ${getUrgencyColor(selectedRequest.urgency)}`}
                    >
                      {selectedRequest.urgency}
                    </span>
                  </div>
                </div>

                {/* Request Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border p-4">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Request Type</p>
                    <p className="font-bold text-foreground capitalize flex items-center gap-2">
                      {getRequestTypeIcon(selectedRequest.requestType)}
                      {selectedRequest.requestType}
                    </p>
                  </div>
                  <div className="border border-border p-4">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Medication</p>
                    <p className="font-bold text-foreground">{selectedRequest.medication}</p>
                  </div>
                  {selectedRequest.currentDosage && (
                    <div className="border border-border p-4">
                      <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Current Dosage</p>
                      <p className="font-bold text-foreground">{selectedRequest.currentDosage}</p>
                    </div>
                  )}
                  {selectedRequest.proposedDosage && (
                    <div className="border border-border p-4 border-primary/50 bg-primary/5">
                      <p className="text-xs font-mono uppercase text-primary mb-1">Proposed Dosage</p>
                      <p className="font-bold text-foreground">
                        {selectedRequest.proposedDosage}
                        {selectedRequest.proposedFrequency && ` ${selectedRequest.proposedFrequency}`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Reason for Request</p>
                  <div className="border border-border p-4 bg-muted/30">
                    <p className="text-foreground">{selectedRequest.reason}</p>
                  </div>
                </div>

                {/* Clinical Notes */}
                {selectedRequest.clinicalNotes && (
                  <div>
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Clinical Notes</p>
                    <div className="border border-border p-4 bg-muted/30">
                      <p className="text-foreground">{selectedRequest.clinicalNotes}</p>
                    </div>
                  </div>
                )}

                {/* Provider Review Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Review Notes <span className="text-muted-foreground">(required for denial)</span>
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes for the concierge and patient record..."
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-background p-6 border-t border-border flex items-center justify-between">
                <Button variant="outline" onClick={() => setSelectedRequest(null)} className="bg-transparent">
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleReview("deny")}
                    disabled={isProcessing || !reviewNotes}
                    className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Deny
                  </Button>
                  <Button
                    onClick={() => handleReview("approve")}
                    disabled={isProcessing}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing..." : "Approve"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full page view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medication Requests</h1>
        <p className="text-muted-foreground">Review and approve medication change requests from concierge team</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <div className="bg-background p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Urgent</p>
          <p className="text-2xl font-bold text-red-500">
            {pendingRequests.filter((r) => r.urgency === "urgent").length}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Priority</p>
          <p className="text-2xl font-bold text-yellow-500">
            {pendingRequests.filter((r) => r.urgency === "priority").length}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Routine</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {pendingRequests.filter((r) => r.urgency === "routine").length}
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="border border-border">
        <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-mono uppercase text-muted-foreground">
          <div className="col-span-2">Patient / Request</div>
          <div>Medication</div>
          <div>Proposed Change</div>
          <div>Urgency</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
            >
              <div className="col-span-2">
                <p className="font-medium text-foreground">{request.patientName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {getRequestTypeIcon(request.requestType)}
                  <span className="capitalize">{request.requestType}</span>
                </p>
              </div>
              <div>
                <p className="text-foreground">{request.medication}</p>
                {request.currentDosage && <p className="text-sm text-muted-foreground">{request.currentDosage}</p>}
              </div>
              <div>
                {request.proposedDosage ? (
                  <p className="text-primary font-medium">
                    {request.proposedDosage} {request.proposedFrequency}
                  </p>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
              <div>
                <span className={`text-xs font-mono uppercase px-2 py-1 border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
              </div>
              <div className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => setSelectedRequest(request)}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal (same as compact view) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border">
            {/* ... same modal content as above ... */}
            <div className="sticky top-0 bg-background p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Review Medication Request</h2>
                <p className="text-sm text-muted-foreground mt-1">Requested by {selectedRequest.requestedBy}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/50 border border-border">
                <div className="w-12 h-12 bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{selectedRequest.patientName}</p>
                  <Link
                    href={`/provider/patients/${selectedRequest.patientId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Patient Record
                  </Link>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-xs font-mono uppercase px-3 py-1 border ${getUrgencyColor(selectedRequest.urgency)}`}
                  >
                    {selectedRequest.urgency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border p-4">
                  <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Request Type</p>
                  <p className="font-bold text-foreground capitalize flex items-center gap-2">
                    {getRequestTypeIcon(selectedRequest.requestType)}
                    {selectedRequest.requestType}
                  </p>
                </div>
                <div className="border border-border p-4">
                  <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Medication</p>
                  <p className="font-bold text-foreground">{selectedRequest.medication}</p>
                </div>
                {selectedRequest.currentDosage && (
                  <div className="border border-border p-4">
                    <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Current Dosage</p>
                    <p className="font-bold text-foreground">{selectedRequest.currentDosage}</p>
                  </div>
                )}
                {selectedRequest.proposedDosage && (
                  <div className="border border-border p-4 border-primary/50 bg-primary/5">
                    <p className="text-xs font-mono uppercase text-primary mb-1">Proposed Dosage</p>
                    <p className="font-bold text-foreground">
                      {selectedRequest.proposedDosage}
                      {selectedRequest.proposedFrequency && ` ${selectedRequest.proposedFrequency}`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Reason for Request</p>
                <div className="border border-border p-4 bg-muted/30">
                  <p className="text-foreground">{selectedRequest.reason}</p>
                </div>
              </div>

              {selectedRequest.clinicalNotes && (
                <div>
                  <p className="text-xs font-mono uppercase text-muted-foreground mb-2">Clinical Notes</p>
                  <div className="border border-border p-4 bg-muted/30">
                    <p className="text-foreground">{selectedRequest.clinicalNotes}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Review Notes <span className="text-muted-foreground">(required for denial)</span>
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes for the concierge and patient record..."
                  className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-background p-6 border-t border-border flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedRequest(null)} className="bg-transparent">
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleReview("deny")}
                  disabled={isProcessing || !reviewNotes}
                  className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deny
                </Button>
                <Button
                  onClick={() => handleReview("approve")}
                  disabled={isProcessing}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
