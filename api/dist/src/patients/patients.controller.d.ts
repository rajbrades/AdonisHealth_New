import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    findAll(): Promise<({
        clinicalNotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            conciergeId: string | null;
            providerId: string | null;
            chiefComplaint: string | null;
            history: string | null;
            subjective: string | null;
            objective: string | null;
            assessment: string | null;
            plan: string | null;
        }[];
        user: {
            email: string;
            role: string;
            createdAt: Date;
        };
        labResults: {
            id: string;
            patientId: string;
            status: string;
            testDate: Date;
            providerId: string | null;
            uploadedAt: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
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
            patientId: string;
            status: string;
            conciergeId: string | null;
            providerId: string | null;
            chiefComplaint: string | null;
            history: string | null;
            subjective: string | null;
            objective: string | null;
            assessment: string | null;
            plan: string | null;
        }[];
        user: {
            id: string;
            email: string;
            role: string;
            createdAt: Date;
        };
        labResults: {
            id: string;
            patientId: string;
            status: string;
            testDate: Date;
            providerId: string | null;
            uploadedAt: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            totalAmount: number;
            fulfillmentId: string | null;
            trackingUrl: string | null;
        }[];
        goals: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            patientId: string;
            status: string;
        }[];
        regimen: {
            id: string;
            name: string;
            type: string;
            dosage: string | null;
            frequency: string | null;
            source: string;
            active: boolean;
            startDate: Date | null;
            endDate: Date | null;
            notes: string | null;
            patientId: string;
            productId: string | null;
        }[];
        wearableData: {
            id: string;
            source: string;
            patientId: string;
            date: Date;
            metrics: string;
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
