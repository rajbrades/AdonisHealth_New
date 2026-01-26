/**
 * Analyze sample lab PDFs against our biomarker alias database
 * Tests extraction accuracy and identifies missing aliases
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extracted biomarkers from Quest PDF (Stephen Martin)
const questBiomarkers = [
  { name: 'IRON, TOTAL', value: '49', unit: 'mcg/dL', flag: 'L' },
  { name: 'IRON BINDING CAPACITY', value: '281', unit: 'mcg/dL', flag: null },
  { name: '% SATURATION', value: '17', unit: '%', flag: 'L' },
  { name: 'FERRITIN', value: '166', unit: 'ng/mL', flag: null },
  { name: 'TRIGLYCERIDES', value: '132', unit: 'mg/dL', flag: null },
  { name: 'CHOLESTEROL, VERY LOW DENSITY LIPOPROTEIN', value: '26', unit: 'mg/dL', flag: null },
  { name: 'TESTOSTERONE, TOTAL, MS', value: '211', unit: 'ng/dL', flag: 'L' },
  { name: 'TESTOSTERONE, FREE', value: '47.9', unit: 'pg/mL', flag: null },
  { name: 'TESTOSTERONE,BIOAVAILABLE', value: '71.4', unit: 'ng/dL', flag: 'L' },
  { name: 'SEX HORMONE BINDING GLOBULIN', value: '17', unit: 'nmol/L', flag: 'L' },
  { name: 'ALBUMIN', value: '3.2', unit: 'g/dL', flag: 'L' },
  { name: 'CHOLESTEROL, TOTAL', value: '187', unit: 'mg/dL', flag: null },
  { name: 'HDL CHOLESTEROL', value: '40', unit: 'mg/dL', flag: null },
  { name: 'LDL-CHOLESTEROL', value: '122', unit: 'mg/dL', flag: 'H' },
  { name: 'NON HDL CHOLESTEROL', value: '147', unit: 'mg/dL', flag: 'H' },
  { name: 'HS CRP', value: '5.9', unit: 'mg/L', flag: 'H' },
  { name: 'HOMOCYSTEINE', value: '15.2', unit: 'umol/L', flag: null },
  { name: 'APOLIPOPROTEIN B', value: '103', unit: 'mg/dL', flag: 'H' },
  { name: 'GLUCOSE', value: '111', unit: 'mg/dL', flag: 'H' },
  { name: 'UREA NITROGEN (BUN)', value: '31', unit: 'mg/dL', flag: 'H' },
  { name: 'CREATININE', value: '1.31', unit: 'mg/dL', flag: 'H' },
  { name: 'EGFR', value: '63', unit: 'mL/min/1.73m2', flag: null },
  { name: 'BUN/CREATININE RATIO', value: '24', unit: null, flag: 'H' },
  { name: 'SODIUM', value: '141', unit: 'mmol/L', flag: null },
  { name: 'POTASSIUM', value: '4.3', unit: 'mmol/L', flag: null },
  { name: 'CHLORIDE', value: '108', unit: 'mmol/L', flag: null },
  { name: 'CARBON DIOXIDE', value: '26', unit: 'mmol/L', flag: null },
  { name: 'CALCIUM', value: '9.4', unit: 'mg/dL', flag: null },
  { name: 'PROTEIN, TOTAL', value: '6.1', unit: 'g/dL', flag: null },
  { name: 'GLOBULIN', value: '2.9', unit: 'g/dL', flag: null },
  { name: 'BILIRUBIN, TOTAL', value: '0.2', unit: 'mg/dL', flag: null },
  { name: 'ALKALINE PHOSPHATASE', value: '56', unit: 'U/L', flag: null },
  { name: 'AST', value: '16', unit: 'U/L', flag: null },
  { name: 'ALT', value: '11', unit: 'U/L', flag: null },
  { name: 'HEMOGLOBIN A1c', value: '5.5', unit: '%', flag: null },
  { name: 'MAGNESIUM', value: '2.3', unit: 'mg/dL', flag: null },
  { name: 'URIC ACID', value: '6.6', unit: 'mg/dL', flag: null },
  { name: 'TSH', value: '2.82', unit: 'mIU/L', flag: null },
  { name: 'T4, FREE', value: '1.1', unit: 'ng/dL', flag: null },
  { name: 'T3, FREE', value: '3.4', unit: 'pg/mL', flag: null },
  { name: 'THYROGLOBULIN ANTIBODIES', value: '<1', unit: 'IU/mL', flag: null },
  { name: 'THYROID PEROXIDASE ANTIBODIES', value: '<1', unit: 'IU/mL', flag: null },
  { name: 'LIPOPROTEIN (a)', value: '94', unit: 'nmol/L', flag: 'H' },
  { name: 'IGF 1, LC/MS', value: '303', unit: 'ng/mL', flag: null },
  { name: 'WHITE BLOOD CELL COUNT', value: '4.4', unit: 'Thousand/uL', flag: null },
  { name: 'RED BLOOD CELL COUNT', value: '4.33', unit: 'Million/uL', flag: null },
  { name: 'HEMOGLOBIN', value: '13.7', unit: 'g/dL', flag: null },
  { name: 'HEMATOCRIT', value: '40.2', unit: '%', flag: null },
  { name: 'MCV', value: '92.8', unit: 'fL', flag: null },
  { name: 'MCH', value: '31.6', unit: 'pg', flag: null },
  { name: 'MCHC', value: '34.1', unit: 'g/dL', flag: null },
  { name: 'RDW', value: '12.4', unit: '%', flag: null },
  { name: 'PLATELET COUNT', value: '324', unit: 'Thousand/uL', flag: null },
  { name: 'VITAMIN B12', value: '866', unit: 'pg/mL', flag: null },
  { name: 'CORTISOL, TOTAL', value: '11.3', unit: 'mcg/dL', flag: null },
  { name: 'DHEA SULFATE', value: '86', unit: 'mcg/dL', flag: null },
  { name: 'FSH', value: '3.1', unit: 'mIU/mL', flag: null },
  { name: 'LH', value: '2.6', unit: 'mIU/mL', flag: null },
  { name: 'ESTRADIOL', value: '<30', unit: 'pg/mL', flag: null },
  { name: 'PSA, TOTAL', value: '10.4', unit: 'ng/mL', flag: 'H' },
  { name: 'PSA, FREE', value: '1.0', unit: 'ng/mL', flag: null },
  { name: 'VITAMIN D,25-OH,TOTAL,IA', value: '66', unit: 'ng/mL', flag: null },
];

// Extracted biomarkers from Labcorp PDF (Ryan Brady)
const labcorpBiomarkers = [
  { name: 'Iron Bind.Cap.(TIBC)', value: '429', unit: 'ug/dL', flag: null },
  { name: 'UIBC', value: '256', unit: 'ug/dL', flag: null },
  { name: 'Iron', value: '173', unit: 'ug/dL', flag: 'H' },
  { name: 'Iron Saturation', value: '40', unit: '%', flag: null },
  { name: 'TSH', value: '2.860', unit: 'uIU/mL', flag: null },
  { name: 'Triiodothyronine (T3), Free', value: '4.0', unit: 'pg/mL', flag: null },
  { name: 'T4,Free(Direct)', value: '1.48', unit: 'ng/dL', flag: null },
  { name: 'LH', value: '<0.3', unit: 'mIU/mL', flag: 'L' },
  { name: 'FSH', value: '<0.3', unit: 'mIU/mL', flag: 'L' },
  { name: 'Testosterone', value: '391', unit: 'ng/dL', flag: null },
  { name: 'Free Testosterone(Direct)', value: '14.2', unit: 'pg/mL', flag: null },
  { name: 'DHEA-Sulfate', value: '377.0', unit: 'ug/dL', flag: null },
  { name: 'Homocyst(e)ine', value: '15.7', unit: 'umol/L', flag: 'H' },
  { name: 'C-Reactive Protein, Cardiac', value: '0.48', unit: 'mg/L', flag: null },
  { name: 'Cortisol', value: '9.2', unit: 'ug/dL', flag: null },
  { name: 'Estradiol', value: '25.8', unit: 'pg/mL', flag: null },
  { name: 'Uric Acid', value: '7.5', unit: 'mg/dL', flag: null },
  { name: 'GGT', value: '28', unit: 'IU/L', flag: null },
  { name: 'Sex Horm Binding Glob, Serum', value: '10.5', unit: 'nmol/L', flag: 'L' },
  { name: 'Creatine Kinase,Total', value: '153', unit: 'U/L', flag: null },
  { name: 'Progesterone', value: '0.2', unit: 'ng/mL', flag: null },
  { name: 'Ferritin', value: '80', unit: 'ng/mL', flag: null },
  { name: 'Magnesium', value: '2.1', unit: 'mg/dL', flag: null },
];

interface MatchResult {
  labName: string;
  catalogCode: string | null;
  catalogName: string | null;
  matchedVia: string | null;
  confidence: 'exact' | 'fuzzy' | 'none';
}

async function matchBiomarker(
  labName: string,
  provider: 'QUEST' | 'LABCORP'
): Promise<MatchResult> {
  const normalizedName = labName.toLowerCase().trim();

  // Get all aliases for this provider with biomarker included
  const allAliases = await prisma.biomarkerAlias.findMany({
    where: { labProvider: provider },
    include: { biomarker: true },
  });

  // Try exact alias match (case-insensitive)
  const exactAlias = allAliases.find(
    (a) => a.aliasName.toLowerCase().trim() === normalizedName
  );

  if (exactAlias) {
    return {
      labName,
      catalogCode: exactAlias.biomarker.code,
      catalogName: exactAlias.biomarker.name,
      matchedVia: `exact alias: "${exactAlias.aliasName}"`,
      confidence: 'exact',
    };
  }

  // Try fuzzy alias match (contains)
  for (const alias of allAliases) {
    const aliasNorm = alias.aliasName.toLowerCase().trim();
    if (aliasNorm.includes(normalizedName) || normalizedName.includes(aliasNorm)) {
      return {
        labName,
        catalogCode: alias.biomarker.code,
        catalogName: alias.biomarker.name,
        matchedVia: `fuzzy alias: "${alias.aliasName}"`,
        confidence: 'fuzzy',
      };
    }
  }

  // Try direct biomarker name match
  const allBiomarkers = await prisma.biomarkerCatalog.findMany();
  for (const bio of allBiomarkers) {
    const bioNorm = bio.name.toLowerCase().trim();
    if (bioNorm === normalizedName || bio.code.toLowerCase().replace(/_/g, ' ') === normalizedName) {
      return {
        labName,
        catalogCode: bio.code,
        catalogName: bio.name,
        matchedVia: 'direct name match',
        confidence: 'exact',
      };
    }
  }

  return {
    labName,
    catalogCode: null,
    catalogName: null,
    matchedVia: null,
    confidence: 'none',
  };
}

async function analyzeLabResults() {
  console.log('=' .repeat(100));
  console.log('LAB PDF ANALYSIS - Testing Alias Database');
  console.log('='.repeat(100));

  // Analyze Quest results
  console.log('\n📋 QUEST DIAGNOSTICS - Stephen Martin');
  console.log('-'.repeat(80));

  const questMatched: MatchResult[] = [];
  const questUnmatched: string[] = [];

  for (const bio of questBiomarkers) {
    const result = await matchBiomarker(bio.name, 'QUEST');
    if (result.confidence !== 'none') {
      questMatched.push(result);
    } else {
      questUnmatched.push(bio.name);
    }
  }

  console.log(`✅ Matched: ${questMatched.length}/${questBiomarkers.length}`);
  console.log(`❌ Unmatched: ${questUnmatched.length}/${questBiomarkers.length}`);

  if (questUnmatched.length > 0) {
    console.log('\n⚠️  Missing Quest Aliases (need to add):');
    questUnmatched.forEach((name) => console.log(`   • "${name}"`));
  }

  // Analyze Labcorp results
  console.log('\n📋 LABCORP - Ryan Brady');
  console.log('-'.repeat(80));

  const labcorpMatched: MatchResult[] = [];
  const labcorpUnmatched: string[] = [];

  for (const bio of labcorpBiomarkers) {
    const result = await matchBiomarker(bio.name, 'LABCORP');
    if (result.confidence !== 'none') {
      labcorpMatched.push(result);
    } else {
      labcorpUnmatched.push(bio.name);
    }
  }

  console.log(`✅ Matched: ${labcorpMatched.length}/${labcorpBiomarkers.length}`);
  console.log(`❌ Unmatched: ${labcorpUnmatched.length}/${labcorpBiomarkers.length}`);

  if (labcorpUnmatched.length > 0) {
    console.log('\n⚠️  Missing Labcorp Aliases (need to add):');
    labcorpUnmatched.forEach((name) => console.log(`   • "${name}"`));
  }

  // Summary
  console.log('\n' + '='.repeat(100));
  console.log('SUMMARY');
  console.log('='.repeat(100));

  const totalBiomarkers = questBiomarkers.length + labcorpBiomarkers.length;
  const totalMatched = questMatched.length + labcorpMatched.length;
  const matchRate = ((totalMatched / totalBiomarkers) * 100).toFixed(1);

  console.log(`\nTotal biomarkers analyzed: ${totalBiomarkers}`);
  console.log(`Total matched: ${totalMatched}`);
  console.log(`Match rate: ${matchRate}%`);

  // Generate aliases to add
  const allUnmatched = [
    ...questUnmatched.map((n) => ({ name: n, provider: 'QUEST' })),
    ...labcorpUnmatched.map((n) => ({ name: n, provider: 'LABCORP' })),
  ];

  if (allUnmatched.length > 0) {
    console.log('\n📝 RECOMMENDED ALIASES TO ADD:');
    console.log('-'.repeat(80));
    allUnmatched.forEach(({ name, provider }) => {
      console.log(`{ labProvider: '${provider}', aliasName: '${name}' },`);
    });
  }
}

analyzeLabResults()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
