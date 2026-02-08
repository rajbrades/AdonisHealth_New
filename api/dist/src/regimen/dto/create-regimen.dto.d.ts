export declare class CreateRegimenDto {
    name: string;
    dosage?: string;
    frequency?: string;
    type: 'RX' | 'SUPPLEMENT';
    notes?: string;
    startDate?: string;
    reason?: string;
}
