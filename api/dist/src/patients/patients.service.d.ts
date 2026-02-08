import { PrismaService } from '../prisma/prisma.service';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        clinicalNotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            providerId: string | null;
            conciergeId: string | null;
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
            providerId: string | null;
            testDate: Date;
            uploadedAt: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            totalAmount: number;
            quoteId: string | null;
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
        shippingAddress: string | null;
        weight: number | null;
        weightUpdatedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<({
        clinicalNotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            providerId: string | null;
            conciergeId: string | null;
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
            providerId: string | null;
            testDate: Date;
            uploadedAt: Date;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            totalAmount: number;
            quoteId: string | null;
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
        shippingAddress: string | null;
        weight: number | null;
        weightUpdatedAt: Date | null;
    }) | null>;
}
