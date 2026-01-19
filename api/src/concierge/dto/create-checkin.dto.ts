
export class PillarMetricDto {
    category: string; // SLEEP, RECOVERY, etc.
    score: number;
    notes?: string;
}

export class RegimenAdherenceDto {
    regimenId: string;
    adherent: boolean;
    notes?: string;
}

export class CreateCheckInDto {
    patientId: string;
    type: string; // MONTHLY, QUARTERLY, ADHOC
    date?: string; // Optional, defaults to now

    pillars: PillarMetricDto[];
    adherence: RegimenAdherenceDto[];

    notes?: string;
}
