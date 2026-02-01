import { PrismaService } from '../prisma/prisma.service';
export interface ExtractedBiomarker {
    name: string;
    value: string;
    unit: string | null;
    refRange: string | null;
    flag: string | null;
}
export interface ExtractionResult {
    collectionDate: string | null;
    receivedDate: string | null;
    reportDate: string | null;
    patientName: string | null;
    biomarkers: ExtractedBiomarker[];
}
export interface MatchedBiomarker {
    extracted: ExtractedBiomarker;
    catalogMatch: {
        id: string;
        code: string;
        name: string;
        category: string;
        defaultUnit: string;
        optimalRangeLow: number | null;
        optimalRangeHigh: number | null;
    } | null;
    matchedVia: string | null;
    confidence: 'exact' | 'fuzzy' | 'none';
    numericValue: number | null;
    calculatedFlag: string | null;
}
export interface ProcessingResult {
    success: boolean;
    pdfText: string;
    textLength: number;
    extraction: ExtractionResult;
    matched: MatchedBiomarker[];
    stats: {
        total: number;
        matched: number;
        unmatched: number;
        matchRate: string;
    };
    unmatchedNames: string[];
}
export declare class LabsService {
    private prisma;
    private anthropic;
    constructor(prisma: PrismaService);
    extractTextFromPdf(buffer: Buffer): Promise<string>;
    extractBiomarkersWithAI(pdfText: string, provider: string): Promise<ExtractionResult>;
    matchBiomarkers(extracted: ExtractedBiomarker[], provider: string): Promise<MatchedBiomarker[]>;
    private parseNumericValue;
    private calculateFlag;
    processLabPdf(buffer: Buffer, provider: string): Promise<ProcessingResult>;
    getBiomarkerCatalog(): Promise<({
        aliases: {
            aliasCode: string | null;
            id: string;
            biomarkerId: string;
            labProvider: string;
            aliasName: string;
            labUnit: string | null;
            conversionFactor: number;
            labRefRangeLow: number | null;
            labRefRangeHigh: number | null;
        }[];
    } & {
        genderSpecificRanges: string | null;
        subcategory: string | null;
        id: string;
        code: string;
        name: string;
        category: string;
        defaultUnit: string;
        optimalRangeLow: number | null;
        optimalRangeHigh: number | null;
        refRangeLow: number | null;
        refRangeHigh: number | null;
        ageSpecificRanges: string | null;
        description: string | null;
        clinicalNotes: string | null;
        displayOrder: number;
        isActive: boolean;
    })[]>;
    addAlias(biomarkerCode: string, labProvider: string, aliasName: string): Promise<{
        aliasCode: string | null;
        id: string;
        biomarkerId: string;
        labProvider: string;
        aliasName: string;
        labUnit: string | null;
        conversionFactor: number;
        labRefRangeLow: number | null;
        labRefRangeHigh: number | null;
    }>;
    getAliasStats(): Promise<{
        total: number;
        biomarkerCount: number;
        byProvider: {
            provider: string;
            count: number;
        }[];
    }>;
}
