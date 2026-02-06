export interface RequisitionData {
    orderNumber: string;
    panelName: string;
    panelCodes: string | null;
    labProvider: string;
    price: number;
    patientPay: boolean;
    drawSiteAddress: string | null;
    scheduledDrawDate: Date | null;
    notes: string | null;
    patient: {
        firstName: string;
        lastName: string;
        dob: Date;
        gender: string;
        phone: string | null;
        address: string | null;
        user: {
            email: string;
        };
    };
    orderingProvider: {
        firstName: string;
        lastName: string;
        specialty: string | null;
        deaNumber: string | null;
    } | null;
    createdAt: Date;
}
export declare class RequisitionPdfService {
    private readonly outputDir;
    constructor();
    generateRequisition(data: RequisitionData): Promise<string>;
    private drawHeader;
    private drawPatientInfo;
    private drawTestInfo;
    private drawProviderInfo;
    private drawInstructions;
    private drawFooter;
    getRequisitionPath(orderNumber: string): string;
    requisitionExists(orderNumber: string): boolean;
    deleteRequisition(orderNumber: string): void;
    getStorageKey(orderNumber: string): string;
}
