import { LabsService } from './labs.service';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    extractFromPdf(file: Express.Multer.File, provider: string): Promise<import("./labs.service").ProcessingResult>;
    getCatalog(): Promise<({
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
    getStats(): Promise<{
        total: number;
        biomarkerCount: number;
        byProvider: {
            provider: string;
            count: number;
        }[];
    }>;
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
}
