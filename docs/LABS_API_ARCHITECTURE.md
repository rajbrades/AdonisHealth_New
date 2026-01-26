# Labs API Architecture Plan

## Overview

Design a comprehensive labs system supporting multi-source PDF uploads, 100+ biomarkers, historical trends, and multiple lab types (blood, genetic, gut health).

---

## Key Architecture Decisions

### 1. Data Model Strategy

**Replace** existing `LabResult`/`Biomarker` models with a normalized schema:

| Model | Purpose |
|-------|---------|
| `LabPanel` | Container for a single lab report (replaces LabResult) |
| `LabResultValue` | Individual biomarker result within a panel |
| `BiomarkerCatalog` | Master list of all biomarkers with canonical names/units |
| `BiomarkerAlias` | Lab-specific names/codes (Quest vs Labcorp naming) |
| `LabFile` | Uploaded PDF metadata and storage reference |
| `GeneticTest` | Specialized model for genetic test results (JSON-based) |
| `GutHealthTest` | Specialized model for gut health results (JSON-based) |

**Why separate models for genetic/gut?** These have fundamentally different result structures (gene variants, microbial species) that don't fit the biomarker pattern.

### 2. Biomarker Normalization

- **BiomarkerCatalog**: ~100+ canonical biomarkers with standardized codes (`TOTAL_TESTOSTERONE`, `HBA1C`)
- **BiomarkerAlias**: Maps lab-specific names to canonical codes
  - Quest: "Testosterone, Total" → `TOTAL_TESTOSTERONE`
  - Labcorp: "Testosterone, Total, Serum" → `TOTAL_TESTOSTERONE`
- **Unit conversion**: Some labs report in different units; store conversion factors
- **Reference ranges**: Store both lab-specific and Adonis "optimal" ranges

### 3. PDF Processing Pipeline

```
Upload PDF → Store in S3 → Queue for Processing → OCR → AI Extraction → Normalize → Review
```

**Processing approach**: AI-first extraction using Claude Haiku (fast, cost-effective)
- OCR the PDF to text
- AI extracts structured biomarker data
- Normalize against BiomarkerCatalog
- Flag unmatched biomarkers for manual mapping

### 4. File Storage

**S3** for production with local filesystem fallback for development:
- Encrypted at rest (AES-256)
- Lifecycle rules: move to Glacier after 1 year
- Pre-signed URLs for secure downloads

---

## API Endpoints

### Core Labs

```
POST   /api/labs/upload              # Upload PDF (creates panel + triggers processing)
GET    /api/labs?patientId=x         # List labs with filters
GET    /api/labs/:id                 # Get panel with results
POST   /api/labs/:id/results         # Manually add results
PATCH  /api/labs/:id/results/:rid    # Update result value
POST   /api/labs/:id/review          # Provider review
```

### Trends

```
GET    /api/labs/trends/biomarker/:code?patientId=x   # Single biomarker trend
GET    /api/labs/trends/summary/:patientId            # Dashboard with key biomarkers
```

### Biomarker Catalog

```
GET    /api/labs/biomarkers                 # List all with categories
GET    /api/labs/biomarkers/:code           # Single biomarker details
```

### Specialized Tests (Phase 5)

```
POST   /api/labs/genetic                    # Upload genetic test
GET    /api/labs/genetic/patient/:id        # List genetic tests
POST   /api/labs/gut-health                 # Upload gut health test
GET    /api/labs/gut-health/patient/:id     # List gut health tests
```

---

## Data Models

### Enums

```prisma
enum LabType {
  BLOOD_PANEL
  GENETIC_TEST
  GUT_HEALTH
  HORMONE_PANEL
  URINALYSIS
  OTHER
}

enum LabProvider {
  QUEST
  LABCORP
  ACCESS_MEDICAL
  INTERNAL
  OTHER
}

enum LabStatus {
  PENDING_UPLOAD
  PROCESSING
  PENDING_REVIEW
  REVIEWED
  FLAGGED
}

enum ProcessingStatus {
  QUEUED
  EXTRACTING
  EXTRACTED
  NORMALIZED
  FAILED
  MANUAL_ENTRY
}

enum BiomarkerFlag {
  CRITICAL_LOW
  LOW
  OPTIMAL
  HIGH
  CRITICAL_HIGH
}
```

### Core Models

```prisma
model LabPanel {
  id              String   @id @default(uuid())
  patientId       String
  patient         PatientProfile @relation(fields: [patientId], references: [id])

  labType         LabType
  provider        LabProvider
  providerLabId   String?
  panelName       String

  collectionDate  DateTime
  receivedDate    DateTime?
  reportDate      DateTime?
  uploadedAt      DateTime @default(now())

  status          LabStatus @default(PENDING_UPLOAD)
  processingStatus ProcessingStatus?
  processingError String?

  reviewedById    String?
  reviewedBy      ProviderProfile? @relation(fields: [reviewedById], references: [id])
  reviewedAt      DateTime?
  reviewNotes     String?

  originalFileId  String?
  originalFile    LabFile? @relation(fields: [originalFileId], references: [id])

  results         LabResultValue[]
  metadata        String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([patientId, collectionDate])
  @@index([status])
}

model LabFile {
  id               String   @id @default(uuid())
  storageProvider  String
  bucket           String?
  key              String
  originalFilename String
  mimeType         String
  fileSize         Int
  checksum         String?
  ocrText          String?
  extractedData    String?
  uploadedById     String
  uploadedBy       User @relation(fields: [uploadedById], references: [id])
  uploadedAt       DateTime @default(now())
  labPanels        LabPanel[]

  @@index([key])
}

model BiomarkerCatalog {
  id                  String   @id @default(uuid())
  code                String   @unique
  name                String
  category            String
  subcategory         String?
  defaultUnit         String
  optimalRangeLow     Float?
  optimalRangeHigh    Float?
  refRangeLow         Float?
  refRangeHigh        Float?
  genderSpecificRanges String?
  ageSpecificRanges   String?
  description         String?
  clinicalNotes       String?
  displayOrder        Int @default(0)
  isActive            Boolean @default(true)

  aliases             BiomarkerAlias[]
  results             LabResultValue[]

  @@index([category])
  @@index([code])
}

model BiomarkerAlias {
  id               String   @id @default(uuid())
  biomarkerId      String
  biomarker        BiomarkerCatalog @relation(fields: [biomarkerId], references: [id])
  labProvider      LabProvider
  aliasName        String
  aliasCode        String?
  labUnit          String?
  conversionFactor Float @default(1.0)
  labRefRangeLow   Float?
  labRefRangeHigh  Float?

  @@unique([biomarkerId, labProvider, aliasName])
  @@index([aliasName])
}

model LabResultValue {
  id               String   @id @default(uuid())
  labPanelId       String
  labPanel         LabPanel @relation(fields: [labPanelId], references: [id], onDelete: Cascade)
  biomarkerId      String
  biomarker        BiomarkerCatalog @relation(fields: [biomarkerId], references: [id])

  rawValue         String
  rawUnit          String?
  numericValue     Float?
  normalizedUnit   String?
  flag             BiomarkerFlag?

  refRangeLow      Float?
  refRangeHigh     Float?
  optimalRangeLow  Float?
  optimalRangeHigh Float?

  isManualEntry    Boolean @default(false)
  extractionConfidence Float?
  providerNote     String?

  createdAt        DateTime @default(now())

  @@index([labPanelId])
  @@index([biomarkerId])
}
```

---

## Implementation Phases

### Phase 1: Schema & Core CRUD
- Add Prisma models (LabPanel, BiomarkerCatalog, LabResultValue, LabFile)
- Seed BiomarkerCatalog with 100+ biomarkers and aliases
- Create Labs module with basic CRUD endpoints
- Manual result entry (no PDF yet)

### Phase 2: File Upload & Storage
- Add StorageService (S3 + local)
- PDF upload endpoint with multer
- File download with pre-signed URLs

### Phase 3: PDF Processing
- Add Bull queue for async processing
- OCR integration (pdf-parse)
- AI extraction service (Claude Haiku)
- Normalization pipeline

### Phase 4: Trends & Analytics
- Trend query endpoints
- Dashboard summary endpoint
- Optimized queries with proper indexes

### Phase 5: Specialized Tests
- GeneticTest model and endpoints
- GutHealthTest model and endpoints

---

## Confirmed Decisions

| Decision | Choice |
|----------|--------|
| PDF Processing | **AI Extraction** - Claude Haiku for automated biomarker extraction |
| File Storage | **AWS S3** - HIPAA-eligible, lifecycle policies, pre-signed URLs |
| Priority | **Blood panels first** - Core TRT monitoring use case; genetic/gut later |

---

## Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install @nestjs/bull bull
npm install multer @types/multer
npm install pdf-parse
```

## Environment Variables

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET=adonis-health-labs
STORAGE_PROVIDER=s3
ANTHROPIC_API_KEY=xxx
REDIS_URL=redis://localhost:6379
```

---

*Document Version: 1.0*
*Created: January 26, 2026*
