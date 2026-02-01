import { PrismaService } from '../prisma/prisma.service';
export declare class QuotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuoteDto: any, conciergeUserId: string): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                sku: string;
                price: number;
                type: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            quoteId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        validUntil: Date | null;
        totalAmount: number;
        conciergeId: string;
    }>;
    findAll(): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
        };
        items: {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            quoteId: string;
        }[];
        invoice: {
            id: string;
            createdAt: Date;
            status: string;
            quoteId: string;
            amount: number;
            paidAt: Date | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        validUntil: Date | null;
        totalAmount: number;
        conciergeId: string;
    })[]>;
    findOne(id: string): Promise<({
        patient: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                sku: string;
                price: number;
                type: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            quoteId: string;
        })[];
        invoice: {
            id: string;
            createdAt: Date;
            status: string;
            quoteId: string;
            amount: number;
            paidAt: Date | null;
        } | null;
        concierge: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        validUntil: Date | null;
        totalAmount: number;
        conciergeId: string;
    }) | null>;
}
