"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotesService = class QuotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuoteDto, conciergeUserId) {
        const concierge = await this.prisma.conciergeProfile.findUnique({
            where: { userId: conciergeUserId },
        });
        if (!concierge) {
            throw new Error('Concierge profile not found');
        }
        const { patientId, items, validUntil } = createQuoteDto;
        let totalAmount = 0;
        const quoteItemsData = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (product) {
                totalAmount += product.price * item.quantity;
                quoteItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                });
            }
        }
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
    async findOne(id) {
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
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesService);
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
//# sourceMappingURL=quotes.service.js.map