import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): import(".prisma/client").Prisma.Prisma__OrderClient<{
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
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        totalAmount: number;
        quoteId: string | null;
        fulfillmentId: string | null;
        trackingUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        patient: {
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
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        totalAmount: number;
        quoteId: string | null;
        fulfillmentId: string | null;
        trackingUrl: string | null;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<({
        patient: {
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
            orderId: string;
        })[];
        quote: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            validUntil: Date | null;
            totalAmount: number;
            conciergeId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        status: string;
        totalAmount: number;
        quoteId: string | null;
        fulfillmentId: string | null;
        trackingUrl: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateOrderDto: UpdateOrderDto): string;
    remove(id: string): string;
}
