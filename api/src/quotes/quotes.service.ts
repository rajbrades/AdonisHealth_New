import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotesService {
    constructor(private prisma: PrismaService) { }

    async create(createQuoteDto: any, conciergeUserId: string) {
        // 1. Get Concierge Profile ID from User ID
        const concierge = await this.prisma.conciergeProfile.findUnique({
            where: { userId: conciergeUserId },
        });

        if (!concierge) {
            // Fallback or error - for now assume concierge profile exists if role is checked
            throw new Error('Concierge profile not found');
        }

        const { patientId, items, validUntil } = createQuoteDto;

        // 2. Calculate Total Amount based on product prices
        let totalAmount = 0;
        const quoteItemsData = [];

        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (product) {
                totalAmount += product.price * item.quantity;
                quoteItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price, // Lock in price at time of quote
                });
            }
        }

        // 3. Create Quote
        return this.prisma.quote.create({
            data: {
                patientId,
                conciergeId: concierge.id,
                totalAmount,
                validUntil: isValidDate(validUntil) ? new Date(validUntil) : null,
                items: {
                    create: quoteItemsData,
                },
            },
            include: {
                items: {
                    include: { product: true }
                },
                patient: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async findAll() {
        return this.prisma.quote.findMany({
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                },
                items: true,
                invoice: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.quote.findUnique({
            where: { id },
            include: {
                patient: true,
                items: { include: { product: true } },
                concierge: true,
                invoice: true,
            },
        });
    }
}

function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
