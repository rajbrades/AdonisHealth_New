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
exports.ConciergeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConciergeService = class ConciergeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCheckIn(dto) {
        return this.prisma.$transaction(async (tx) => {
            const checkIn = await tx.checkIn.create({
                data: {
                    patientId: dto.patientId,
                    type: dto.type,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes,
                },
            });
            if (dto.pillars && dto.pillars.length > 0) {
                await tx.pillarMetric.createMany({
                    data: dto.pillars.map((p) => ({
                        checkInId: checkIn.id,
                        category: p.category,
                        score: p.score,
                        notes: p.notes,
                    })),
                });
            }
            if (dto.adherence && dto.adherence.length > 0) {
                await tx.regimenAdherence.createMany({
                    data: dto.adherence.map((a) => ({
                        checkInId: checkIn.id,
                        regimenId: a.regimenId,
                        adherent: a.adherent,
                        notes: a.notes,
                    })),
                });
            }
            return checkIn;
        });
    }
    async getPatientTrends(patientId) {
        return this.prisma.checkIn.findMany({
            where: { patientId },
            include: {
                metrics: true,
                adherence: true,
            },
            orderBy: { date: 'asc' },
        });
    }
};
exports.ConciergeService = ConciergeService;
exports.ConciergeService = ConciergeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConciergeService);
//# sourceMappingURL=concierge.service.js.map