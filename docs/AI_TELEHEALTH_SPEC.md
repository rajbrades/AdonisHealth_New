# AI-Powered Telehealth System Specification

## Overview

This document specifies the AI-powered telehealth system for Adonis Health, enabling intelligent pre-visit preparation, encounter support, and post-visit note completion.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA COLLECTION (Ongoing)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   CheckIns          Wearables           Labs              Clinical Notes        │
│   (Monthly)         (Daily sync)        (Q6-8 weeks)      (Per encounter)       │
│       │                 │                   │                    │              │
│       ▼                 ▼                   ▼                    ▼              │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                      PATIENT RECORD (Database)                      │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│                                      │                                          │
└──────────────────────────────────────┼──────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PRE-VISIT PHASE                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   Trigger: Encounter scheduled OR Provider requests briefing                    │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                   AI PRE-VISIT SYNTHESIS ENGINE                     │       │
│   │                                                                     │       │
│   │   Inputs:                        Outputs:                           │       │
│   │   • Labs + AI Analysis           • Lab Summary by System            │       │
│   │   • CheckIns (pillars, notes)    • Subjective Trends                │       │
│   │   • Adherence Records            • Adherence Report                 │       │
│   │   • Concierge Notes              • Correlation Analysis             │       │
│   │   • Wearable Trends              • Discussion Points                │       │
│   │   • Prior Encounters             • Pre-Charted SOAP (S only)        │       │
│   │   • Patient Goals                                                   │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│                                      │                                          │
│                                      ▼                                          │
│                        ┌─────────────────────────┐                              │
│                        │   PRE-VISIT BRIEFING    │                              │
│                        │   (Stored + Displayed)  │                              │
│                        └─────────────────────────┘                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ENCOUNTER PHASE                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   Provider View:                                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │  PRE-VISIT       │    VIDEO CALL      │    SOAP EDITOR              │       │
│   │  BRIEFING        │    (Zoom)          │                             │       │
│   │  (Read-only)     │                    │    S: [Pre-filled] ✓        │       │
│   │                  │    Recording +     │    O: [Empty]               │       │
│   │  • Lab Summary   │    Transcription   │    A: [Empty]               │       │
│   │  • Symptoms      │                    │    P: [Empty]               │       │
│   │  • Correlations  │                    │                             │       │
│   │  • Discussion    │                    │    Macros available         │       │
│   │    Points        │                    │                             │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           POST-ENCOUNTER PHASE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                   AI NOTE COMPLETION ENGINE                         │       │
│   │                                                                     │       │
│   │   Inputs:                        Outputs:                           │       │
│   │   • Pre-Visit Briefing           • Enhanced Subjective              │       │
│   │   • Encounter Transcript         • Complete Objective               │       │
│   │   • Provider Notes               • Draft Assessment                 │       │
│   │   • Labs Discussed               • Draft Plan                       │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│                                      │                                          │
│                                      ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                   PROVIDER REVIEW SCREEN                            │       │
│   │                                                                     │       │
│   │   Pre-Charted  vs  AI Draft  →  Accept / Edit / Reject              │       │
│   │                                                                     │       │
│   │   [Sign & Lock] → ClinicalNote.status = FINALIZED                   │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
│   Finalized note becomes "Prior Encounter" for next pre-visit briefing          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### New Models

#### PreVisitBriefing

```prisma
model PreVisitBriefing {
  id              String   @id @default(uuid())
  
  patientId       String
  patient         PatientProfile @relation(fields: [patientId], references: [id])
  
  encounterId     String?  @unique
  encounter       TelehealthEncounter? @relation(fields: [encounterId], references: [id])
  
  clinicalNoteId  String?
  clinicalNote    ClinicalNote? @relation(fields: [clinicalNoteId], references: [id])
  
  generatedAt     DateTime @default(now())
  
  // Structured content (stored as JSON)
  patientSummary        String   // Demographics, Dx, time on protocol
  labAnalysis           String   // JSON: SystemAnalysis[]
  subjectiveTrends      String   // JSON: Pillar scores over time
  adherenceReport       String   // JSON: Medication compliance
  conciergeNotes        String   // JSON: Recent check-in notes
  wearableInsights      String   // JSON: Sleep, HRV, recovery
  priorEncounterSummary String   // JSON: Last assessment/plan
  correlationAnalysis   String   // JSON: Subjective ↔ Objective links
  discussionPoints      String   // JSON: Prioritized recommendations
  preChartedSubjective  String   // Pre-filled S section
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### TelehealthEncounter

```prisma
model TelehealthEncounter {
  id              String   @id @default(uuid())
  
  patientId       String
  patient         PatientProfile @relation(fields: [patientId], references: [id])
  
  providerId      String
  provider        ProviderProfile @relation(fields: [providerId], references: [id])
  
  clinicalNoteId  String?  @unique
  clinicalNote    ClinicalNote? @relation(fields: [clinicalNoteId], references: [id])
  
  preVisitBriefing PreVisitBriefing?
  
  // Status
  status          String   @default("SCHEDULED") // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  type            String   @default("FOLLOW_UP") // INITIAL, FOLLOW_UP, MEDICATION_REVIEW, URGENT
  
  // Scheduling
  scheduledAt     DateTime
  startedAt       DateTime?
  endedAt         DateTime?
  durationMinutes Int?
  
  // Video Integration
  zoomMeetingId   String?
  zoomJoinUrl     String?
  zoomStartUrl    String?
  
  // Encounter Data
  patientAgenda   String?  // What patient wants to discuss
  vitalSigns      String?  // JSON: { bp, hr, weight, temp }
  
  // Recording/Transcription
  recordingUrl    String?
  recordingConsentGiven Boolean @default(false)
  transcript      String?  // Raw transcript
  
  // AI Analysis
  aiSummary       String?  // Executive summary of encounter
  aiAnalysis      String?  // Structured analysis
  
  // Labs Reviewed
  labsReviewed    String?  // JSON: Array of lab IDs discussed
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Modified Models

#### ClinicalNote (Add fields)

```prisma
model ClinicalNote {
  // ...existing fields...
  
  // Link to telehealth encounter
  telehealthEncounter TelehealthEncounter?
  preVisitBriefing    PreVisitBriefing?
  
  // AI-generated drafts (provider reviews before finalizing)
  aiObjectiveDraft    String?  // AI suggestion for O
  aiAssessmentDraft   String?  // AI suggestion for A
  aiPlanDraft         String?  // AI suggestion for P
  aiConfidenceScore   Float?   // 0-1 confidence in suggestions
  
  // Encounter summary (used in future pre-visit briefings)
  encounterSummary    String?  // AI-generated summary of this encounter
  
  // Audit
  providerEditedAI    Boolean  @default(false) // Did provider modify AI drafts?
}
```

#### PatientProfile (Add relations)

```prisma
model PatientProfile {
  // ...existing fields...
  
  telehealthEncounters TelehealthEncounter[]
  preVisitBriefings    PreVisitBriefing[]
}
```

#### ProviderProfile (Add relations)

```prisma
model ProviderProfile {
  // ...existing fields...
  
  telehealthEncounters TelehealthEncounter[]
}
```

---

## AI Prompts

### Prompt 1: Lab Analysis (Primary)

```
Analyze the following lab results and provide a structured interpretation 
organized by physiological system (e.g., blood sugar regulation, thyroid/adrenal 
function, gastrointestinal, detoxification, inflammation, cardiovascular).

For each analyte:
1. Identify if the result falls within the optimal, borderline/suboptimal, 
   or pathological range
2. Explain the clinical relevance of any deviations
3. Highlight patterns that suggest underlying system imbalances 
   (e.g., insulin resistance, mitochondrial stress, immune activation)
4. Recommend next steps or considerations for each flagged finding

Labs:
{biomarkers_json}

Prior Labs (for trend analysis):
{prior_labs_json}

Patient Context:
- Age: {age}
- Gender: {gender}
- Current Protocol: {regimen}
- Time on Protocol: {duration}
```

### Prompt 2: Subjective-Objective Correlation

```
Given the following patient data, identify correlations between subjective 
symptoms and objective findings:

LAB ANALYSIS:
{lab_analysis_result}

CHECK-IN DATA (Last 3):
{checkin_data_json}

PILLAR SCORES TREND:
{pillar_trends}

CONCIERGE NOTES:
{concierge_notes}

WEARABLE DATA:
{wearable_data}

For each correlation:
1. State the subjective complaint (patient-reported symptom or concern)
2. State the objective finding (lab value, wearable metric)
3. Explain the physiological connection
4. Rate confidence: HIGH / MEDIUM / LOW

Also identify DISCREPANCIES where:
- Labs are optimal but patient reports symptoms (investigate other causes)
- Labs are abnormal but patient feels fine (early detection opportunity)
```

### Prompt 3: Discussion Points Generation

```
Based on the complete patient analysis, generate prioritized discussion 
points for today's encounter:

PATIENT CONTEXT:
{patient_summary}

LAB ANALYSIS:
{lab_analysis}

SYMPTOM TRENDS:
{symptom_trends}

CORRELATIONS:
{correlations}

PRIOR ENCOUNTER:
{prior_encounter_summary}

ACTION ITEMS FROM PRIOR VISIT:
{prior_action_items}

Generate discussion points in three priority levels:

🔴 HIGH PRIORITY
- Issues requiring immediate action
- Action items from prior visit that are now due
- Critical lab findings with symptoms

🟡 MEDIUM PRIORITY  
- Optimization opportunities
- Trending concerns to address
- Patient-reported frustrations

🟢 MONITORING
- Values to watch but not act on yet
- Positive trends to acknowledge

For each point, include:
- The issue
- Supporting data (labs, symptoms, trends)
- Recommended action or discussion topic
```

### Prompt 4: Post-Encounter Note Completion

```
Complete the clinical note based on the encounter transcript and pre-visit context.

PRE-VISIT BRIEFING:
{pre_visit_briefing}

PRE-CHARTED SUBJECTIVE:
{pre_charted_subjective}

ENCOUNTER TRANSCRIPT:
{transcript}

VITALS ENTERED:
{vitals}

LABS REVIEWED:
{labs_reviewed}

Generate:

SUBJECTIVE (Enhanced):
Merge the pre-charted subjective with new information from the transcript.
Include patient's own words where relevant.

OBJECTIVE:
- Vital signs: {vitals}
- Labs reviewed with key findings
- Any physical exam findings mentioned

ASSESSMENT:
Provide clinical assessments based on:
- Lab analysis patterns
- Symptom correlations
- Encounter discussion
Format: Numbered list of diagnoses/findings with brief reasoning

PLAN:
Based on discussion and provider decisions during encounter:
- Medication changes
- Lab orders
- Follow-up timing
- Lifestyle recommendations
- Products/supplements discussed

Confidence Score: 0-1 (how confident in the suggestions)
```

---

## API Endpoints

### Pre-Visit

```
POST /api/telehealth/briefings
  - Generate pre-visit briefing for a patient
  - Body: { patientId, encounterId? }
  - Returns: PreVisitBriefing

GET /api/telehealth/briefings/:id
  - Get pre-visit briefing
  - Returns: PreVisitBriefing with all sections

GET /api/telehealth/briefings/patient/:patientId/latest
  - Get most recent briefing for patient
  - Returns: PreVisitBriefing
```

### Encounters

```
POST /api/telehealth/encounters
  - Schedule new encounter
  - Body: { patientId, providerId, scheduledAt, type }
  - Returns: TelehealthEncounter

GET /api/telehealth/encounters/:id
  - Get encounter details
  - Returns: TelehealthEncounter with relations

PATCH /api/telehealth/encounters/:id/start
  - Mark encounter as started
  - Returns: TelehealthEncounter

PATCH /api/telehealth/encounters/:id/complete
  - Complete encounter with transcript
  - Body: { transcript?, vitalSigns?, durationMinutes }
  - Triggers AI note completion
  - Returns: TelehealthEncounter
```

### AI Analysis

```
POST /api/telehealth/encounters/:id/analyze
  - Trigger AI analysis of completed encounter
  - Returns: { summary, analysis, noteDrafts }

POST /api/telehealth/labs/:labId/analyze
  - Analyze specific lab with patient context
  - Returns: LabAnalysisResult
```

---

## UI Components

### Pre-Visit Briefing Component

Location: `web/components/telehealth/pre-visit-briefing.tsx`

Sections:
1. Patient Header (name, age, Dx, time on protocol)
2. Lab Analysis (collapsible by system)
3. Subjective Trends (chart + table)
4. Adherence Report
5. Concierge Notes (expandable cards)
6. Wearable Insights
7. Correlation Analysis
8. Prior Encounter Summary
9. Discussion Points (prioritized list)

### Encounter View Component

Location: `web/components/telehealth/encounter-view.tsx`

Layout:
- Left Panel: Pre-Visit Briefing (scrollable, read-only)
- Center: Video call (Zoom embed)
- Right Panel: SOAP Editor with Macros

### Post-Encounter Review Component

Location: `web/components/telehealth/note-review.tsx`

Features:
- Side-by-side: Pre-charted vs AI Draft
- Per-section Accept/Edit/Reject
- Diff highlighting
- Sign & Lock button

---

## Integration Points

### Zoom Integration

- Use Zoom OAuth for provider accounts
- Create meetings via Zoom API
- Retrieve cloud recordings via webhook
- Extract transcript from recording

### LLM Provider

- Primary: Claude (Anthropic) - HIPAA BAA available
- Fallback: OpenAI GPT-4
- Context window: Ensure patient data fits

### Wearable APIs

- Oura: OAuth + API for sleep/readiness/HRV
- Whoop: OAuth + API for strain/recovery
- Apple Health: HealthKit (iOS app required)

---

## Workflow States

### PreVisitBriefing States

```
GENERATING → READY → VIEWED → ENCOUNTER_STARTED → ARCHIVED
```

### TelehealthEncounter States

```
SCHEDULED → IN_PROGRESS → COMPLETED → CANCELLED
```

### ClinicalNote States (Existing)

```
DRAFT → PENDING_REVIEW → FINALIZED
```

### Combined Flow

```
1. Encounter SCHEDULED
2. PreVisitBriefing GENERATING → READY
3. Provider opens encounter → Briefing VIEWED
4. Encounter IN_PROGRESS, Briefing ENCOUNTER_STARTED
5. Encounter COMPLETED
6. ClinicalNote DRAFT → AI completes → PENDING_REVIEW
7. Provider reviews → FINALIZED
8. Briefing ARCHIVED
```

---

## Data Retention & Compliance

### HIPAA Considerations

- All AI processing must use HIPAA-compliant providers
- Transcripts stored encrypted at rest
- Audit logging for all data access
- Patient consent required for recording

### Retention Policy

- Pre-Visit Briefings: Archive after encounter, retain 7 years
- Encounter Recordings: Per patient consent, retain per policy
- Transcripts: Retain as part of medical record
- AI Drafts: Retain for audit trail (what AI suggested vs final)

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- [ ] Prisma schema updates
- [ ] PreVisitBriefing model + service
- [ ] Basic lab analysis AI integration
- [ ] Pre-visit briefing UI component

### Phase 2: Encounter Integration
- [ ] TelehealthEncounter model + service
- [ ] Zoom OAuth integration
- [ ] Encounter scheduling flow
- [ ] Basic encounter view UI

### Phase 3: AI Enhancement
- [ ] Full correlation analysis
- [ ] Post-encounter AI note completion
- [ ] Provider review workflow
- [ ] Discussion points generation

### Phase 4: Advanced Features
- [ ] Real-time transcription
- [ ] Wearable data deep integration
- [ ] Automated follow-up scheduling
- [ ] Patient-facing encounter summaries

---

## Reference: Practice Better Comparison

| Feature | Practice Better | Adonis Health (Planned) |
|---------|-----------------|------------------------|
| Recording | ✓ Native + Zoom | ✓ Zoom integration |
| Transcription | ✓ Multi-language | ✓ Via Zoom/Deepgram |
| Summary Formats | Narrative, Outline, SOAP | SOAP (hormone-optimized) |
| Lab Integration | ✗ None | ✓ Full analysis by system |
| Prior Encounter Context | Basic recap | Full summary + action items |
| Symptom Tracking | ✗ None | ✓ Pillar scores + trends |
| Wearable Integration | ✗ None | ✓ Oura, Whoop, Apple |
| Correlation Analysis | ✗ None | ✓ Subjective ↔ Objective |
| Clinical Decision Support | ✗ None | ✓ AI recommendations |
| Protocol Awareness | ✗ None | ✓ Regimen context in analysis |

---

## Open Questions

1. **Recording Default**: Should all encounters be recorded by default?
2. **AI Autonomy**: Auto-generate notes or require provider trigger?
3. **Patient Access**: Should patients see AI summaries?
4. **Pricing**: Per-encounter fee or bundled?
5. **Provider Override**: UX for editing AI suggestions?

---

*Document Version: 1.0*
*Last Updated: January 26, 2026*
