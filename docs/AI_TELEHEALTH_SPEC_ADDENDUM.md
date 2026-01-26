# AI Telehealth Specification Addendum

## Overview

This document addresses gaps identified in `AI_TELEHEALTH_SPEC.md` and provides implementation-ready specifications for data architecture, AI reliability, compliance, and operational concerns.

---

## 1. Revised Data Models

### Problem
The original spec stores structured data as JSON strings, losing type safety and query capability.

### Solution: Normalized Schema with Typed JSON

#### PreVisitBriefing (Revised)

```prisma
model PreVisitBriefing {
  id              String   @id @default(uuid())

  patientId       String
  patient         PatientProfile @relation(fields: [patientId], references: [id])

  encounterId     String?  @unique
  encounter       TelehealthEncounter? @relation(fields: [encounterId], references: [id])

  clinicalNoteId  String?
  clinicalNote    ClinicalNote? @relation(fields: [clinicalNoteId], references: [id])

  // Status tracking
  status          BriefingStatus @default(GENERATING)
  generatedAt     DateTime?
  viewedAt        DateTime?

  // Generation metadata
  generationDurationMs  Int?
  dataCompleteness      Float?    // 0-1: percentage of expected data available

  // Content stored as validated JSON (use Zod at app layer)
  patientSummary        Json      // PatientSummarySchema
  preChartedSubjective  String    // Plain text for SOAP S section

  // Relations to structured analysis records
  labAnalyses           BriefingLabAnalysis[]
  pillarTrends          BriefingPillarTrend[]
  adherenceRecords      BriefingAdherenceRecord[]
  discussionPoints      BriefingDiscussionPoint[]
  correlations          BriefingCorrelation[]

  // Wearable insights (semi-structured, varies by device)
  wearableInsights      Json?     // WearableInsightsSchema

  // Prior encounter reference
  priorEncounterId      String?
  priorEncounterSummary String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum BriefingStatus {
  GENERATING
  GENERATION_FAILED
  READY
  VIEWED
  ENCOUNTER_STARTED
  ARCHIVED
}

// Normalized lab analysis - queryable!
model BriefingLabAnalysis {
  id                String   @id @default(uuid())
  briefingId        String
  briefing          PreVisitBriefing @relation(fields: [briefingId], references: [id], onDelete: Cascade)

  system            PhysiologicalSystem
  labResultId       String
  labResult         LabResult @relation(fields: [labResultId], references: [id])

  status            AnalysisStatus  // OPTIMAL, SUBOPTIMAL, PATHOLOGICAL
  clinicalRelevance String
  recommendation    String?

  // Link to specific biomarkers flagged
  flaggedBiomarkers BriefingFlaggedBiomarker[]

  createdAt         DateTime @default(now())
}

enum PhysiologicalSystem {
  HORMONAL
  METABOLIC
  THYROID_ADRENAL
  CARDIOVASCULAR
  INFLAMMATORY
  HEPATIC
  RENAL
  HEMATOLOGIC
  GASTROINTESTINAL
}

enum AnalysisStatus {
  OPTIMAL
  SUBOPTIMAL
  BORDERLINE
  PATHOLOGICAL
  INSUFFICIENT_DATA
}

model BriefingFlaggedBiomarker {
  id              String   @id @default(uuid())
  labAnalysisId   String
  labAnalysis     BriefingLabAnalysis @relation(fields: [labAnalysisId], references: [id], onDelete: Cascade)

  biomarkerId     String
  biomarker       Biomarker @relation(fields: [biomarkerId], references: [id])

  flag            BiomarkerFlag  // HIGH, LOW, TRENDING_UP, TRENDING_DOWN
  priorValue      Float?
  percentChange   Float?
  interpretation  String
}

enum BiomarkerFlag {
  HIGH
  LOW
  CRITICAL_HIGH
  CRITICAL_LOW
  TRENDING_UP
  TRENDING_DOWN
  NEW_ABNORMAL
  NORMALIZED
}

// Pillar trends - queryable for population analytics
model BriefingPillarTrend {
  id              String   @id @default(uuid())
  briefingId      String
  briefing        PreVisitBriefing @relation(fields: [briefingId], references: [id], onDelete: Cascade)

  pillar          PillarType
  currentScore    Int       // 1-10
  priorScore      Int?      // From previous check-in
  trend           TrendDirection
  weekOverWeekChange Float?
  interpretation  String?
}

enum PillarType {
  SLEEP
  RECOVERY
  LIBIDO
  MENTAL_ACUITY
  DIGESTION
  DIET
  MOVEMENT
}

enum TrendDirection {
  IMPROVING
  STABLE
  DECLINING
  INSUFFICIENT_DATA
}

// Discussion points - normalized for tracking resolution
model BriefingDiscussionPoint {
  id              String   @id @default(uuid())
  briefingId      String
  briefing        PreVisitBriefing @relation(fields: [briefingId], references: [id], onDelete: Cascade)

  priority        DiscussionPriority
  category        DiscussionCategory
  title           String
  description     String
  supportingData  Json      // References to labs, check-ins, etc.
  recommendedAction String?

  // Track if addressed during encounter
  wasDiscussed    Boolean   @default(false)
  outcomeNotes    String?

  sortOrder       Int
}

enum DiscussionPriority {
  HIGH
  MEDIUM
  MONITORING
}

enum DiscussionCategory {
  LAB_FINDING
  SYMPTOM_CONCERN
  ADHERENCE_ISSUE
  PRIOR_ACTION_ITEM
  OPTIMIZATION_OPPORTUNITY
  PATIENT_REQUEST
}

// Correlations - normalized for analysis
model BriefingCorrelation {
  id              String   @id @default(uuid())
  briefingId      String
  briefing        PreVisitBriefing @relation(fields: [briefingId], references: [id], onDelete: Cascade)

  correlationType CorrelationType
  subjectiveSource String    // e.g., "Check-in pillar: Sleep"
  subjectiveValue  String    // e.g., "Score 4/10, reports insomnia"
  objectiveSource  String    // e.g., "Lab: Testosterone"
  objectiveValue   String    // e.g., "285 ng/dL (low)"
  explanation      String
  confidence       CorrelationConfidence
}

enum CorrelationType {
  SYMPTOM_LAB_CORRELATION
  SYMPTOM_WEARABLE_CORRELATION
  DISCREPANCY_LABS_OPTIMAL_SYMPTOMS_PRESENT
  DISCREPANCY_LABS_ABNORMAL_NO_SYMPTOMS
}

enum CorrelationConfidence {
  HIGH
  MEDIUM
  LOW
}

// Adherence tracking
model BriefingAdherenceRecord {
  id              String   @id @default(uuid())
  briefingId      String
  briefing        PreVisitBriefing @relation(fields: [briefingId], references: [id], onDelete: Cascade)

  regimenItemId   String
  regimenItem     ActiveRegimen @relation(fields: [regimenItemId], references: [id])

  reportedAdherence Float   // 0-1
  trend             TrendDirection
  concerns          String?
}
```

### Zod Schemas for JSON Fields

```typescript
// src/telehealth/schemas/briefing.schemas.ts

import { z } from 'zod';

export const PatientSummarySchema = z.object({
  demographics: z.object({
    age: z.number(),
    gender: z.string(),
    state: z.string(),
  }),
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()),
  timeOnProtocol: z.object({
    months: z.number(),
    startDate: z.string().datetime(),
  }),
  currentRegimen: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
  })),
  allergies: z.array(z.string()),
  contraindications: z.array(z.string()),
});

export const WearableInsightsSchema = z.object({
  dataSource: z.enum(['OURA', 'WHOOP', 'APPLE_HEALTH', 'MULTIPLE']),
  lastSyncAt: z.string().datetime(),
  sleepMetrics: z.object({
    averageDuration: z.number().optional(),
    averageEfficiency: z.number().optional(),
    trend: z.enum(['IMPROVING', 'STABLE', 'DECLINING']).optional(),
  }).optional(),
  hrvMetrics: z.object({
    averageHRV: z.number().optional(),
    trend: z.enum(['IMPROVING', 'STABLE', 'DECLINING']).optional(),
  }).optional(),
  recoveryMetrics: z.object({
    averageScore: z.number().optional(),
    trend: z.enum(['IMPROVING', 'STABLE', 'DECLINING']).optional(),
  }).optional(),
  rawData: z.record(z.unknown()).optional(), // Preserve original for debugging
});

export type PatientSummary = z.infer<typeof PatientSummarySchema>;
export type WearableInsights = z.infer<typeof WearableInsightsSchema>;
```

---

## 2. AI Reliability Framework

### 2.1 Structured Output Enforcement

All AI calls MUST use structured output to ensure parseable responses.

```typescript
// src/telehealth/ai/structured-output.ts

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Define expected output schemas
export const LabAnalysisOutputSchema = z.object({
  systems: z.array(z.object({
    system: z.enum([
      'HORMONAL', 'METABOLIC', 'THYROID_ADRENAL', 'CARDIOVASCULAR',
      'INFLAMMATORY', 'HEPATIC', 'RENAL', 'HEMATOLOGIC', 'GASTROINTESTINAL'
    ]),
    status: z.enum(['OPTIMAL', 'SUBOPTIMAL', 'BORDERLINE', 'PATHOLOGICAL', 'INSUFFICIENT_DATA']),
    findings: z.array(z.object({
      biomarkerName: z.string(),
      value: z.number(),
      unit: z.string(),
      referenceRange: z.string(),
      flag: z.enum(['HIGH', 'LOW', 'CRITICAL_HIGH', 'CRITICAL_LOW', 'NORMAL']).optional(),
      interpretation: z.string(),
    })),
    clinicalRelevance: z.string(),
    recommendation: z.string().optional(),
  })),
  overallAssessment: z.string(),
  criticalFindings: z.array(z.string()),
});

export const DiscussionPointsOutputSchema = z.object({
  highPriority: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'LAB_FINDING', 'SYMPTOM_CONCERN', 'ADHERENCE_ISSUE',
      'PRIOR_ACTION_ITEM', 'OPTIMIZATION_OPPORTUNITY', 'PATIENT_REQUEST'
    ]),
    supportingEvidence: z.array(z.string()),
    recommendedAction: z.string(),
  })),
  mediumPriority: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    supportingEvidence: z.array(z.string()),
    recommendedAction: z.string().optional(),
  })),
  monitoring: z.array(z.object({
    title: z.string(),
    description: z.string(),
    supportingEvidence: z.array(z.string()),
  })),
});

export const SOAPDraftOutputSchema = z.object({
  subjective: z.object({
    chiefComplaint: z.string(),
    historyOfPresentIllness: z.string(),
    reviewOfSystems: z.string(),
    patientQuotes: z.array(z.string()),
  }),
  objective: z.object({
    vitalSigns: z.string(),
    labsReviewed: z.string(),
    physicalExam: z.string().optional(),
    wearableData: z.string().optional(),
  }),
  assessment: z.array(z.object({
    diagnosis: z.string(),
    icdCode: z.string().optional(),
    reasoning: z.string(),
  })),
  plan: z.array(z.object({
    category: z.enum(['MEDICATION', 'LAB_ORDER', 'LIFESTYLE', 'FOLLOW_UP', 'REFERRAL', 'EDUCATION']),
    description: z.string(),
    details: z.string().optional(),
  })),
  metadata: z.object({
    dataCompleteness: z.number().min(0).max(1),
    transcriptQuality: z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNUSABLE']).optional(),
    uncertainties: z.array(z.string()),
  }),
});

export type LabAnalysisOutput = z.infer<typeof LabAnalysisOutputSchema>;
export type DiscussionPointsOutput = z.infer<typeof DiscussionPointsOutputSchema>;
export type SOAPDraftOutput = z.infer<typeof SOAPDraftOutputSchema>;
```

### 2.2 AI Service with Error Handling

```typescript
// src/telehealth/ai/ai-analysis.service.ts

import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export interface AICallOptions<T> {
  prompt: string;
  systemPrompt: string;
  outputSchema: z.ZodSchema<T>;
  maxRetries?: number;
  timeoutMs?: number;
  fallbackValue?: T;
}

export interface AICallResult<T> {
  success: boolean;
  data?: T;
  error?: AIError;
  metadata: {
    attempts: number;
    totalDurationMs: number;
    model: string;
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIError {
  code: AIErrorCode;
  message: string;
  retryable: boolean;
  rawError?: unknown;
}

export enum AIErrorCode {
  RATE_LIMITED = 'RATE_LIMITED',
  CONTEXT_TOO_LONG = 'CONTEXT_TOO_LONG',
  INVALID_OUTPUT = 'INVALID_OUTPUT',
  CONTENT_FILTERED = 'CONTENT_FILTERED',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

@Injectable()
export class AIAnalysisService {
  private readonly logger = new Logger(AIAnalysisService.name);
  private readonly client: Anthropic;
  private readonly defaultModel = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic();
  }

  async callWithStructuredOutput<T>(
    options: AICallOptions<T>
  ): Promise<AICallResult<T>> {
    const {
      prompt,
      systemPrompt,
      outputSchema,
      maxRetries = 3,
      timeoutMs = 60000,
      fallbackValue,
    } = options;

    const startTime = Date.now();
    let attempts = 0;
    let lastError: AIError | undefined;

    while (attempts < maxRetries) {
      attempts++;

      try {
        const response = await this.executeWithTimeout(
          this.client.messages.create({
            model: this.defaultModel,
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
          }),
          timeoutMs
        );

        // Extract text content
        const textContent = response.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw this.createError(AIErrorCode.INVALID_OUTPUT, 'No text content in response');
        }

        // Parse JSON from response
        const jsonMatch = textContent.text.match(/```json\n?([\s\S]*?)\n?```/);
        const jsonString = jsonMatch ? jsonMatch[1] : textContent.text;

        let parsed: unknown;
        try {
          parsed = JSON.parse(jsonString);
        } catch {
          throw this.createError(AIErrorCode.INVALID_OUTPUT, 'Response is not valid JSON');
        }

        // Validate against schema
        const validated = outputSchema.safeParse(parsed);
        if (!validated.success) {
          this.logger.warn(`Schema validation failed: ${validated.error.message}`);

          // On validation failure, retry with schema reminder
          if (attempts < maxRetries) {
            continue;
          }
          throw this.createError(
            AIErrorCode.INVALID_OUTPUT,
            `Schema validation failed: ${validated.error.message}`
          );
        }

        return {
          success: true,
          data: validated.data,
          metadata: {
            attempts,
            totalDurationMs: Date.now() - startTime,
            model: this.defaultModel,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        };

      } catch (error) {
        lastError = this.categorizeError(error);
        this.logger.error(`AI call attempt ${attempts} failed: ${lastError.message}`);

        if (!lastError.retryable) {
          break;
        }

        // Exponential backoff
        if (attempts < maxRetries) {
          await this.sleep(Math.pow(2, attempts) * 1000);
        }
      }
    }

    // All retries exhausted
    if (fallbackValue !== undefined) {
      this.logger.warn('Using fallback value after AI failure');
      return {
        success: true,
        data: fallbackValue,
        error: lastError,
        metadata: {
          attempts,
          totalDurationMs: Date.now() - startTime,
          model: this.defaultModel,
          inputTokens: 0,
          outputTokens: 0,
        },
      };
    }

    return {
      success: false,
      error: lastError,
      metadata: {
        attempts,
        totalDurationMs: Date.now() - startTime,
        model: this.defaultModel,
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }

  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(this.createError(AIErrorCode.TIMEOUT, 'Request timed out')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  }

  private categorizeError(error: unknown): AIError {
    if (error instanceof Error && 'code' in error) {
      const aiError = error as AIError;
      if (aiError.code) return aiError;
    }

    if (error instanceof Anthropic.RateLimitError) {
      return this.createError(AIErrorCode.RATE_LIMITED, 'Rate limited', true);
    }

    if (error instanceof Anthropic.APIError) {
      if (error.status === 400 && error.message.includes('context')) {
        return this.createError(AIErrorCode.CONTEXT_TOO_LONG, 'Context window exceeded', false);
      }
      return this.createError(AIErrorCode.UNKNOWN, error.message, true);
    }

    return this.createError(AIErrorCode.UNKNOWN, String(error), true);
  }

  private createError(code: AIErrorCode, message: string, retryable = false): AIError {
    return { code, message, retryable };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2.3 Graceful Degradation

```typescript
// src/telehealth/services/briefing-generator.service.ts

export interface BriefingGenerationResult {
  briefing: PreVisitBriefing;
  completeness: BriefingCompleteness;
  warnings: string[];
}

export interface BriefingCompleteness {
  overallScore: number; // 0-1
  sections: {
    labAnalysis: SectionStatus;
    pillarTrends: SectionStatus;
    adherence: SectionStatus;
    correlations: SectionStatus;
    discussionPoints: SectionStatus;
    wearableInsights: SectionStatus;
  };
}

export enum SectionStatus {
  COMPLETE = 'COMPLETE',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
  NO_DATA = 'NO_DATA',
}

@Injectable()
export class BriefingGeneratorService {
  async generateBriefing(patientId: string, encounterId?: string): Promise<BriefingGenerationResult> {
    const warnings: string[] = [];
    const sectionResults: BriefingCompleteness['sections'] = {
      labAnalysis: SectionStatus.NO_DATA,
      pillarTrends: SectionStatus.NO_DATA,
      adherence: SectionStatus.NO_DATA,
      correlations: SectionStatus.NO_DATA,
      discussionPoints: SectionStatus.NO_DATA,
      wearableInsights: SectionStatus.NO_DATA,
    };

    // Gather data (parallel)
    const [labs, checkIns, adherence, wearables, priorEncounters] = await Promise.all([
      this.gatherLabData(patientId),
      this.gatherCheckInData(patientId),
      this.gatherAdherenceData(patientId),
      this.gatherWearableData(patientId),
      this.gatherPriorEncounters(patientId),
    ]);

    // Generate each section independently - failures don't block others
    const [labAnalysisResult, correlationsResult, discussionPointsResult] = await Promise.allSettled([
      this.generateLabAnalysis(labs),
      this.generateCorrelations(labs, checkIns, wearables),
      this.generateDiscussionPoints(labs, checkIns, adherence, priorEncounters),
    ]);

    // Process lab analysis
    let labAnalyses: BriefingLabAnalysis[] = [];
    if (labAnalysisResult.status === 'fulfilled' && labAnalysisResult.value.success) {
      labAnalyses = labAnalysisResult.value.data;
      sectionResults.labAnalysis = SectionStatus.COMPLETE;
    } else if (labs.length > 0) {
      warnings.push('Lab analysis AI failed - showing raw lab data only');
      sectionResults.labAnalysis = SectionStatus.FAILED;
      labAnalyses = this.createFallbackLabAnalysis(labs);
    }

    // Process correlations
    let correlations: BriefingCorrelation[] = [];
    if (correlationsResult.status === 'fulfilled' && correlationsResult.value.success) {
      correlations = correlationsResult.value.data;
      sectionResults.correlations = SectionStatus.COMPLETE;
    } else {
      warnings.push('Correlation analysis unavailable');
      sectionResults.correlations = SectionStatus.FAILED;
    }

    // Process discussion points
    let discussionPoints: BriefingDiscussionPoint[] = [];
    if (discussionPointsResult.status === 'fulfilled' && discussionPointsResult.value.success) {
      discussionPoints = discussionPointsResult.value.data;
      sectionResults.discussionPoints = SectionStatus.COMPLETE;
    } else {
      warnings.push('AI discussion points unavailable - showing data summary');
      sectionResults.discussionPoints = SectionStatus.FAILED;
      discussionPoints = this.createFallbackDiscussionPoints(labs, checkIns);
    }

    // Pillar trends (non-AI, just data aggregation)
    const pillarTrends = this.calculatePillarTrends(checkIns);
    sectionResults.pillarTrends = pillarTrends.length > 0 ? SectionStatus.COMPLETE : SectionStatus.NO_DATA;

    // Calculate overall completeness
    const completeness: BriefingCompleteness = {
      overallScore: this.calculateOverallScore(sectionResults),
      sections: sectionResults,
    };

    // Create briefing record
    const briefing = await this.prisma.preVisitBriefing.create({
      data: {
        patientId,
        encounterId,
        status: completeness.overallScore > 0.5 ? 'READY' : 'GENERATION_FAILED',
        dataCompleteness: completeness.overallScore,
        // ... other fields
        labAnalyses: { create: labAnalyses },
        correlations: { create: correlations },
        discussionPoints: { create: discussionPoints },
        pillarTrends: { create: pillarTrends },
      },
      include: { /* all relations */ },
    });

    return { briefing, completeness, warnings };
  }

  private createFallbackLabAnalysis(labs: LabResult[]): Partial<BriefingLabAnalysis>[] {
    // Group biomarkers by system based on known mappings
    // Return structured data without AI interpretation
    return labs.flatMap(lab =>
      lab.biomarkers.map(b => ({
        system: this.mapBiomarkerToSystem(b.name),
        labResultId: lab.id,
        status: this.determineStatusFromFlags(b.flag),
        clinicalRelevance: `${b.name}: ${b.value} ${b.unit} (Ref: ${b.referenceRange})`,
        recommendation: null,
      }))
    );
  }

  private createFallbackDiscussionPoints(
    labs: LabResult[],
    checkIns: CheckIn[]
  ): Partial<BriefingDiscussionPoint>[] {
    const points: Partial<BriefingDiscussionPoint>[] = [];

    // Flag any critical lab values
    labs.forEach(lab => {
      lab.biomarkers
        .filter(b => b.flag === 'HIGH' || b.flag === 'LOW')
        .forEach(b => {
          points.push({
            priority: 'HIGH',
            category: 'LAB_FINDING',
            title: `Review ${b.name}`,
            description: `${b.name} is ${b.flag}: ${b.value} ${b.unit}`,
            supportingData: { biomarkerId: b.id, labResultId: lab.id },
            sortOrder: points.length,
          });
        });
    });

    // Flag declining pillar scores
    // ... similar logic

    return points;
  }
}
```

---

## 3. Context Window Management Strategy

### 3.1 Data Budget Allocation

For a 200K token context window, allocate as follows:

| Section | Max Tokens | Strategy |
|---------|------------|----------|
| System prompt | 2,000 | Fixed |
| Patient summary | 500 | Always include |
| Current labs | 3,000 | Full detail for most recent |
| Prior labs (trend) | 1,500 | Summary only: value + flag + date |
| Check-ins (recent 3) | 2,000 | Full pillar scores + notes |
| Check-ins (historical) | 1,000 | Trend summary only |
| Adherence | 500 | Current regimen + compliance % |
| Wearables | 1,000 | Weekly averages, not daily |
| Prior encounters | 2,000 | Most recent 2 full, others summary |
| Output buffer | 4,000 | For response |
| **Total budget** | **17,500** | Safe margin under limits |

### 3.2 Data Compression Service

```typescript
// src/telehealth/services/context-compression.service.ts

@Injectable()
export class ContextCompressionService {
  private readonly TOKEN_BUDGET = 17500;
  private readonly SECTION_BUDGETS = {
    systemPrompt: 2000,
    patientSummary: 500,
    currentLabs: 3000,
    priorLabs: 1500,
    recentCheckIns: 2000,
    historicalCheckIns: 1000,
    adherence: 500,
    wearables: 1000,
    priorEncounters: 2000,
    outputBuffer: 4000,
  };

  async compressPatientContext(patientId: string): Promise<CompressedContext> {
    const rawData = await this.gatherAllData(patientId);

    return {
      patientSummary: this.compressPatientSummary(rawData.patient),

      labs: {
        current: this.formatCurrentLabs(rawData.labs[0]), // Most recent, full detail
        trends: this.summarizeLabTrends(rawData.labs.slice(1, 6)), // Prior 5, summary
      },

      checkIns: {
        recent: rawData.checkIns.slice(0, 3).map(this.formatFullCheckIn),
        historical: this.summarizeCheckInTrends(rawData.checkIns.slice(3)),
      },

      adherence: this.formatAdherenceSummary(rawData.adherence),

      wearables: this.aggregateWearableData(rawData.wearables),

      priorEncounters: {
        recent: rawData.encounters.slice(0, 2).map(this.formatFullEncounter),
        historical: this.summarizeEncounterHistory(rawData.encounters.slice(2)),
      },
    };
  }

  private summarizeLabTrends(labs: LabResult[]): string {
    // Instead of full lab data, create trend summary:
    // "Testosterone: 450 (Jan) → 520 (Mar) → 580 (May) - IMPROVING"
    const biomarkerTrends = new Map<string, { values: number[]; dates: Date[] }>();

    labs.forEach(lab => {
      lab.biomarkers.forEach(b => {
        const trend = biomarkerTrends.get(b.name) || { values: [], dates: [] };
        trend.values.push(b.value);
        trend.dates.push(lab.collectedAt);
        biomarkerTrends.set(b.name, trend);
      });
    });

    return Array.from(biomarkerTrends.entries())
      .map(([name, { values, dates }]) => {
        const trend = this.calculateTrend(values);
        const summary = values.map((v, i) => `${v} (${this.formatMonth(dates[i])})`).join(' → ');
        return `${name}: ${summary} - ${trend}`;
      })
      .join('\n');
  }

  private summarizeCheckInTrends(checkIns: CheckIn[]): string {
    if (checkIns.length === 0) return 'No historical check-ins';

    // Aggregate pillar scores over time
    const pillarAverages = this.calculatePillarAverages(checkIns);
    const overallTrend = this.determineOverallTrend(checkIns);

    return `Historical check-ins (${checkIns.length} total):
Overall trend: ${overallTrend}
Average pillar scores: ${JSON.stringify(pillarAverages)}
Notable patterns: ${this.identifyPatterns(checkIns)}`;
  }

  estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  validateBudget(context: CompressedContext): ValidationResult {
    const sections = Object.entries(context).map(([key, value]) => ({
      section: key,
      tokens: this.estimateTokenCount(JSON.stringify(value)),
      budget: this.SECTION_BUDGETS[key] || 1000,
    }));

    const totalTokens = sections.reduce((sum, s) => sum + s.tokens, 0);
    const overBudget = sections.filter(s => s.tokens > s.budget);

    return {
      totalTokens,
      withinBudget: totalTokens <= this.TOKEN_BUDGET,
      sections,
      overBudget,
    };
  }
}
```

---

## 4. Resolved Design Decisions

### 4.1 Recording Policy

**Decision:** Opt-in per encounter with smart defaults.

```typescript
enum RecordingConsent {
  NOT_REQUESTED = 'NOT_REQUESTED',
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  REVOKED = 'REVOKED',  // Patient can revoke mid-encounter
}

model TelehealthEncounter {
  // ...
  recordingConsent    RecordingConsent @default(NOT_REQUESTED)
  consentRequestedAt  DateTime?
  consentGrantedAt    DateTime?
  consentMethod       String?  // "verbal_confirmed", "written", "in_app"
}
```

**UX Flow:**
1. Encounter scheduled → Patient receives consent form link
2. Patient can pre-consent in portal (preferred)
3. If not pre-consented, provider requests at start of call
4. Patient can revoke at any time → recording stops, transcript deleted

### 4.2 AI Autonomy Level

**Decision:** Auto-generate drafts, require provider trigger for finalization.

| Action | Trigger | Provider Review |
|--------|---------|-----------------|
| Pre-visit briefing | Auto on encounter scheduled | Read-only, no approval needed |
| Lab analysis | Auto on new lab results | Informational only |
| SOAP draft (S) | Auto from check-ins | Included in briefing, editable |
| SOAP draft (O/A/P) | Auto post-encounter | **Required review before save** |
| Final note | Provider clicks "Sign" | Explicit action required |

### 4.3 Patient Access to AI Outputs

**Decision:** Tiered access with provider control.

| Content | Patient Sees | Provider Controls |
|---------|--------------|-------------------|
| Lab results (raw) | Yes | No override |
| Lab AI analysis | Summary only | Can hide sensitive interpretations |
| SOAP notes | After finalized only | Standard release policy |
| AI recommendations | Never | N/A |
| Encounter summary | Provider-approved version | Must approve before release |

```typescript
model PatientEncounterSummary {
  id              String   @id @default(uuid())
  encounterId     String   @unique
  encounter       TelehealthEncounter @relation(...)

  // AI-generated, provider-approved
  summary         String
  keyTakeaways    Json     // Array of bullet points
  actionItems     Json     // What patient should do

  // Approval workflow
  generatedAt     DateTime
  approvedAt      DateTime?
  approvedBy      String?
  releasedAt      DateTime?  // When patient can see it

  // Provider can edit before release
  providerEdits   String?
}
```

### 4.4 Pricing Model

**Decision:** Bundled with utilization tracking for future optimization.

```typescript
// Track AI usage for future pricing decisions
model AIUsageLog {
  id              String   @id @default(uuid())

  patientId       String
  encounterId     String?

  operation       AIOperation
  model           String    // claude-sonnet-4-20250514
  inputTokens     Int
  outputTokens    Int
  durationMs      Int
  success         Boolean

  // Cost tracking (for internal analysis)
  estimatedCost   Float     // Based on current API pricing

  createdAt       DateTime  @default(now())
}

enum AIOperation {
  LAB_ANALYSIS
  BRIEFING_GENERATION
  CORRELATION_ANALYSIS
  DISCUSSION_POINTS
  SOAP_DRAFT
  ENCOUNTER_SUMMARY
}
```

For MVP: Bundle into existing subscription. Track all usage for data-driven pricing later.

### 4.5 Provider Override UX

**Decision:** Inline editing with diff tracking.

```typescript
// Track what provider changed from AI draft
model NoteEditHistory {
  id              String   @id @default(uuid())
  clinicalNoteId  String
  clinicalNote    ClinicalNote @relation(...)

  section         SOAPSection
  aiDraft         String    // What AI suggested
  providerEdit    String    // What provider wrote
  editType        EditType  // ACCEPTED, MODIFIED, REJECTED, WRITTEN_FROM_SCRATCH

  // Diff metadata
  addedCharacters Int
  removedCharacters Int

  editedAt        DateTime  @default(now())
  editedBy        String
}

enum SOAPSection {
  SUBJECTIVE
  OBJECTIVE
  ASSESSMENT
  PLAN
}

enum EditType {
  ACCEPTED          // Provider clicked "Accept" with no changes
  MINOR_EDIT        // <20% characters changed
  MAJOR_EDIT        // 20-80% characters changed
  REJECTED          // Provider deleted AI content, wrote own
  WRITTEN_FROM_SCRATCH  // No AI draft was available
}
```

**UI Pattern:**
- Show AI draft with light blue background
- Provider can click "Accept", "Edit", or "Clear"
- If editing, show inline with changes highlighted
- Track acceptance rate for AI quality metrics

---

## 5. Multi-Provider Video Strategy

### 5.1 Abstraction Layer

```typescript
// src/telehealth/video/video-provider.interface.ts

export interface VideoProvider {
  name: string;

  createMeeting(options: CreateMeetingOptions): Promise<MeetingDetails>;
  getMeeting(meetingId: string): Promise<MeetingDetails>;
  deleteMeeting(meetingId: string): Promise<void>;

  getRecording(meetingId: string): Promise<RecordingDetails | null>;
  getTranscript(meetingId: string): Promise<TranscriptDetails | null>;

  generateJoinUrl(meetingId: string, role: 'host' | 'participant'): Promise<string>;
}

export interface CreateMeetingOptions {
  topic: string;
  scheduledAt: Date;
  durationMinutes: number;
  hostEmail: string;
  participantEmail: string;
  recordingEnabled: boolean;
}

export interface MeetingDetails {
  id: string;
  providerMeetingId: string;
  joinUrl: string;
  hostUrl: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// src/telehealth/video/zoom.provider.ts
@Injectable()
export class ZoomProvider implements VideoProvider {
  name = 'zoom';
  // ... implementation
}

// src/telehealth/video/daily.provider.ts
@Injectable()
export class DailyProvider implements VideoProvider {
  name = 'daily';
  // ... implementation (fallback)
}

// src/telehealth/video/video.service.ts
@Injectable()
export class VideoService {
  private primaryProvider: VideoProvider;
  private fallbackProvider: VideoProvider;

  constructor(
    private zoom: ZoomProvider,
    private daily: DailyProvider,
    private config: ConfigService,
  ) {
    this.primaryProvider = zoom;
    this.fallbackProvider = daily;
  }

  async createMeeting(options: CreateMeetingOptions): Promise<MeetingDetails> {
    try {
      return await this.primaryProvider.createMeeting(options);
    } catch (error) {
      this.logger.warn(`Primary provider failed, using fallback: ${error.message}`);
      return await this.fallbackProvider.createMeeting(options);
    }
  }
}
```

### 5.2 Transcription Fallback

```typescript
// src/telehealth/transcription/transcription.service.ts

@Injectable()
export class TranscriptionService {
  // Priority order for transcription sources
  private readonly sources = [
    'zoom_native',      // Zoom's built-in transcription
    'deepgram',         // Real-time via Deepgram
    'assembly_ai',      // Post-recording via AssemblyAI
    'whisper',          // Self-hosted Whisper as last resort
  ];

  async getTranscript(encounterId: string): Promise<Transcript> {
    const encounter = await this.getEncounter(encounterId);

    // Try each source in order
    for (const source of this.sources) {
      try {
        const transcript = await this.fetchFromSource(source, encounter);
        if (transcript && transcript.quality !== 'UNUSABLE') {
          return transcript;
        }
      } catch (error) {
        this.logger.warn(`Transcription source ${source} failed: ${error.message}`);
        continue;
      }
    }

    // All sources failed
    return {
      text: null,
      quality: 'UNAVAILABLE',
      source: null,
      error: 'All transcription sources failed',
    };
  }
}
```

---

## 6. Enhanced HIPAA Compliance

### 6.1 Required BAAs

| Vendor | Service | BAA Status | Notes |
|--------|---------|------------|-------|
| Anthropic | Claude API | Required | HIPAA-compliant tier available |
| Zoom | Video/Recording | Required | Healthcare plan required |
| Deepgram | Transcription | Required | Healthcare tier available |
| AWS/GCP | Infrastructure | Required | Standard healthcare configs |
| Database | PostgreSQL | N/A | Self-hosted or managed with BAA |

### 6.2 Data Minimization

```typescript
// src/telehealth/ai/prompt-sanitizer.ts

@Injectable()
export class PromptSanitizer {
  // Never send to AI
  private readonly EXCLUDED_FIELDS = [
    'ssn',
    'driversLicense',
    'insuranceId',
    'creditCard',
    'bankAccount',
    'password',
    'address.street',  // City/state OK for context
    'phone',
    'emergencyContact',
  ];

  // Pseudonymize in AI context
  private readonly PSEUDONYMIZE_FIELDS = [
    'firstName',
    'lastName',
    'email',
  ];

  sanitizePatientData(patient: PatientProfile): SanitizedPatient {
    const sanitized = { ...patient };

    // Remove excluded fields
    this.EXCLUDED_FIELDS.forEach(field => {
      this.removeNestedField(sanitized, field);
    });

    // Pseudonymize identifying fields
    sanitized.displayName = `Patient ${patient.id.slice(0, 8)}`;
    delete sanitized.firstName;
    delete sanitized.lastName;
    delete sanitized.email;

    return sanitized;
  }

  reconstructIdentity(aiOutput: string, patient: PatientProfile): string {
    // Replace pseudonyms with real names in provider-facing output
    return aiOutput.replace(
      new RegExp(`Patient ${patient.id.slice(0, 8)}`, 'g'),
      `${patient.firstName} ${patient.lastName}`
    );
  }
}
```

### 6.3 Encryption Requirements

```typescript
// src/telehealth/security/encryption.service.ts

@Injectable()
export class EncryptionService {
  // Encrypt sensitive fields before storage
  private readonly ENCRYPTED_FIELDS = [
    'transcript',
    'recordingUrl',
    'aiDraft',
    'encounterNotes',
  ];

  // Use field-level encryption for PHI
  async encryptField(value: string): Promise<EncryptedField> {
    const key = await this.getDataEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);

    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
      keyVersion: await this.getCurrentKeyVersion(),
    };
  }

  async decryptField(field: EncryptedField): Promise<string> {
    const key = await this.getDataEncryptionKey(field.keyVersion);
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(field.iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(field.tag, 'base64'));

    return decipher.update(field.ciphertext, 'base64', 'utf8') +
           decipher.final('utf8');
  }
}
```

### 6.4 Audit Requirements for AI

```typescript
model AIAuditLog {
  id              String   @id @default(uuid())

  // Who
  userId          String
  userRole        Role
  patientId       String

  // What
  operation       AIOperation
  inputSummary    String    // NOT the full input (PHI minimization)
  inputTokenCount Int
  outputTokenCount Int

  // Decision tracking
  aiSuggestion    String?   // Hash of suggestion, not content
  providerAction  String?   // ACCEPTED, MODIFIED, REJECTED

  // Context
  encounterId     String?
  clinicalNoteId  String?

  // Compliance
  hipaaCategory   String    // "treatment", "operations", "research"
  accessJustification String?

  createdAt       DateTime  @default(now())
  ipAddress       String
  userAgent       String
}
```

---

## 7. Testing & Validation Strategy

### 7.1 AI Quality Metrics

```typescript
// Track these metrics to evaluate AI performance

interface AIQualityMetrics {
  // Acceptance rates
  soapAcceptanceRate: {
    subjective: number;  // % accepted without edit
    objective: number;
    assessment: number;
    plan: number;
  };

  // Edit intensity
  averageEditDistance: {
    subjective: number;  // Levenshtein distance as % of length
    objective: number;
    assessment: number;
    plan: number;
  };

  // Provider satisfaction (collected via quick survey)
  helpfulnessRating: number;  // 1-5
  accuracyRating: number;     // 1-5

  // Error rates
  generationFailureRate: number;
  validationFailureRate: number;

  // Usage patterns
  briefingsGenerated: number;
  briefingsViewed: number;     // Were they actually used?
  averageViewDuration: number; // Did provider read it?
}
```

### 7.2 Validation Phases

**Phase 1: Shadow Mode (2 weeks)**
- Generate AI outputs but don't show to providers
- Manual review by clinical lead
- Compare AI SOAP drafts to provider-written notes
- Identify systematic issues

**Phase 2: Opt-In Beta (4 weeks)**
- 3-5 volunteer providers
- Full feature access
- Daily feedback collection
- Weekly iteration on prompts

**Phase 3: Gradual Rollout**
- Start with 10% of encounters
- Monitor acceptance rates
- Expand by 10% weekly if metrics hold
- Kill switch for immediate disable

### 7.3 Required Tests

```typescript
// src/telehealth/ai/__tests__/ai-analysis.spec.ts

describe('AI Analysis Service', () => {
  describe('Lab Analysis', () => {
    it('should handle empty lab results gracefully', async () => {
      const result = await service.analyzeLabResults([]);
      expect(result.success).toBe(true);
      expect(result.data.systems).toHaveLength(0);
    });

    it('should flag critical values appropriately', async () => {
      const labs = createMockLabs({ testosterone: 150 }); // Critically low
      const result = await service.analyzeLabResults(labs);
      expect(result.data.criticalFindings).toContain(
        expect.stringContaining('testosterone')
      );
    });

    it('should respect token budget', async () => {
      const largeLabs = createMockLabs({ biomarkerCount: 200 });
      const result = await service.analyzeLabResults(largeLabs);
      expect(result.metadata.inputTokens).toBeLessThan(20000);
    });

    it('should return structured output matching schema', async () => {
      const result = await service.analyzeLabResults(createMockLabs());
      const validation = LabAnalysisOutputSchema.safeParse(result.data);
      expect(validation.success).toBe(true);
    });

    it('should recover from rate limiting with retry', async () => {
      // Mock rate limit on first call, success on second
      mockAnthropic.mockRejectedOnce(new RateLimitError());
      mockAnthropic.mockResolvedOnce(validResponse);

      const result = await service.analyzeLabResults(createMockLabs());
      expect(result.success).toBe(true);
      expect(result.metadata.attempts).toBe(2);
    });
  });

  describe('SOAP Draft Generation', () => {
    it('should not hallucinate medications not in transcript', async () => {
      const transcript = 'Patient reports feeling tired. No medication changes discussed.';
      const result = await service.generateSOAPDraft(transcript, mockContext);

      expect(result.data.plan).not.toContainEqual(
        expect.objectContaining({ category: 'MEDICATION' })
      );
    });

    it('should preserve patient quotes accurately', async () => {
      const transcript = 'Patient said "I feel like a new man since starting TRT"';
      const result = await service.generateSOAPDraft(transcript, mockContext);

      expect(result.data.subjective.patientQuotes).toContain(
        'I feel like a new man since starting TRT'
      );
    });
  });
});
```

---

## 8. Implementation Checklist Update

### Phase 1: Foundation (Revised)

- [ ] **Data Models**
  - [ ] Add all new Prisma models from this addendum
  - [ ] Create Zod schemas for JSON fields
  - [ ] Run migration, seed test data

- [ ] **AI Infrastructure**
  - [ ] Implement `AIAnalysisService` with retry logic
  - [ ] Implement `ContextCompressionService`
  - [ ] Implement `PromptSanitizer`
  - [ ] Add structured output schemas

- [ ] **Testing Setup**
  - [ ] Create mock factories for test data
  - [ ] Set up AI response mocking
  - [ ] Implement quality metrics collection

### Phase 2: Pre-Visit (Add)

- [ ] **Graceful Degradation**
  - [ ] Implement section-level fallbacks
  - [ ] Add completeness scoring
  - [ ] Create fallback UI for failed sections

- [ ] **Compliance**
  - [ ] Field-level encryption for PHI
  - [ ] AI audit logging
  - [ ] Data minimization in prompts

### Phase 3: Encounter (Add)

- [ ] **Video Abstraction**
  - [ ] Implement `VideoProvider` interface
  - [ ] Add Daily.co as fallback provider
  - [ ] Transcription fallback chain

### Phase 4: Validation (New Phase)

- [ ] **Shadow Mode**
  - [ ] Generate without displaying
  - [ ] Manual review workflow
  - [ ] Comparison tooling

- [ ] **Metrics Dashboard**
  - [ ] Acceptance rate tracking
  - [ ] Edit distance calculation
  - [ ] Provider feedback collection

---

*Addendum Version: 1.0*
*Created: January 26, 2026*
*Addresses: AI_TELEHEALTH_SPEC.md v1.0*
