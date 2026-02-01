export interface FormularyItem {
  id: string
  name: string
  category: "medication" | "supplement"
  type: string // e.g., "TRT", "Peptide", "Vitamin", "Mineral"
  dosageOptions: string[]
  frequencyOptions: string[]
  indications: string[]
  contraindications?: string[]
  interactions?: string[]
  notes?: string
}

export const formulary: FormularyItem[] = [
  // Medications - TRT
  {
    id: "test-cyp",
    name: "Testosterone Cypionate",
    category: "medication",
    type: "TRT",
    dosageOptions: ["100mg", "150mg", "200mg"],
    frequencyOptions: ["Weekly", "Twice weekly"],
    indications: ["Low testosterone", "Hypogonadism"],
    contraindications: ["Prostate cancer", "Breast cancer"],
    interactions: ["Anticoagulants"],
  },
  {
    id: "test-prop",
    name: "Testosterone Propionate",
    category: "medication",
    type: "TRT",
    dosageOptions: ["50mg", "100mg"],
    frequencyOptions: ["Every other day", "Daily"],
    indications: ["Low testosterone", "Short-acting TRT preference"],
  },
  {
    id: "hcg",
    name: "HCG (Human Chorionic Gonadotropin)",
    category: "medication",
    type: "TRT Adjunct",
    dosageOptions: ["250 IU", "500 IU", "1000 IU"],
    frequencyOptions: ["2x/week", "3x/week", "EOD"],
    indications: ["Testicular atrophy prevention", "Fertility preservation"],
  },
  {
    id: "anastrozole",
    name: "Anastrozole",
    category: "medication",
    type: "Aromatase Inhibitor",
    dosageOptions: ["0.25mg", "0.5mg", "1mg"],
    frequencyOptions: ["2x/week", "3x/week", "Daily"],
    indications: ["Elevated estradiol", "Estrogen management"],
    notes: "Use cautiously - can over-suppress estrogen",
  },
  {
    id: "enclomiphene",
    name: "Enclomiphene",
    category: "medication",
    type: "SERM",
    dosageOptions: ["12.5mg", "25mg"],
    frequencyOptions: ["Daily", "EOD"],
    indications: ["Fertility preservation", "Natural T production"],
  },

  // Medications - Sexual Wellness
  {
    id: "sildenafil",
    name: "Sildenafil",
    category: "medication",
    type: "PDE5 Inhibitor",
    dosageOptions: ["25mg", "50mg", "100mg"],
    frequencyOptions: ["As needed", "Daily"],
    indications: ["Erectile dysfunction"],
    contraindications: ["Nitrate use"],
  },
  {
    id: "tadalafil",
    name: "Tadalafil",
    category: "medication",
    type: "PDE5 Inhibitor",
    dosageOptions: ["5mg", "10mg", "20mg"],
    frequencyOptions: ["Daily", "As needed"],
    indications: ["Erectile dysfunction", "BPH"],
  },

  // Medications - Peptides
  {
    id: "bpc-157",
    name: "BPC-157",
    category: "medication",
    type: "Peptide",
    dosageOptions: ["250mcg", "500mcg"],
    frequencyOptions: ["Daily", "Twice daily"],
    indications: ["Tissue repair", "Joint health", "GI healing"],
  },
  {
    id: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    category: "medication",
    type: "Peptide",
    dosageOptions: ["2mg", "5mg"],
    frequencyOptions: ["2x/week", "3x/week"],
    indications: ["Recovery", "Inflammation reduction"],
  },

  // Supplements - Vitamins
  {
    id: "vitamin-d3",
    name: "Vitamin D3",
    category: "supplement",
    type: "Vitamin",
    dosageOptions: ["2000 IU", "5000 IU", "10000 IU"],
    frequencyOptions: ["Daily"],
    indications: ["Vitamin D deficiency", "Immune support", "Bone health"],
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12 (Methylcobalamin)",
    category: "supplement",
    type: "Vitamin",
    dosageOptions: ["1000mcg", "5000mcg"],
    frequencyOptions: ["Daily"],
    indications: ["Energy", "Nerve health", "B12 deficiency"],
  },

  // Supplements - Minerals
  {
    id: "magnesium",
    name: "Magnesium Glycinate",
    category: "supplement",
    type: "Mineral",
    dosageOptions: ["200mg", "400mg", "600mg"],
    frequencyOptions: ["Daily", "Before bed"],
    indications: ["Sleep", "Muscle recovery", "Stress management"],
  },
  {
    id: "zinc",
    name: "Zinc Picolinate",
    category: "supplement",
    type: "Mineral",
    dosageOptions: ["15mg", "30mg", "50mg"],
    frequencyOptions: ["Daily"],
    indications: ["Immune support", "Testosterone support"],
    notes: "Best taken with food",
  },

  // Supplements - Performance
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    category: "supplement",
    type: "Performance",
    dosageOptions: ["5g"],
    frequencyOptions: ["Daily"],
    indications: ["Muscle building", "Cognitive function", "Exercise performance"],
  },
  {
    id: "fish-oil",
    name: "Omega-3 Fish Oil",
    category: "supplement",
    type: "Essential Fatty Acid",
    dosageOptions: ["1000mg", "2000mg", "3000mg"],
    frequencyOptions: ["Daily", "Twice daily"],
    indications: ["Cardiovascular health", "Inflammation", "Brain health"],
  },

  // Supplements - Sleep & Recovery
  {
    id: "melatonin",
    name: "Melatonin",
    category: "supplement",
    type: "Sleep Aid",
    dosageOptions: ["1mg", "3mg", "5mg"],
    frequencyOptions: ["Before bed"],
    indications: ["Sleep onset", "Circadian rhythm support"],
  },
  {
    id: "glycine",
    name: "Glycine",
    category: "supplement",
    type: "Amino Acid",
    dosageOptions: ["3g", "5g"],
    frequencyOptions: ["Before bed"],
    indications: ["Sleep quality", "Recovery"],
  },
]

export function getFormulary() {
  return {
    medications: formulary
      .filter((item) => item.category === "medication")
      .map((item) => ({
        name: item.name,
        standardDosing: item.dosageOptions[0],
        frequency: item.frequencyOptions[0],
        instructions: `${item.name} - ${item.indications[0]}`,
      })),
    supplements: formulary
      .filter((item) => item.category === "supplement")
      .map((item) => ({
        name: item.name,
        standardDosing: item.dosageOptions[0],
        frequency: item.frequencyOptions[0],
        instructions: `Take ${item.name} ${item.frequencyOptions[0].toLowerCase()}`,
      })),
  }
}

export function getFormularyByCategory(category: "medication" | "supplement") {
  return formulary.filter((item) => item.category === category)
}

export function getFormularyByType(type: string) {
  return formulary.filter((item) => item.type === type)
}

export function searchFormulary(query: string) {
  const lowerQuery = query.toLowerCase()
  return formulary.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.type.toLowerCase().includes(lowerQuery) ||
      item.indications.some((ind) => ind.toLowerCase().includes(lowerQuery))
  )
}
