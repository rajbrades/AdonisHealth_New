-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN "metadata" TEXT;

-- CreateTable
CREATE TABLE "LabPanel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "labType" TEXT NOT NULL DEFAULT 'BLOOD_PANEL',
    "provider" TEXT NOT NULL DEFAULT 'OTHER',
    "providerLabId" TEXT,
    "panelName" TEXT NOT NULL,
    "collectionDate" DATETIME NOT NULL,
    "receivedDate" DATETIME,
    "reportDate" DATETIME,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING_UPLOAD',
    "processingStatus" TEXT,
    "processingError" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "reviewNotes" TEXT,
    "originalFileId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabPanel_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabPanel_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "ProviderProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LabPanel_originalFileId_fkey" FOREIGN KEY ("originalFileId") REFERENCES "LabFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageProvider" TEXT NOT NULL,
    "bucket" TEXT,
    "key" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "checksum" TEXT,
    "ocrText" TEXT,
    "extractedData" TEXT,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BiomarkerCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "defaultUnit" TEXT NOT NULL,
    "optimalRangeLow" REAL,
    "optimalRangeHigh" REAL,
    "refRangeLow" REAL,
    "refRangeHigh" REAL,
    "genderSpecificRanges" TEXT,
    "ageSpecificRanges" TEXT,
    "description" TEXT,
    "clinicalNotes" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "BiomarkerAlias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "biomarkerId" TEXT NOT NULL,
    "labProvider" TEXT NOT NULL,
    "aliasName" TEXT NOT NULL,
    "aliasCode" TEXT,
    "labUnit" TEXT,
    "conversionFactor" REAL NOT NULL DEFAULT 1.0,
    "labRefRangeLow" REAL,
    "labRefRangeHigh" REAL,
    CONSTRAINT "BiomarkerAlias_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "BiomarkerCatalog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabResultValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "labPanelId" TEXT NOT NULL,
    "biomarkerId" TEXT NOT NULL,
    "rawValue" TEXT NOT NULL,
    "rawUnit" TEXT,
    "numericValue" REAL,
    "normalizedUnit" TEXT,
    "flag" TEXT,
    "refRangeLow" REAL,
    "refRangeHigh" REAL,
    "optimalRangeLow" REAL,
    "optimalRangeHigh" REAL,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    "extractionConfidence" REAL,
    "providerNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabResultValue_labPanelId_fkey" FOREIGN KEY ("labPanelId") REFERENCES "LabPanel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabResultValue_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "BiomarkerCatalog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL DEFAULT 'MONTHLY',
    "notes" TEXT,
    "advisorNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CheckIn_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PillarMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "PillarMetric_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegimenAdherence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInId" TEXT NOT NULL,
    "regimenId" TEXT NOT NULL,
    "adherent" BOOLEAN NOT NULL,
    "notes" TEXT,
    CONSTRAINT "RegimenAdherence_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegimenAdherence_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "ActiveRegimen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LabPanel_patientId_collectionDate_idx" ON "LabPanel"("patientId", "collectionDate");

-- CreateIndex
CREATE INDEX "LabPanel_status_idx" ON "LabPanel"("status");

-- CreateIndex
CREATE INDEX "LabPanel_provider_idx" ON "LabPanel"("provider");

-- CreateIndex
CREATE INDEX "LabFile_key_idx" ON "LabFile"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BiomarkerCatalog_code_key" ON "BiomarkerCatalog"("code");

-- CreateIndex
CREATE INDEX "BiomarkerCatalog_category_idx" ON "BiomarkerCatalog"("category");

-- CreateIndex
CREATE INDEX "BiomarkerCatalog_code_idx" ON "BiomarkerCatalog"("code");

-- CreateIndex
CREATE INDEX "BiomarkerAlias_aliasName_idx" ON "BiomarkerAlias"("aliasName");

-- CreateIndex
CREATE INDEX "BiomarkerAlias_labProvider_idx" ON "BiomarkerAlias"("labProvider");

-- CreateIndex
CREATE UNIQUE INDEX "BiomarkerAlias_biomarkerId_labProvider_aliasName_key" ON "BiomarkerAlias"("biomarkerId", "labProvider", "aliasName");

-- CreateIndex
CREATE INDEX "LabResultValue_labPanelId_idx" ON "LabResultValue"("labPanelId");

-- CreateIndex
CREATE INDEX "LabResultValue_biomarkerId_idx" ON "LabResultValue"("biomarkerId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");
