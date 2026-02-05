import { QuotesService } from './quotes.service';
export declare class QuotesController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    create(createQuoteDto: any, req: any): Promise<{
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
                type: string;
                sku: string;
                price: number;
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
        status: string;
        patientId: string;
        conciergeId: string;
        validUntil: Date | null;
        totalAmount: number;
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
        status: string;
        patientId: string;
        conciergeId: string;
        validUntil: Date | null;
        totalAmount: number;
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
        concierge: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                type: string;
                sku: string;
                price: number;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        conciergeId: string;
        validUntil: Date | null;
        totalAmount: number;
    }) | null>;
}
