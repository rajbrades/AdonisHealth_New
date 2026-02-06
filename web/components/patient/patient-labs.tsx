"use client"

import { useState } from "react"
import { FileText, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface BiomarkerResult {
  name: string
  value: number
  unit: string
  refRangeLow: number
  refRangeHigh: number
  optimalRangeLow: number
  optimalRangeHigh: number
  flag: "CRITICAL_LOW" | "LOW" | "OPTIMAL" | "HIGH" | "CRITICAL_HIGH"
}

interface LabPanel {
  id: string
  panelName: string
  provider: string
  collectionDate: string
  status: "PENDING_REVIEW" | "REVIEWED" | "PROCESSING" | "FLAGGED"
  reviewedBy?: string
  reviewedAt?: string
  results: BiomarkerResult[]
}

const mockLabPanels: LabPanel[] = [
  {
    id: "lp-1",
    panelName: "Comprehensive Hormone Panel",
    provider: "Quest Diagnostics",
    collectionDate: "2026-01-15",
    status: "REVIEWED",
    reviewedBy: "Dr. Miller",
    reviewedAt: "2026-01-18",
    results: [
      { name: "Total Testosterone", value: 850, unit: "ng/dL", refRangeLow: 264, refRangeHigh: 916, optimalRangeLow: 600, optimalRangeHigh: 900, flag: "OPTIMAL" },
      { name: "Free Testosterone", value: 22.5, unit: "pg/mL", refRangeLow: 8.7, refRangeHigh: 25.1, optimalRangeLow: 15, optimalRangeHigh: 25, flag: "OPTIMAL" },
      { name: "Estradiol (E2)", value: 45, unit: "pg/mL", refRangeLow: 7.6, refRangeHigh: 42.6, optimalRangeLow: 20, optimalRangeHigh: 35, flag: "HIGH" },
      { name: "SHBG", value: 35, unit: "nmol/L", refRangeLow: 16.5, refRangeHigh: 55.9, optimalRangeLow: 20, optimalRangeHigh: 50, flag: "OPTIMAL" },
      { name: "LH", value: 0.5, unit: "mIU/mL", refRangeLow: 1.7, refRangeHigh: 8.6, optimalRangeLow: 1.7, optimalRangeHigh: 8.6, flag: "LOW" },
      { name: "FSH", value: 0.3, unit: "mIU/mL", refRangeLow: 1.5, refRangeHigh: 12.4, optimalRangeLow: 1.5, optimalRangeHigh: 12.4, flag: "LOW" },
      { name: "PSA", value: 0.8, unit: "ng/mL", refRangeLow: 0, refRangeHigh: 4.0, optimalRangeLow: 0, optimalRangeHigh: 2.5, flag: "OPTIMAL" },
      { name: "Hematocrit", value: 48.5, unit: "%", refRangeLow: 38.3, refRangeHigh: 48.6, optimalRangeLow: 40, optimalRangeHigh: 48, flag: "OPTIMAL" },
    ],
  },
  {
    id: "lp-2",
    panelName: "Metabolic & Thyroid Panel",
    provider: "LabCorp",
    collectionDate: "2026-01-15",
    status: "REVIEWED",
    reviewedBy: "Dr. Miller",
    reviewedAt: "2026-01-18",
    results: [
      { name: "TSH", value: 2.1, unit: "uIU/mL", refRangeLow: 0.45, refRangeHigh: 4.5, optimalRangeLow: 1.0, optimalRangeHigh: 2.5, flag: "OPTIMAL" },
      { name: "Free T4", value: 1.3, unit: "ng/dL", refRangeLow: 0.82, refRangeHigh: 1.77, optimalRangeLow: 1.0, optimalRangeHigh: 1.5, flag: "OPTIMAL" },
      { name: "Free T3", value: 3.2, unit: "pg/mL", refRangeLow: 2.0, refRangeHigh: 4.4, optimalRangeLow: 2.5, optimalRangeHigh: 4.0, flag: "OPTIMAL" },
      { name: "HbA1c", value: 5.4, unit: "%", refRangeLow: 4.0, refRangeHigh: 5.6, optimalRangeLow: 4.5, optimalRangeHigh: 5.3, flag: "OPTIMAL" },
      { name: "Fasting Glucose", value: 92, unit: "mg/dL", refRangeLow: 65, refRangeHigh: 99, optimalRangeLow: 70, optimalRangeHigh: 90, flag: "OPTIMAL" },
      { name: "Vitamin D (25-OH)", value: 62, unit: "ng/mL", refRangeLow: 30, refRangeHigh: 100, optimalRangeLow: 50, optimalRangeHigh: 80, flag: "OPTIMAL" },
    ],
  },
  {
    id: "lp-3",
    panelName: "Comprehensive Hormone Panel",
    provider: "Quest Diagnostics",
    collectionDate: "2025-10-10",
    status: "REVIEWED",
    reviewedBy: "Dr. Miller",
    reviewedAt: "2025-10-14",
    results: [
      { name: "Total Testosterone", value: 310, unit: "ng/dL", refRangeLow: 264, refRangeHigh: 916, optimalRangeLow: 600, optimalRangeHigh: 900, flag: "LOW" },
      { name: "Free Testosterone", value: 9.2, unit: "pg/mL", refRangeLow: 8.7, refRangeHigh: 25.1, optimalRangeLow: 15, optimalRangeHigh: 25, flag: "LOW" },
      { name: "Estradiol (E2)", value: 28, unit: "pg/mL", refRangeLow: 7.6, refRangeHigh: 42.6, optimalRangeLow: 20, optimalRangeHigh: 35, flag: "OPTIMAL" },
      { name: "SHBG", value: 42, unit: "nmol/L", refRangeLow: 16.5, refRangeHigh: 55.9, optimalRangeLow: 20, optimalRangeHigh: 50, flag: "OPTIMAL" },
      { name: "Hematocrit", value: 44.2, unit: "%", refRangeLow: 38.3, refRangeHigh: 48.6, optimalRangeLow: 40, optimalRangeHigh: 48, flag: "OPTIMAL" },
    ],
  },
  {
    id: "lp-4",
    panelName: "Follow-up Hormone Panel",
    provider: "Quest Diagnostics",
    collectionDate: "2026-02-10",
    status: "PENDING_REVIEW",
    results: [
      { name: "Total Testosterone", value: 880, unit: "ng/dL", refRangeLow: 264, refRangeHigh: 916, optimalRangeLow: 600, optimalRangeHigh: 900, flag: "OPTIMAL" },
      { name: "Estradiol (E2)", value: 38, unit: "pg/mL", refRangeLow: 7.6, refRangeHigh: 42.6, optimalRangeLow: 20, optimalRangeHigh: 35, flag: "HIGH" },
      { name: "Hematocrit", value: 50.1, unit: "%", refRangeLow: 38.3, refRangeHigh: 48.6, optimalRangeLow: 40, optimalRangeHigh: 48, flag: "HIGH" },
    ],
  },
]

function getFlagColor(flag: string) {
  switch (flag) {
    case "CRITICAL_HIGH":
    case "CRITICAL_LOW":
      return "text-red-600 bg-red-500/10"
    case "HIGH":
    case "LOW":
      return "text-yellow-600 bg-yellow-500/10"
    case "OPTIMAL":
      return "text-green-600 bg-green-500/10"
    default:
      return "text-muted-foreground bg-muted"
  }
}

function getFlagLabel(flag: string) {
  switch (flag) {
    case "CRITICAL_HIGH": return "CRITICAL HIGH"
    case "CRITICAL_LOW": return "CRITICAL LOW"
    default: return flag
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "REVIEWED":
      return <span className="text-xs font-mono uppercase px-2 py-0.5 bg-green-500/10 text-green-500 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> REVIEWED</span>
    case "PENDING_REVIEW":
      return <span className="text-xs font-mono uppercase px-2 py-0.5 bg-yellow-500/10 text-yellow-500 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> PENDING REVIEW</span>
    case "PROCESSING":
      return <span className="text-xs font-mono uppercase px-2 py-0.5 bg-blue-500/10 text-blue-500">PROCESSING</span>
    case "FLAGGED":
      return <span className="text-xs font-mono uppercase px-2 py-0.5 bg-red-500/10 text-red-500 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> FLAGGED</span>
    default:
      return null
  }
}

export function PatientLabs() {
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all")

  const togglePanel = (panelId: string) => {
    const next = new Set(expandedPanels)
    if (next.has(panelId)) {
      next.delete(panelId)
    } else {
      next.add(panelId)
    }
    setExpandedPanels(next)
  }

  const filteredPanels = mockLabPanels.filter((panel) => {
    if (activeTab === "all") return true
    if (activeTab === "reviewed") return panel.status === "REVIEWED"
    if (activeTab === "pending") return panel.status === "PENDING_REVIEW" || panel.status === "PROCESSING" || panel.status === "FLAGGED"
    return true
  })

  const pendingCount = mockLabPanels.filter(p => p.status !== "REVIEWED").length
  const reviewedCount = mockLabPanels.filter(p => p.status === "REVIEWED").length
  const flaggedResults = mockLabPanels.flatMap(p => p.results).filter(r => r.flag !== "OPTIMAL")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lab Results</h1>
            <p className="text-sm text-muted-foreground">
              {mockLabPanels.length} panel{mockLabPanels.length !== 1 ? "s" : ""} on file
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Total Panels</p>
          <p className="text-3xl font-bold text-foreground mt-1">{mockLabPanels.length}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{pendingCount}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-xs font-mono uppercase text-muted-foreground">Flagged Biomarkers</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{flaggedResults.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-border w-full justify-start bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            All ({mockLabPanels.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            Reviewed ({reviewedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredPanels.length === 0 ? (
            <div className="border border-border p-8 text-center">
              <p className="text-muted-foreground">No lab panels found</p>
            </div>
          ) : (
            filteredPanels.map((panel) => {
              const isExpanded = expandedPanels.has(panel.id)
              const abnormalCount = panel.results.filter(r => r.flag !== "OPTIMAL").length

              return (
                <div key={panel.id} className="border border-border bg-card">
                  {/* Panel Header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => togglePanel(panel.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-foreground">{panel.panelName}</h3>
                        {getStatusBadge(panel.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{panel.provider}</span>
                        <span>Collected {new Date(panel.collectionDate).toLocaleDateString()}</span>
                        <span>{panel.results.length} biomarkers</span>
                        {abnormalCount > 0 && (
                          <span className="text-yellow-500">{abnormalCount} flagged</span>
                        )}
                      </div>
                      {panel.reviewedBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reviewed by {panel.reviewedBy} on {new Date(panel.reviewedAt!).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation() }}>
                        <Download className="w-4 h-4" />
                      </Button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded Results */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      <div className="divide-y divide-border">
                        {panel.results.map((result, idx) => (
                          <div key={idx} className="p-4 grid grid-cols-12 gap-4 items-center">
                            {/* Name */}
                            <div className="col-span-3">
                              <p className="font-medium text-foreground text-sm">{result.name}</p>
                            </div>
                            {/* Value + Unit */}
                            <div className="col-span-2">
                              <p className="font-bold text-foreground">
                                {result.value} <span className="text-xs font-normal text-muted-foreground">{result.unit}</span>
                              </p>
                            </div>
                            {/* Flag */}
                            <div className="col-span-2">
                              <span className={`text-xs font-mono uppercase px-2 py-0.5 ${getFlagColor(result.flag)}`}>
                                {getFlagLabel(result.flag)}
                              </span>
                            </div>
                            {/* Reference Range */}
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Ref Range</p>
                              <p className="text-sm text-foreground">{result.refRangeLow} – {result.refRangeHigh}</p>
                            </div>
                            {/* Optimal Range */}
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Optimal</p>
                              <p className="text-sm text-primary">{result.optimalRangeLow} – {result.optimalRangeHigh}</p>
                            </div>
                            {/* Visual Indicator */}
                            <div className="col-span-1 flex justify-end">
                              {result.flag === "HIGH" || result.flag === "CRITICAL_HIGH" ? (
                                <ArrowUpRight className="w-4 h-4 text-yellow-500" />
                              ) : result.flag === "LOW" || result.flag === "CRITICAL_LOW" ? (
                                <ArrowDownRight className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
