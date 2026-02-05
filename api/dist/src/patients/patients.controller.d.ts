import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    findAll(): Promise<({
        clinicalNotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            chiefComplaint: string | null;
            history: string | null;
            subjective: string | null;
            objective: string | null;
            assessment: string | null;
            plan: string | null;
            patientId: string;
            providerId: string | null;
            conciergeId: string | null;
        }[];
        user: {
            email: string;
            role: string;
            createdAt: Date;
        };
        labResults: {
            id: string;
            status: string;
            patientId: string;
            providerId: string | null;
            uploadedAt: Date;
            testDate: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            patientId: string;
            totalAmount: number;
            fulfillmentId: string | null;
            trackingUrl: string | null;
        }[];
    } & {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        dob: Date;
        gender: string;
        phone: string | null;
        address: string | null;
    })[]>;
    findOne(id: string): Promise<({
        clinicalNotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            chiefComplaint: string | null;
            history: string | null;
            subjective: string | null;
            objective: string | null;
            assessment: string | null;
            plan: string | null;
            patientId: string;
            providerId: string | null;
            conciergeId: string | null;
        }[];
        user: {
            id: string;
            email: string;
            role: string;
            createdAt: Date;
        };
        labResults: {
            id: string;
            status: string;
            patientId: string;
            providerId: string | null;
            uploadedAt: Date;
            testDate: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            patientId: string;
            totalAmount: number;
            fulfillmentId: string | null;
            trackingUrl: string | null;
        }[];
        goals: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            patientId: string;
            type: string;
        }[];
        regimen: {
            id: string;
            name: string;
            patientId: string;
            type: string;
            notes: string | null;
            dosage: string | null;
            frequency: string | null;
            source: string;
            active: boolean;
            startDate: Date | null;
            endDate: Date | null;
            productId: string | null;
        }[];
        wearableData: {
            id: string;
            patientId: string;
            date: Date;
            metrics: string;
            source: string;
            syncedAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        dob: Date;
        gender: string;
        phone: string | null;
        address: string | null;
    }) | null>;
}
