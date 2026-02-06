export class CreateOrderDto {
    patientId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    quoteId?: string;
}
