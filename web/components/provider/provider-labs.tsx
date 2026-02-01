"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Heart,
  Zap,
  Droplets,
  Shield,
  Flame,
  Brain,
  Pill,
  Search,
  Calendar,
  ArrowUpRight,
  Beaker,
  Dna,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Biomarker data with historical values for sparklines
const biomarkerCategories = {
  hormones: {
    label: "Hormones",
    description: "Sex hormones and related markers",
    icon: Zap,
    status: "optimal",
    markers: [
      {
        name: "Total Testosterone",
        value: 850,
        unit: "ng/dL",
        trend: "increasing",
        trendPercent: 12,
        optimalRange: { min: 600, max: 900, label: "600 - 900 ng/dL" },
        labRange: { min: 300, max: 1000, label: "300 - 1000 ng/dL" },
        status: "optimal",
        history: [420, 580, 720, 780, 820, 850],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Free Testosterone",
        value: 22,
        unit: "pg/mL",
        trend: "increasing",
        trendPercent: 8,
        optimalRange: { min: 15, max: 25, label: "15 - 25 pg/mL" },
        labRange: { min: 9, max: 30, label: "9 - 30 pg/mL" },
        status: "optimal",
        history: [12, 14, 16, 18, 20, 22],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Estradiol",
        value: 28,
        unit: "pg/mL",
        trend: "decreasing",
        trendPercent: 5,
        optimalRange: { min: 20, max: 30, label: "20 - 30 pg/mL" },
        labRange: { min: 10, max: 40, label: "10 - 42.6 pg/mL" },
        status: "optimal",
        history: [35, 32, 30, 29, 28, 28],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "DHEA-S",
        value: 420,
        unit: "ug/dL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 300, max: 500, label: "300 - 500 ug/dL" },
        labRange: { min: 164, max: 530, label: "164 - 530 ug/dL" },
        status: "optimal",
        history: [380, 400, 410, 415, 418, 420],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Cortisol",
        value: 14.5,
        unit: "ug/dL",
        trend: "decreasing",
        trendPercent: 8,
        optimalRange: { min: 10, max: 18, label: "10 - 18 ug/dL" },
        labRange: { min: 6, max: 23, label: "6 - 23 ug/dL" },
        status: "optimal",
        history: [22, 20, 18, 16, 15, 14.5],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "SHBG",
        value: 32,
        unit: "nmol/L",
        trend: "decreasing",
        trendPercent: 3,
        optimalRange: { min: 20, max: 40, label: "20 - 40 nmol/L" },
        labRange: { min: 10, max: 55, label: "10 - 55.9 nmol/L" },
        status: "normal",
        history: [38, 36, 35, 34, 33, 32],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Pregnenolone",
        value: 165,
        unit: "ng/dL",
        trend: "increasing",
        trendPercent: 15,
        optimalRange: { min: 100, max: 200, label: "100 - 200 ng/dL" },
        labRange: { min: 22, max: 237, label: "22 - 237 ng/dL" },
        status: "optimal",
        history: [85, 100, 120, 140, 155, 165],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  thyroid: {
    label: "Thyroid",
    description: "Thyroid function and metabolism regulation",
    icon: Activity,
    status: "optimal",
    markers: [
      {
        name: "TSH",
        value: 1.8,
        unit: "mIU/L",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 1.0, max: 2.5, label: "1.0 - 2.5 mIU/L" },
        labRange: { min: 0.4, max: 4.0, label: "0.4 - 4.0 mIU/L" },
        status: "optimal",
        history: [2.1, 2.0, 1.9, 1.9, 1.8, 1.8],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Free T4",
        value: 1.2,
        unit: "ng/dL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 1.0, max: 1.5, label: "1.0 - 1.5 ng/dL" },
        labRange: { min: 0.8, max: 1.8, label: "0.8 - 1.8 ng/dL" },
        status: "optimal",
        history: [1.1, 1.1, 1.2, 1.2, 1.2, 1.2],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Free T3",
        value: 3.2,
        unit: "pg/mL",
        trend: "increasing",
        trendPercent: 3,
        optimalRange: { min: 3.0, max: 4.0, label: "3.0 - 4.0 pg/mL" },
        labRange: { min: 2.3, max: 4.2, label: "2.3 - 4.2 pg/mL" },
        status: "optimal",
        history: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  cancer: {
    label: "Cancer Screening",
    description: "Prostate and cancer markers",
    icon: Shield,
    status: "optimal",
    markers: [
      {
        name: "PSA",
        value: 0.8,
        unit: "ng/mL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 0, max: 2.5, label: "0 - 2.5 ng/mL" },
        labRange: { min: 0, max: 4.0, label: "0 - 4.0 ng/mL" },
        status: "optimal",
        history: [0.9, 0.85, 0.82, 0.8, 0.8, 0.8],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  metabolic: {
    label: "Metabolic Panel",
    description: "Blood sugar, cholesterol, and cardiovascular health",
    icon: Heart,
    status: "attention",
    markers: [
      {
        name: "Hematocrit",
        value: 52,
        unit: "%",
        trend: "increasing",
        trendPercent: 4,
        optimalRange: { min: 40, max: 50, label: "40 - 50 %" },
        labRange: { min: 38, max: 54, label: "38 - 54 %" },
        status: "high",
        history: [46, 48, 49, 50, 51, 52],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Hemoglobin",
        value: 17.2,
        unit: "g/dL",
        trend: "increasing",
        trendPercent: 3,
        optimalRange: { min: 14, max: 17, label: "14 - 17 g/dL" },
        labRange: { min: 13.5, max: 17.5, label: "13.5 - 17.5 g/dL" },
        status: "borderline",
        history: [15.8, 16.2, 16.5, 16.8, 17.0, 17.2],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Fasting Glucose",
        value: 92,
        unit: "mg/dL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 70, max: 90, label: "70 - 90 mg/dL" },
        labRange: { min: 65, max: 99, label: "65 - 99 mg/dL" },
        status: "normal",
        history: [88, 90, 91, 92, 91, 92],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  kidney: {
    label: "Kidney Function",
    description: "Kidney health and electrolyte balance",
    icon: Droplets,
    status: "optimal",
    markers: [
      {
        name: "Creatinine",
        value: 1.0,
        unit: "mg/dL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 0.7, max: 1.2, label: "0.7 - 1.2 mg/dL" },
        labRange: { min: 0.6, max: 1.3, label: "0.6 - 1.3 mg/dL" },
        status: "optimal",
        history: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "eGFR",
        value: 95,
        unit: "mL/min",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 90, max: 120, label: "90 - 120 mL/min" },
        labRange: { min: 60, max: 120, label: ">60 mL/min" },
        status: "optimal",
        history: [94, 95, 95, 95, 95, 95],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  liver: {
    label: "Liver Function",
    description: "Liver health and protein metabolism",
    icon: Beaker,
    status: "optimal",
    markers: [
      {
        name: "ALT",
        value: 28,
        unit: "U/L",
        trend: "decreasing",
        trendPercent: 5,
        optimalRange: { min: 10, max: 35, label: "10 - 35 U/L" },
        labRange: { min: 7, max: 56, label: "7 - 56 U/L" },
        status: "optimal",
        history: [35, 33, 31, 30, 29, 28],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "AST",
        value: 24,
        unit: "U/L",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 10, max: 30, label: "10 - 30 U/L" },
        labRange: { min: 10, max: 40, label: "10 - 40 U/L" },
        status: "optimal",
        history: [26, 25, 25, 24, 24, 24],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  cbc: {
    label: "Complete Blood Count",
    description: "Red blood cells, white blood cells, and platelets",
    icon: Dna,
    status: "optimal",
    markers: [
      {
        name: "RBC",
        value: 5.2,
        unit: "M/uL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 4.5, max: 5.5, label: "4.5 - 5.5 M/uL" },
        labRange: { min: 4.0, max: 6.0, label: "4.0 - 6.0 M/uL" },
        status: "optimal",
        history: [5.1, 5.2, 5.2, 5.2, 5.2, 5.2],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  iron: {
    label: "Iron Studies",
    description: "Iron levels and storage capacity",
    icon: Stethoscope,
    status: "optimal",
    markers: [
      {
        name: "Ferritin",
        value: 120,
        unit: "ng/mL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 50, max: 200, label: "50 - 200 ng/mL" },
        labRange: { min: 20, max: 300, label: "20 - 300 ng/mL" },
        status: "optimal",
        history: [115, 118, 119, 120, 120, 120],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  inflammation: {
    label: "Inflammation & Cardiovascular",
    description: "Inflammatory markers and heart disease risk",
    icon: Flame,
    status: "optimal",
    markers: [
      {
        name: "hs-CRP",
        value: 0.8,
        unit: "mg/L",
        trend: "decreasing",
        trendPercent: 20,
        optimalRange: { min: 0, max: 1.0, label: "< 1.0 mg/L" },
        labRange: { min: 0, max: 3.0, label: "< 3.0 mg/L" },
        status: "optimal",
        history: [1.8, 1.5, 1.2, 1.0, 0.9, 0.8],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Homocysteine",
        value: 8.5,
        unit: "umol/L",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 5, max: 10, label: "5 - 10 umol/L" },
        labRange: { min: 4, max: 15, label: "4 - 15 umol/L" },
        status: "optimal",
        history: [9.2, 9.0, 8.8, 8.6, 8.5, 8.5],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
  vitamins: {
    label: "Vitamins",
    description: "Essential vitamin levels",
    icon: Pill,
    status: "attention",
    markers: [
      {
        name: "Vitamin D",
        value: 45,
        unit: "ng/mL",
        trend: "increasing",
        trendPercent: 25,
        optimalRange: { min: 50, max: 80, label: "50 - 80 ng/mL" },
        labRange: { min: 30, max: 100, label: "30 - 100 ng/mL" },
        status: "suboptimal",
        history: [28, 32, 36, 40, 43, 45],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      {
        name: "Vitamin B12",
        value: 650,
        unit: "pg/mL",
        trend: "stable",
        trendPercent: 0,
        optimalRange: { min: 500, max: 1000, label: "500 - 1000 pg/mL" },
        labRange: { min: 200, max: 1100, label: "200 - 1100 pg/mL" },
        status: "optimal",
        history: [620, 630, 640, 645, 650, 650],
        dates: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    ],
  },
}

type MarkerType = typeof biomarkerCategories.hormones.markers[0]

// SVG Sparkline with gradient fill and hover tooltips
function Sparkline({ data, dates, unit, status }: { data: number[]; dates: string[]; unit: string; status: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  if (!data || data.length < 2) return null
  
  const width = 160
  const height = 56
  const padding = 4
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (value - min) / range) * (height - padding * 2)
    return { x, y, value }
  })
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
  
  const color = status === "optimal" || status === "normal" ? "#06b6d4" : 
                status === "high" || status === "low" ? "#f97316" : "#06b6d4"
  
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 7 : (index === points.length - 1 ? 5 : 3)}
              fill={color}
              stroke={hoveredIndex === index || index === points.length - 1 ? "#0a0a0a" : "none"}
              strokeWidth={hoveredIndex === index || index === points.length - 1 ? 2 : 0}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Larger invisible hit area for easier hover */}
            <circle
              cx={point.x}
              cy={point.y}
              r={12}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}
      </svg>
      
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-50 px-3 py-2 bg-zinc-900 border border-zinc-700 shadow-xl pointer-events-none"
          style={{
            left: `${points[hoveredIndex].x}px`,
            top: `${points[hoveredIndex].y - 48}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-xs text-zinc-400 mb-0.5">{dates[hoveredIndex]} 2025</div>
          <div className="text-sm font-bold text-foreground">{points[hoveredIndex].value} {unit}</div>
          <div 
            className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-zinc-900 border-r border-b border-zinc-700 transform -translate-x-1/2 rotate-45"
          />
        </div>
      )}
    </div>
  )
}

// Status badge with refined styling
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    optimal: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "OPTIMAL" },
    normal: { bg: "bg-blue-500/15", text: "text-blue-400", label: "NORMAL" },
    suboptimal: { bg: "bg-amber-500/15", text: "text-amber-400", label: "SUBOPTIMAL" },
    borderline: { bg: "bg-amber-500/15", text: "text-amber-400", label: "BORDERLINE" },
    high: { bg: "bg-orange-500/15", text: "text-orange-400", label: "HIGH" },
    low: { bg: "bg-orange-500/15", text: "text-orange-400", label: "LOW" },
    attention: { bg: "bg-amber-500/15", text: "text-amber-400", label: "ATTENTION" },
  }
  
  const { bg, text, label } = config[status] || config.normal
  
  return (
    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold tracking-widest ${bg} ${text}`}>
      {label}
    </span>
  )
}

// Trend indicator
function TrendIndicator({ trend, percent }: { trend: string; percent: number }) {
  if (trend === "stable") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
        <Minus className="w-3.5 h-3.5" />
        <span>Stable</span>
      </span>
    )
  }
  
  const isUp = trend === "increasing"
  const color = isUp ? "text-emerald-400" : "text-amber-400"
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${color}`}>
      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      <span>{isUp ? "+" : ""}{percent}% {isUp ? "Increasing" : "Decreasing"}</span>
    </span>
  )
}

// Biomarker card - premium design
function BiomarkerCard({ marker }: { marker: MarkerType }) {
  const isFirstTest = marker.history.length === 1
  
  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-100 truncate">{marker.name}</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">Primary hormone marker</p>
        </div>
        <StatusBadge status={marker.status} />
      </div>
      
      {/* Large Value Display */}
      <div className={isFirstTest ? "mt-3 mb-1" : "mt-4 mb-1"}>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight text-zinc-50">{marker.value}</span>
          <span className="text-base font-medium text-zinc-500">{marker.unit}</span>
        </div>
        {!isFirstTest && (
          <div className="mt-2">
            <TrendIndicator trend={marker.trend} percent={marker.trendPercent} />
          </div>
        )}
      </div>
      
      {/* Range Information */}
      <div className={isFirstTest ? "mt-4 pt-3 border-t border-zinc-800/80" : "mt-5 pt-4 border-t border-zinc-800/80"}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1">Your optimal zone</p>
            <p className="text-xs font-semibold text-primary">{marker.optimalRange.label}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1">Lab reference range</p>
            <p className="text-xs font-medium text-zinc-400">{marker.labRange.label}</p>
          </div>
        </div>
      </div>
      
      {/* Sparkline Chart or Baseline Indicator */}
      {marker.history.length > 1 ? (
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <p className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-3">Historical Trend</p>
          <div className="flex items-end gap-3">
            <Sparkline data={marker.history} dates={marker.dates} unit={marker.unit} status={marker.status} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-zinc-600">{marker.dates[0]}</span>
            <span className="text-[10px] text-zinc-600">{marker.dates[marker.dates.length - 1]}</span>
          </div>
        </div>
      ) : (
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase mb-1">Test Date</p>
              <p className="text-xs font-medium text-zinc-400">{marker.dates[0]} 2025</p>
            </div>
            <div className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50">
              <span className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">Baseline Value</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Category panel - collapsible
function CategoryPanel({ 
  categoryKey,
  data, 
  isExpanded, 
  onToggle 
}: { 
  categoryKey: string
  data: typeof biomarkerCategories.hormones
  isExpanded: boolean
  onToggle: () => void
}) {
  const Icon = data.icon
  
  const statusConfig: Record<string, { color: string; label: string }> = {
    optimal: { color: "text-emerald-400", label: "All optimal" },
    attention: { color: "text-amber-400", label: "Needs attention" },
    critical: { color: "text-red-400", label: "Critical" },
  }
  
  const { color, label } = statusConfig[data.status] || statusConfig.optimal
  
  return (
    <div className="border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-colors hover:border-zinc-700/80">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-zinc-100">{data.label}</h3>
              <span className="text-xs text-zinc-600">{data.markers.length} biomarkers</span>
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{data.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className={`text-sm font-medium ${color}`}>{label}</span>
          <div className="w-8 h-8 flex items-center justify-center text-zinc-500">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-zinc-800/60">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pt-5">
            {data.markers.map((marker) => (
              <BiomarkerCard key={marker.name} marker={marker} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ProviderLabs() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["hormones"]))
  const [selectedPatient, setSelectedPatient] = useState("michael-chen")
  const [dateRange, setDateRange] = useState("6m")
  
  const toggleCategory = (category: string) => {
    const next = new Set(expandedCategories)
    if (next.has(category)) {
      next.delete(category)
    } else {
      next.add(category)
    }
    setExpandedCategories(next)
  }
  
  const expandAll = () => setExpandedCategories(new Set(Object.keys(biomarkerCategories)))
  const collapseAll = () => setExpandedCategories(new Set())

  // Calculate summary stats
  const allMarkers = Object.values(biomarkerCategories).flatMap(cat => cat.markers)
  const optimalCount = allMarkers.filter(m => m.status === "optimal" || m.status === "normal").length
  const attentionCount = allMarkers.filter(m => ["high", "low", "suboptimal", "borderline"].includes(m.status)).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-[1800px] mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Lab Results</h1>
              <p className="text-sm text-zinc-500 mt-1">Comprehensive biomarker analysis and trends</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  placeholder="Search biomarkers..." 
                  className="pl-10 w-56 bg-zinc-900/50 border-zinc-800 text-sm placeholder:text-zinc-600 focus:border-zinc-700"
                />
              </div>
              
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-44 bg-zinc-900/50 border-zinc-800 text-sm">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="michael-chen">Michael Chen</SelectItem>
                  <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                  <SelectItem value="james-anderson">James Anderson</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-36 bg-zinc-900/50 border-zinc-800 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-zinc-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>
      
      {/* Summary Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/20">
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">{optimalCount}</span> Optimal
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">{attentionCount}</span> Needs Attention
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
                <span className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">{allMarkers.length}</span> Total Markers
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
<button onClick={expandAll} className="text-xs text-zinc-400 hover:text-primary transition-colors">
    Expand All
  </button>
  <span className="text-zinc-700">|</span>
  <button onClick={collapseAll} className="text-xs text-zinc-400 hover:text-primary transition-colors">
    Collapse All
  </button>
              <Link href="/provider/labs/compare">
                <Button variant="outline" size="sm" className="ml-2 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 text-xs">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />
                  Compare Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="space-y-3">
          {Object.entries(biomarkerCategories).map(([key, data]) => (
            <CategoryPanel
              key={key}
              categoryKey={key}
              data={data}
              isExpanded={expandedCategories.has(key)}
              onToggle={() => toggleCategory(key)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
