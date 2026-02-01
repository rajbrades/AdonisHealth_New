"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdf = require('pdf-parse');
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function extractTextFromPdf(pdfPath) {
    console.log(`\n📄 Reading PDF: ${pdfPath}`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    console.log(`   Pages: ${data.numpages}`);
    console.log(`   Text length: ${data.text.length} characters`);
    return data.text;
}
async function extractBiomarkersWithAI(pdfText, provider) {
    console.log(`\n🤖 Extracting biomarkers with Claude...`);
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }
    const client = new sdk_1.default({ apiKey });
    const prompt = `You are extracting lab test results from a ${provider} lab report. Extract ALL biomarker results you can find.

For each biomarker, extract:
- name: The exact test name as shown (e.g., "Testosterone, Total" or "TSH")
- value: The result value (keep "<" or ">" if present, e.g., "<5" or "Negative")
- unit: The unit of measurement (e.g., "ng/dL", "mg/dL", "%")
- refRange: Reference range if shown (e.g., "300-1000" or "0.45-4.50")
- flag: "H" for high, "L" for low, or null if normal/not flagged

Also extract:
- collectionDate: When the sample was collected (ISO format if possible)
- receivedDate: When the lab received the sample
- reportDate: When results were reported
- patientName: Patient's name if visible

IMPORTANT:
- Extract ALL biomarkers, even if you're unsure about some values
- Keep the exact test names as shown in the report
- Include all units exactly as printed
- If a value is non-numeric (like "Negative" or "Reactive"), include it as-is

Return ONLY valid JSON in this exact format:
{
  "collectionDate": "2024-01-15" or null,
  "receivedDate": "2024-01-16" or null,
  "reportDate": "2024-01-17" or null,
  "patientName": "John Doe" or null,
  "biomarkers": [
    {
      "name": "Testosterone, Total",
      "value": "650",
      "unit": "ng/dL",
      "refRange": "264-916",
      "flag": null
    },
    {
      "name": "TSH",
      "value": "5.2",
      "unit": "uIU/mL",
      "refRange": "0.45-4.50",
      "flag": "H"
    }
  ]
}

Lab Report Text:
---
${pdfText.substring(0, 50000)}
---

Return ONLY the JSON, no other text or explanation.`;
    const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
    });
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
    }
    let jsonText = textContent.text;
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }
    try {
        const result = JSON.parse(jsonText);
        console.log(`   Extracted ${result.biomarkers.length} biomarkers`);
        console.log(`   Input tokens: ${response.usage.input_tokens}, Output tokens: ${response.usage.output_tokens}`);
        return result;
    }
    catch (e) {
        console.error('Failed to parse JSON response:', jsonText.substring(0, 500));
        throw new Error(`Invalid JSON from Claude: ${e}`);
    }
}
async function matchBiomarkers(extracted, provider) {
    console.log(`\n🔍 Matching biomarkers against catalog...`);
    const aliases = await prisma.biomarkerAlias.findMany({
        where: { labProvider: provider },
        include: {
            biomarker: true,
        },
    });
    const allBiomarkers = await prisma.biomarkerCatalog.findMany();
    const results = [];
    for (const ext of extracted) {
        const normalizedName = ext.name.toLowerCase().trim();
        let match = {
            extracted: ext,
            catalogMatch: null,
            matchedVia: null,
            confidence: 'none',
            numericValue: parseNumericValue(ext.value),
            flag: null,
        };
        const exactAlias = aliases.find((a) => a.aliasName.toLowerCase().trim() === normalizedName);
        if (exactAlias) {
            match.catalogMatch = {
                id: exactAlias.biomarker.id,
                code: exactAlias.biomarker.code,
                name: exactAlias.biomarker.name,
                category: exactAlias.biomarker.category,
                defaultUnit: exactAlias.biomarker.defaultUnit,
                optimalRangeLow: exactAlias.biomarker.optimalRangeLow,
                optimalRangeHigh: exactAlias.biomarker.optimalRangeHigh,
            };
            match.matchedVia = `alias: "${exactAlias.aliasName}"`;
            match.confidence = 'exact';
        }
        else {
            const fuzzyAlias = aliases.find((a) => a.aliasName.toLowerCase().includes(normalizedName) ||
                normalizedName.includes(a.aliasName.toLowerCase()));
            if (fuzzyAlias) {
                match.catalogMatch = {
                    id: fuzzyAlias.biomarker.id,
                    code: fuzzyAlias.biomarker.code,
                    name: fuzzyAlias.biomarker.name,
                    category: fuzzyAlias.biomarker.category,
                    defaultUnit: fuzzyAlias.biomarker.defaultUnit,
                    optimalRangeLow: fuzzyAlias.biomarker.optimalRangeLow,
                    optimalRangeHigh: fuzzyAlias.biomarker.optimalRangeHigh,
                };
                match.matchedVia = `fuzzy alias: "${fuzzyAlias.aliasName}"`;
                match.confidence = 'fuzzy';
            }
            else {
                const directMatch = allBiomarkers.find((b) => b.name.toLowerCase() === normalizedName ||
                    b.code.toLowerCase().replace(/_/g, ' ') === normalizedName);
                if (directMatch) {
                    match.catalogMatch = {
                        id: directMatch.id,
                        code: directMatch.code,
                        name: directMatch.name,
                        category: directMatch.category,
                        defaultUnit: directMatch.defaultUnit,
                        optimalRangeLow: directMatch.optimalRangeLow,
                        optimalRangeHigh: directMatch.optimalRangeHigh,
                    };
                    match.matchedVia = `direct name match`;
                    match.confidence = 'exact';
                }
            }
        }
        if (match.catalogMatch && match.numericValue !== null) {
            match.flag = calculateFlag(match.numericValue, match.catalogMatch.optimalRangeLow, match.catalogMatch.optimalRangeHigh);
        }
        results.push(match);
    }
    return results;
}
function parseNumericValue(value) {
    if (!value)
        return null;
    const cleaned = value.replace(/[<>]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}
function calculateFlag(value, optimalLow, optimalHigh) {
    if (optimalLow === null || optimalHigh === null)
        return null;
    if (value < optimalLow * 0.8)
        return 'CRITICAL_LOW';
    if (value < optimalLow)
        return 'LOW';
    if (value > optimalHigh * 1.2)
        return 'CRITICAL_HIGH';
    if (value > optimalHigh)
        return 'HIGH';
    return 'OPTIMAL';
}
function printResults(matched) {
    console.log(`\n${'='.repeat(100)}`);
    console.log('EXTRACTION RESULTS');
    console.log('='.repeat(100));
    const matched_count = matched.filter((m) => m.catalogMatch).length;
    const unmatched = matched.filter((m) => !m.catalogMatch);
    console.log(`\n✅ Matched: ${matched_count}/${matched.length}`);
    console.log(`❌ Unmatched: ${unmatched.length}/${matched.length}`);
    const byCategory = new Map();
    for (const m of matched.filter((m) => m.catalogMatch)) {
        const cat = m.catalogMatch.category;
        if (!byCategory.has(cat))
            byCategory.set(cat, []);
        byCategory.get(cat).push(m);
    }
    for (const [category, items] of byCategory) {
        console.log(`\n📊 ${category}`);
        console.log('-'.repeat(100));
        for (const item of items) {
            const extracted = item.extracted;
            const catalog = item.catalogMatch;
            const flagEmoji = item.flag === 'OPTIMAL'
                ? '🟢'
                : item.flag === 'HIGH' || item.flag === 'LOW'
                    ? '🟡'
                    : item.flag?.includes('CRITICAL')
                        ? '🔴'
                        : '⚪';
            console.log(`  ${flagEmoji} ${catalog.name.padEnd(35)} ${String(extracted.value).padStart(10)} ${(extracted.unit || catalog.defaultUnit).padEnd(12)} ` +
                `(optimal: ${catalog.optimalRangeLow}-${catalog.optimalRangeHigh})`);
            if (item.confidence === 'fuzzy') {
                console.log(`      ⚠️  Fuzzy match via ${item.matchedVia}`);
            }
        }
    }
    if (unmatched.length > 0) {
        console.log(`\n❌ UNMATCHED BIOMARKERS (need to add aliases)`);
        console.log('-'.repeat(100));
        for (const item of unmatched) {
            console.log(`  • "${item.extracted.name}" = ${item.extracted.value} ${item.extracted.unit || ''}`);
        }
    }
    console.log(`\n${'='.repeat(100)}`);
    console.log('SUMMARY');
    console.log('='.repeat(100));
    const flagCounts = {
        OPTIMAL: matched.filter((m) => m.flag === 'OPTIMAL').length,
        HIGH: matched.filter((m) => m.flag === 'HIGH').length,
        LOW: matched.filter((m) => m.flag === 'LOW').length,
        CRITICAL_HIGH: matched.filter((m) => m.flag === 'CRITICAL_HIGH').length,
        CRITICAL_LOW: matched.filter((m) => m.flag === 'CRITICAL_LOW').length,
    };
    console.log(`\n  🟢 Optimal: ${flagCounts.OPTIMAL}   🟡 Out of range: ${flagCounts.HIGH + flagCounts.LOW}   🔴 Critical: ${flagCounts.CRITICAL_HIGH + flagCounts.CRITICAL_LOW}`);
    console.log(`  Match rate: ${((matched_count / matched.length) * 100).toFixed(1)}%`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage: npx ts-node scripts/test-lab-extraction.ts <pdf-path> [provider]');
        console.log('');
        console.log('Providers: QUEST, LABCORP, ACCESS_MEDICAL');
        console.log('');
        console.log('Example:');
        console.log('  npx ts-node scripts/test-lab-extraction.ts ./labs/quest-panel.pdf QUEST');
        process.exit(1);
    }
    const pdfPath = args[0];
    const provider = args[1]?.toUpperCase() || 'QUEST';
    if (!fs.existsSync(pdfPath)) {
        console.error(`❌ File not found: ${pdfPath}`);
        process.exit(1);
    }
    console.log('🧪 Lab PDF Extraction Test');
    console.log('='.repeat(50));
    console.log(`  PDF: ${path.basename(pdfPath)}`);
    console.log(`  Provider: ${provider}`);
    const aliasCount = await prisma.biomarkerAlias.count({
        where: { labProvider: provider },
    });
    console.log(`  Aliases in DB for ${provider}: ${aliasCount}`);
    try {
        const pdfText = await extractTextFromPdf(pdfPath);
        const extracted = await extractBiomarkersWithAI(pdfText, provider);
        if (extracted.collectionDate)
            console.log(`  Collection Date: ${extracted.collectionDate}`);
        if (extracted.patientName)
            console.log(`  Patient: ${extracted.patientName}`);
        const matched = await matchBiomarkers(extracted.biomarkers, provider);
        printResults(matched);
        return {
            success: true,
            extracted,
            matched,
            stats: {
                total: matched.length,
                matched: matched.filter((m) => m.catalogMatch).length,
                unmatched: matched.filter((m) => !m.catalogMatch).length,
            },
        };
    }
    catch (error) {
        console.error('\n❌ Extraction failed:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-lab-extraction.js.map