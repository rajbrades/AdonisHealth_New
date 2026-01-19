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
                sku: string;
                description: string | null;
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
        invoice: {
            id: string;
            createdAt: Date;
            status: string;
            quoteId: string;
            amount: number;
            paidAt: Date | null;
        } | null;
        items: {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            quoteId: string;
        }[];
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
        invoice: {
            id: string;
            createdAt: Date;
            status: string;
            quoteId: string;
            amount: number;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                name: string;
                sku: string;
                description: string | null;
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
