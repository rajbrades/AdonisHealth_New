export declare class PillarMetricDto {
    category: string;
    score: number;
    notes?: string;
}
export declare class RegimenAdherenceDto {
    regimenId: string;
    adherent: boolean;
    notes?: string;
}
export declare class CreateCheckInDto {
    patientId: string;
    type: string;
    date?: string;
    pillars: PillarMetricDto[];
    adherence: RegimenAdherenceDto[];
    notes?: string;
}
