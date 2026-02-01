"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const prisma_service_1 = require("../prisma/prisma.service");
const pdfParse = require('pdf-parse');
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
let LabsService = class LabsService {
    prisma;
    anthropic = null;
    constructor(prisma) {
        this.prisma = prisma;
        if (process.env.ANTHROPIC_API_KEY) {
            this.anthropic = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
        }
    }
    async extractTextFromPdf(buffer) {
        const data = await pdfParse(buffer);
        return data.text;
    }
    async extractBiomarkersWithAI(pdfText, provider) {
        if (!this.anthropic) {
            throw new Error('ANTHROPIC_API_KEY not configured');
        }
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
    }
  ]
}

Lab Report Text:
---
${pdfText.substring(0, 50000)}
---

Return ONLY the JSON, no other text or explanation.`;
        const response = await this.anthropic.messages.create({
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
        return JSON.parse(jsonText);
    }
    async matchBiomarkers(extracted, provider) {
        const aliases = await this.prisma.biomarkerAlias.findMany({
            where: { labProvider: provider },
            include: { biomarker: true },
        });
        const allBiomarkers = await this.prisma.biomarkerCatalog.findMany();
        const results = [];
        for (const ext of extracted) {
            const normalizedName = ext.name.toLowerCase().trim();
            let match = {
                extracted: ext,
                catalogMatch: null,
                matchedVia: null,
                confidence: 'none',
                numericValue: this.parseNumericValue(ext.value),
                calculatedFlag: null,
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
                match.matchedVia = `exact alias: "${exactAlias.aliasName}"`;
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
                        match.matchedVia = 'direct name match';
                        match.confidence = 'exact';
                    }
                }
            }
            if (match.catalogMatch && match.numericValue !== null) {
                match.calculatedFlag = this.calculateFlag(match.numericValue, match.catalogMatch.optimalRangeLow, match.catalogMatch.optimalRangeHigh);
            }
            results.push(match);
        }
        return results;
    }
    parseNumericValue(value) {
        if (!value)
            return null;
        const cleaned = value.replace(/[<>]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
    calculateFlag(value, optimalLow, optimalHigh) {
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
    async processLabPdf(buffer, provider) {
        const pdfText = await this.extractTextFromPdf(buffer);
        const extraction = await this.extractBiomarkersWithAI(pdfText, provider);
        const matched = await this.matchBiomarkers(extraction.biomarkers, provider);
        const matchedCount = matched.filter((m) => m.catalogMatch).length;
        const unmatchedNames = matched
            .filter((m) => !m.catalogMatch)
            .map((m) => m.extracted.name);
        return {
            success: true,
            pdfText: pdfText.substring(0, 2000) + '...',
            textLength: pdfText.length,
            extraction,
            matched,
            stats: {
                total: matched.length,
                matched: matchedCount,
                unmatched: unmatchedNames.length,
                matchRate: ((matchedCount / matched.length) * 100).toFixed(1) + '%',
            },
            unmatchedNames,
        };
    }
    async getBiomarkerCatalog() {
        return this.prisma.biomarkerCatalog.findMany({
            include: {
                aliases: true,
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    }
    async addAlias(biomarkerCode, labProvider, aliasName) {
        const biomarker = await this.prisma.biomarkerCatalog.findUnique({
            where: { code: biomarkerCode },
        });
        if (!biomarker) {
            throw new Error(`Biomarker with code ${biomarkerCode} not found`);
        }
        return this.prisma.biomarkerAlias.create({
            data: {
                biomarkerId: biomarker.id,
                labProvider,
                aliasName,
            },
        });
    }
    async getAliasStats() {
        const byProvider = await this.prisma.biomarkerAlias.groupBy({
            by: ['labProvider'],
            _count: true,
        });
        const total = await this.prisma.biomarkerAlias.count();
        const biomarkerCount = await this.prisma.biomarkerCatalog.count();
        return {
            total,
            biomarkerCount,
            byProvider: byProvider.map((p) => ({
                provider: p.labProvider,
                count: p._count,
            })),
        };
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabsService);
//# sourceMappingURL=labs.service.js.map