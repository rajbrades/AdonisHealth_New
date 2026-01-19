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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.patientProfile.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
                clinicalNotes: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                labResults: {
                    orderBy: { testDate: 'desc' },
                    take: 1,
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.patientProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    }
                },
                labResults: true,
                clinicalNotes: true,
                orders: true,
                goals: true,
                regimen: true,
                wearableData: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            },
        });
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map