"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

const labPanels = [
  {
    id: "essential",
    name: "Essential Male Panel",
    labsOnlyPrice: 199,
    withConsultPrice: 299,
    recommended: false,
    description: "Core hormone and metabolic markers for baseline assessment",
    categories: [
      {
        name: "Hormone Profile",
        biomarkers: [
          { name: "Total Testosterone", range: "600-900 ng/dL" },
          { name: "Free Testosterone", range: "15-25 pg/mL" },
          { name: "Estradiol", range: "20-40 pg/mL" },
          { name: "SHBG", range: "20-50 nmol/L" },
        ],
      },
      {
        name: "Thyroid Status",
        biomarkers: [{ name: "TSH", range: "0.5-2.5 mIU/L" }],
      },
      {
        name: "Prostate Health",
        biomarkers: [{ name: "PSA, Total", range: "<1.0 ng/mL" }],
      },
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Total Health Panel",
    labsOnlyPrice: 449,
    withConsultPrice: 599,
    recommended: true,
    description: "Full 74-biomarker panel for complete hormone optimization and metabolic health",
    categories: [
      {
        name: "Hormone Profile",
        biomarkers: [
          { name: "Total Testosterone", range: "600-900 ng/dL" },
          { name: "Free Testosterone", range: "15-25 pg/mL" },
          { name: "Estradiol", range: "20-40 pg/mL" },
          { name: "SHBG", range: "20-50 nmol/L" },
          { name: "Prolactin", range: "5-15 ng/mL" },
          { name: "Cortisol", range: "10-18 μg/dL" },
          { name: "DHEA-S", range: "280-640 μg/dL" },
          { name: "LH", range: "3-10 mIU/mL" },
          { name: "FSH", range: "2-8 mIU/mL" },
          { name: "IGF-1", range: "150-300 ng/mL" },
          { name: "Progesterone", range: "0.3-1.2 ng/mL" },
        ],
      },
      {
        name: "Thyroid Status",
        biomarkers: [
          { name: "TSH", range: "0.5-2.5 mIU/L" },
          { name: "Free T4", range: "1.2-1.8 ng/dL" },
          { name: "Free T3", range: "3.0-4.5 pg/mL" },
        ],
      },
      {
        name: "Heart Health",
        biomarkers: [
          { name: "hs-CRP", range: "<1.0 mg/L" },
          { name: "Apolipoprotein B (ApoB)", range: "<90 mg/dL" },
          { name: "Total Cholesterol", range: "<200 mg/dL" },
          { name: "HDL Cholesterol", range: ">50 mg/dL" },
          { name: "LDL Cholesterol", range: "<100 mg/dL" },
          { name: "LDL:HDL Ratio", range: "<3.0" },
          { name: "VLDL Cholesterol", range: "<30 mg/dL" },
          { name: "Triglycerides", range: "<100 mg/dL" },
        ],
      },
      {
        name: "Metabolic Activity",
        biomarkers: [
          { name: "Glucose", range: "70-90 mg/dL" },
          { name: "Fasting Insulin", range: "3-8 μIU/mL" },
          { name: "HbA1c", range: "4.5-5.5%" },
        ],
      },
      {
        name: "Organ Function / CMP",
        biomarkers: [
          { name: "AST", range: "15-30 U/L" },
          { name: "ALT", range: "15-30 U/L" },
          { name: "BUN", range: "10-20 mg/dL" },
          { name: "Creatinine", range: "0.8-1.2 mg/dL" },
          { name: "eGFR", range: ">90 mL/min" },
          { name: "Bilirubin, Total", range: "0.2-1.0 mg/dL" },
          { name: "GGT", range: "10-35 U/L" },
          { name: "Sodium", range: "136-145 mEq/L" },
          { name: "Potassium", range: "3.5-5.0 mEq/L" },
          { name: "Chloride", range: "98-106 mEq/L" },
          { name: "CO2", range: "23-29 mEq/L" },
          { name: "Calcium", range: "8.5-10.5 mg/dL" },
          { name: "Total Protein", range: "6.0-8.0 g/dL" },
          { name: "Albumin", range: "3.5-5.0 g/dL" },
          { name: "Globulin", range: "2.0-3.5 g/dL" },
          { name: "A/G Ratio", range: "1.0-2.5" },
          { name: "Alkaline Phosphatase", range: "40-100 U/L" },
        ],
      },
      {
        name: "Prostate Health",
        biomarkers: [
          { name: "PSA, Total", range: "<1.0 ng/mL" },
          { name: "PSA, Free %", range: ">25%" },
        ],
      },
      {
        name: "Nutrient Status",
        biomarkers: [
          { name: "Magnesium", range: "2.0-2.5 mg/dL" },
          { name: "Vitamin D, 25-OH", range: "50-80 ng/mL" },
        ],
      },
      {
        name: "Iron Panel",
        biomarkers: [
          { name: "Iron", range: "60-170 μg/dL" },
          { name: "Transferrin Saturation", range: "20-50%" },
          { name: "Iron Saturation", range: "20-50%" },
          { name: "TIBC", range: "250-370 μg/dL" },
          { name: "UIBC", range: "150-300 μg/dL" },
          { name: "Ferritin", range: "75-150 ng/mL" },
        ],
      },
      {
        name: "Complete Blood Count (CBC)",
        biomarkers: [
          { name: "WBC", range: "4.5-11.0 K/μL" },
          { name: "RBC", range: "4.5-5.5 M/μL" },
          { name: "Hemoglobin", range: "14-17 g/dL" },
          { name: "Hematocrit", range: "40-50%" },
          { name: "MCV", range: "80-100 fL" },
          { name: "MCH", range: "27-33 pg" },
          { name: "MCHC", range: "32-36 g/dL" },
          { name: "RDW", range: "11.5-14.5%" },
          { name: "Platelets", range: "150-400 K/μL" },
        ],
      },
    ],
  },
  {
    id: "executive",
    name: "Executive Performance Panel",
    labsOnlyPrice: 799,
    withConsultPrice: 999,
    recommended: false,
    description: "Everything in Comprehensive plus advanced cardiovascular and longevity markers",
    categories: [
      {
        name: "Hormone Profile",
        biomarkers: [
          { name: "Total Testosterone", range: "600-900 ng/dL" },
          { name: "Free Testosterone", range: "15-25 pg/mL" },
          { name: "Estradiol", range: "20-40 pg/mL" },
          { name: "SHBG", range: "20-50 nmol/L" },
          { name: "Prolactin", range: "5-15 ng/mL" },
          { name: "Cortisol", range: "10-18 μg/dL" },
          { name: "DHEA-S", range: "280-640 μg/dL" },
          { name: "LH", range: "3-10 mIU/mL" },
          { name: "FSH", range: "2-8 mIU/mL" },
          { name: "IGF-1", range: "150-300 ng/mL" },
          { name: "Progesterone", range: "0.3-1.2 ng/mL" },
          { name: "Pregnenolone", range: "50-200 ng/dL" },
        ],
      },
      {
        name: "Thyroid Status",
        biomarkers: [
          { name: "TSH", range: "0.5-2.5 mIU/L" },
          { name: "Free T4", range: "1.2-1.8 ng/dL" },
          { name: "Free T3", range: "3.0-4.5 pg/mL" },
          { name: "Reverse T3", range: "10-24 ng/dL" },
          { name: "Thyroid Antibodies", range: "Negative" },
        ],
      },
      {
        name: "Advanced Cardiovascular",
        biomarkers: [
          { name: "hs-CRP", range: "<1.0 mg/L" },
          { name: "Apolipoprotein B (ApoB)", range: "<90 mg/dL" },
          { name: "Lp(a)", range: "<30 nmol/L" },
          { name: "Homocysteine", range: "<10 μmol/L" },
          { name: "Total Cholesterol", range: "<200 mg/dL" },
          { name: "HDL Cholesterol", range: ">50 mg/dL" },
          { name: "LDL Cholesterol", range: "<100 mg/dL" },
          { name: "LDL Particle Number", range: "<1000 nmol/L" },
          { name: "Small Dense LDL", range: "<20%" },
          { name: "VLDL Cholesterol", range: "<30 mg/dL" },
          { name: "Triglycerides", range: "<100 mg/dL" },
        ],
      },
      {
        name: "Metabolic Activity",
        biomarkers: [
          { name: "Glucose", range: "70-90 mg/dL" },
          { name: "Fasting Insulin", range: "3-8 μIU/mL" },
          { name: "HbA1c", range: "4.5-5.5%" },
          { name: "HOMA-IR", range: "<1.0" },
          { name: "C-Peptide", range: "0.8-3.1 ng/mL" },
        ],
      },
      {
        name: "Organ Function / CMP",
        biomarkers: [
          { name: "AST", range: "15-30 U/L" },
          { name: "ALT", range: "15-30 U/L" },
          { name: "BUN", range: "10-20 mg/dL" },
          { name: "Creatinine", range: "0.8-1.2 mg/dL" },
          { name: "eGFR", range: ">90 mL/min" },
          { name: "Cystatin C", range: "0.6-1.0 mg/L" },
          { name: "Bilirubin, Total", range: "0.2-1.0 mg/dL" },
          { name: "GGT", range: "10-35 U/L" },
          { name: "Uric Acid", range: "3.5-7.0 mg/dL" },
        ],
      },
      {
        name: "Prostate Health",
        biomarkers: [
          { name: "PSA, Total", range: "<1.0 ng/mL" },
          { name: "PSA, Free %", range: ">25%" },
        ],
      },
      {
        name: "Nutrient Status",
        biomarkers: [
          { name: "Magnesium (RBC)", range: "5.0-7.0 mg/dL" },
          { name: "Vitamin D, 25-OH", range: "50-80 ng/mL" },
          { name: "Vitamin B12", range: "500-1000 pg/mL" },
          { name: "Folate", range: ">20 ng/mL" },
          { name: "Zinc", range: "80-120 μg/dL" },
          { name: "Copper", range: "70-140 μg/dL" },
          { name: "Selenium", range: "100-150 μg/L" },
          { name: "Omega-3 Index", range: ">8%" },
        ],
      },
      {
        name: "Iron Panel",
        biomarkers: [
          { name: "Iron", range: "60-170 μg/dL" },
          { name: "Transferrin Saturation", range: "20-50%" },
          { name: "TIBC", range: "250-370 μg/dL" },
          { name: "Ferritin", range: "75-150 ng/mL" },
        ],
      },
      {
        name: "Complete Blood Count (CBC)",
        biomarkers: [
          { name: "WBC", range: "4.5-11.0 K/μL" },
          { name: "RBC", range: "4.5-5.5 M/μL" },
          { name: "Hemoglobin", range: "14-17 g/dL" },
          { name: "Hematocrit", range: "40-50%" },
          { name: "MCV", range: "80-100 fL" },
          { name: "MCH", range: "27-33 pg" },
          { name: "MCHC", range: "32-36 g/dL" },
          { name: "RDW", range: "11.5-14.5%" },
          { name: "Platelets", range: "150-400 K/μL" },
        ],
      },
    ],
  },
]

// Helper to count total biomarkers
const getTotalBiomarkers = (categories: { biomarkers: { name: string; range: string }[] }[]) =>
  categories.reduce((acc, cat) => acc + cat.biomarkers.length, 0)

export function BiomarkerSection() {
  const [selectedPanel, setSelectedPanel] = useState("comprehensive")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [includeConsult, setIncludeConsult] = useState(true)

  const activePanel = labPanels.find((p) => p.id === selectedPanel) || labPanels[1]

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName],
    )
  }

  const expandAll = () => {
    setExpandedCategories(activePanel.categories.map((c) => c.name))
  }

  const collapseAll = () => {
    setExpandedCategories([])
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <span className="text-mono-upper text-primary text-sm">Lab Panels</span>
          <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mt-4">
            SELECT YOUR
            <br />
            <span className="text-primary">PANEL</span>
          </h2>
        </div>

        {/* Purchase Option Toggle */}
        <div className="mb-6 sm:mb-10 border border-border p-4 sm:p-6">
          <span className="text-mono-upper text-muted-foreground text-xs block mb-4">Purchase Option</span>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => setIncludeConsult(false)}
              className={`flex-1 p-3 sm:p-4 border transition-colors text-left ${
                !includeConsult ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-bold text-sm sm:text-base">Labs Only</span>
                <div
                  className={`w-5 h-5 border ${!includeConsult ? "border-primary bg-primary" : "border-muted-foreground"} flex items-center justify-center`}
                >
                  {!includeConsult && <Check className="w-3 h-3 text-background" />}
                </div>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Lab results with AI-powered analysis and optimal ranges
              </p>
            </button>
            <button
              onClick={() => setIncludeConsult(true)}
              className={`flex-1 p-3 sm:p-4 border transition-colors text-left relative ${
                includeConsult ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/50"
              }`}
            >
              <span className="absolute -top-3 right-4 text-mono-upper text-[10px] sm:text-xs text-background bg-primary px-2 py-0.5">
                Recommended
              </span>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-bold text-sm sm:text-base">Labs + Provider Consult</span>
                <div
                  className={`w-5 h-5 border ${includeConsult ? "border-primary bg-primary" : "border-muted-foreground"} flex items-center justify-center`}
                >
                  {includeConsult && <Check className="w-3 h-3 text-background" />}
                </div>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Everything above plus 30-min consultation with a hormone specialist
              </p>
            </button>
          </div>
        </div>

        {/* Panel Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border mb-10 sm:mb-16">
          {labPanels.map((panel, index) => (
            <button
              key={panel.id}
              onClick={() => {
                setSelectedPanel(panel.id)
                setExpandedCategories([])
              }}
              className={`relative p-4 sm:p-6 lg:p-8 text-left transition-colors ${
                index !== labPanels.length - 1 ? "md:border-r border-b md:border-b-0 border-border" : ""
              } ${selectedPanel === panel.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
            >
              {panel.recommended && (
                <span className="absolute top-3 sm:top-4 right-3 sm:right-4 text-mono-upper text-[10px] sm:text-xs text-background bg-primary px-2 py-1">
                  Recommended
                </span>
              )}

              <div
                className={`w-5 h-5 border ${selectedPanel === panel.id ? "border-primary bg-primary" : "border-muted-foreground"} flex items-center justify-center mb-4 sm:mb-6`}
              >
                {selectedPanel === panel.id && <Check className="w-3 h-3 text-background" />}
              </div>

              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2">{panel.name}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">{panel.description}</p>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ${includeConsult ? panel.withConsultPrice : panel.labsOnlyPrice}
                </span>
                <span className="text-mono-upper text-muted-foreground text-[10px] sm:text-xs">
                  / {includeConsult ? "with consult" : "labs only"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="text-mono-upper text-muted-foreground text-[10px] sm:text-xs">
                  {getTotalBiomarkers(panel.categories)} Biomarkers
                </span>
                <span className="text-mono-upper text-muted-foreground text-[10px] sm:text-xs">
                  {panel.categories.length} Categories
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Panel Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:min-h-[800px]">
          {/* Left - Panel Info */}
          <div className="flex flex-col">
            {activePanel.recommended && (
              <span className="text-mono-upper text-xs text-background bg-primary px-2 py-1 self-start mb-4">
                Recommended
              </span>
            )}

            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{activePanel.name}</h3>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-10 leading-relaxed">
              {activePanel.description}
            </p>

            {/* Category Summary */}
            <div className="border border-border mb-6 sm:mb-10">
              <div className="p-3 sm:p-4 border-b border-border bg-secondary">
                <span className="text-mono-upper text-muted-foreground text-xs sm:text-sm">Categories Included</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {activePanel.categories.map((cat, i) => (
                  <div
                    key={cat.name}
                    className={`p-3 sm:p-4 ${i % 2 === 0 ? "sm:border-r border-border" : ""} ${i < activePanel.categories.length - 2 ? "border-b border-border" : ""}`}
                  >
                    <span className="text-foreground text-xs sm:text-sm">{cat.name}</span>
                    <span className="text-mono-upper text-primary text-[10px] sm:text-xs ml-2">
                      ({cat.biomarkers.length})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Features List */}
            <div className="space-y-3 sm:space-y-4 border-t border-border pt-6 sm:pt-8">
              {[
                "Optimal ranges, not just normal",
                "Results within 48 hours",
                "AI-powered analysis included",
                ...(includeConsult ? ["30-min provider consultation included"] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 py-2 sm:py-3 border-b border-border">
                  <span className="text-mono-upper text-primary w-6 sm:w-8 text-xs sm:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* Updated CTA */}
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="bg-primary text-background px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base hover:bg-primary/90 transition-colors">
                SELECT — ${includeConsult ? activePanel.withConsultPrice : activePanel.labsOnlyPrice}
              </button>
              <button className="border border-border text-foreground px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base hover:bg-secondary transition-colors">
                COMPARE ALL
              </button>
            </div>
          </div>

          {/* Right - Biomarker Accordion by Category */}
          <div className="border border-border flex flex-col h-[400px] sm:h-[500px] lg:h-full">
            <div className="p-3 sm:p-4 border-b border-border bg-secondary flex justify-between items-center shrink-0">
              <span className="text-mono-upper text-muted-foreground text-xs sm:text-sm">All Biomarkers</span>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={expandAll}
                  className="text-mono-upper text-[10px] sm:text-xs text-primary hover:underline"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-mono-upper text-[10px] sm:text-xs text-muted-foreground hover:underline"
                >
                  Collapse All
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {activePanel.categories.map((category, catIndex) => {
                const isExpanded = expandedCategories.includes(category.name)
                return (
                  <div
                    key={category.name}
                    className={catIndex !== activePanel.categories.length - 1 ? "border-b border-border" : ""}
                  >
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full p-3 sm:p-4 flex justify-between items-center hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-foreground font-medium text-sm sm:text-base">{category.name}</span>
                        <span className="text-mono-upper text-[10px] sm:text-xs text-primary bg-primary/10 px-2 py-0.5">
                          {category.biomarkers.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-secondary/30">
                        {category.biomarkers.map((marker, i) => (
                          <div
                            key={marker.name}
                            className={`grid grid-cols-2 ${i !== category.biomarkers.length - 1 ? "border-b border-border/50" : ""}`}
                          >
                            <div className="p-2 sm:p-3 pl-4 sm:pl-8 border-r border-border/50">
                              <span className="text-foreground text-xs sm:text-sm">{marker.name}</span>
                            </div>
                            <div className="p-2 sm:p-3">
                              <span className="text-primary font-mono text-xs sm:text-sm">{marker.range}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
