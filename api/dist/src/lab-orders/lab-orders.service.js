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
exports.LabOrdersService = exports.LabOrderStatus = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const requisition_pdf_service_1 = require("./requisition-pdf.service");
const email_service_1 = require("../email/email.service");
var LabOrderStatus;
(function (LabOrderStatus) {
    LabOrderStatus["PENDING"] = "PENDING";
    LabOrderStatus["REQUISITION_READY"] = "REQUISITION_READY";
    LabOrderStatus["SENT_TO_PATIENT"] = "SENT_TO_PATIENT";
    LabOrderStatus["SAMPLE_COLLECTED"] = "SAMPLE_COLLECTED";
    LabOrderStatus["PROCESSING"] = "PROCESSING";
    LabOrderStatus["RESULTS_RECEIVED"] = "RESULTS_RECEIVED";
    LabOrderStatus["REVIEWED"] = "REVIEWED";
    LabOrderStatus["COMPLETED"] = "COMPLETED";
    LabOrderStatus["CANCELLED"] = "CANCELLED";
})(LabOrderStatus || (exports.LabOrderStatus = LabOrderStatus = {}));
const STATUS_TRANSITIONS = {
    [LabOrderStatus.PENDING]: [LabOrderStatus.REQUISITION_READY, LabOrderStatus.CANCELLED],
    [LabOrderStatus.REQUISITION_READY]: [LabOrderStatus.SENT_TO_PATIENT, LabOrderStatus.CANCELLED],
    [LabOrderStatus.SENT_TO_PATIENT]: [LabOrderStatus.SAMPLE_COLLECTED, LabOrderStatus.CANCELLED],
    [LabOrderStatus.SAMPLE_COLLECTED]: [LabOrderStatus.PROCESSING],
    [LabOrderStatus.PROCESSING]: [LabOrderStatus.RESULTS_RECEIVED],
    [LabOrderStatus.RESULTS_RECEIVED]: [LabOrderStatus.REVIEWED],
    [LabOrderStatus.REVIEWED]: [LabOrderStatus.COMPLETED],
    [LabOrderStatus.COMPLETED]: [],
    [LabOrderStatus.CANCELLED]: [],
};
let LabOrdersService = class LabOrdersService {
    prisma;
    requisitionPdfService;
    emailService;
    constructor(prisma, requisitionPdfService, emailService) {
        this.prisma = prisma;
        this.requisitionPdfService = requisitionPdfService;
        this.emailService = emailService;
    }
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const count = await this.prisma.labOrder.count({
            where: {
                orderNumber: {
                    startsWith: `ADONIS-LAB-${year}`,
                },
            },
        });
        const sequence = String(count + 1).padStart(4, '0');
        return `ADONIS-LAB-${year}-${sequence}`;
    }
    async create(createLabOrderDto) {
        const { patientId, panelName, panelCodes, labProvider, price, patientPay, drawSiteAddress, scheduledDrawDate, orderingProviderId, notes, } = createLabOrderDto;
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const orderNumber = await this.generateOrderNumber();
        return this.prisma.labOrder.create({
            data: {
                orderNumber,
                patientId,
                panelName,
                panelCodes,
                labProvider: labProvider || 'EVEXIA',
                price,
                patientPay: patientPay ?? true,
                drawSiteAddress,
                scheduledDrawDate: scheduledDrawDate ? new Date(scheduledDrawDate) : null,
                orderingProviderId,
                notes,
                status: LabOrderStatus.PENDING,
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
            },
        });
    }
    async findAll(filters) {
        return this.prisma.labOrder.findMany({
            where: {
                ...(filters?.patientId && { patientId: filters.patientId }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.labProvider && { labProvider: filters.labProvider }),
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
                labPanel: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
                labPanel: {
                    include: {
                        results: {
                            include: { biomarker: true },
                        },
                    },
                },
            },
        });
        if (!labOrder) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return labOrder;
    }
    async findByOrderNumber(orderNumber) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { orderNumber },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
                labPanel: true,
            },
        });
        if (!labOrder) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return labOrder;
    }
    async update(id, updateLabOrderDto) {
        const labOrder = await this.findOne(id);
        return this.prisma.labOrder.update({
            where: { id },
            data: {
                ...updateLabOrderDto,
                scheduledDrawDate: updateLabOrderDto.scheduledDrawDate
                    ? new Date(updateLabOrderDto.scheduledDrawDate)
                    : labOrder.scheduledDrawDate,
                actualDrawDate: updateLabOrderDto.actualDrawDate
                    ? new Date(updateLabOrderDto.actualDrawDate)
                    : labOrder.actualDrawDate,
            },
            include: {
                patient: true,
                orderingProvider: true,
                labPanel: true,
            },
        });
    }
    async updateStatus(id, updateStatusDto) {
        const labOrder = await this.findOne(id);
        const { status, notes } = updateStatusDto;
        const validTransitions = STATUS_TRANSITIONS[labOrder.status] || [];
        if (!validTransitions.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${labOrder.status} to ${status}. Valid transitions: ${validTransitions.join(', ')}`);
        }
        const updateData = { status };
        if (status === LabOrderStatus.SENT_TO_PATIENT) {
            updateData.requisitionSentAt = new Date();
        }
        if (status === LabOrderStatus.SAMPLE_COLLECTED && !labOrder.actualDrawDate) {
            updateData.actualDrawDate = new Date();
        }
        if (notes) {
            updateData.notes = labOrder.notes
                ? `${labOrder.notes}\n[${new Date().toISOString()}] ${notes}`
                : `[${new Date().toISOString()}] ${notes}`;
        }
        return this.prisma.labOrder.update({
            where: { id },
            data: updateData,
            include: {
                patient: true,
                orderingProvider: true,
                labPanel: true,
            },
        });
    }
    async linkResults(labOrderId, labPanelId) {
        const labOrder = await this.findOne(labOrderId);
        const labPanel = await this.prisma.labPanel.findUnique({
            where: { id: labPanelId },
        });
        if (!labPanel) {
            throw new common_1.NotFoundException('Lab panel not found');
        }
        if (labPanel.patientId !== labOrder.patientId) {
            throw new common_1.BadRequestException('Lab panel does not belong to the same patient');
        }
        return this.prisma.labOrder.update({
            where: { id: labOrderId },
            data: {
                labPanelId,
                status: LabOrderStatus.RESULTS_RECEIVED,
            },
            include: {
                patient: true,
                orderingProvider: true,
                labPanel: {
                    include: {
                        results: {
                            include: { biomarker: true },
                        },
                    },
                },
            },
        });
    }
    async cancel(id, reason) {
        const labOrder = await this.findOne(id);
        if (labOrder.status === LabOrderStatus.COMPLETED ||
            labOrder.status === LabOrderStatus.CANCELLED) {
            throw new common_1.BadRequestException(`Cannot cancel order with status: ${labOrder.status}`);
        }
        return this.prisma.labOrder.update({
            where: { id },
            data: {
                status: LabOrderStatus.CANCELLED,
                notes: reason
                    ? `${labOrder.notes || ''}\n[${new Date().toISOString()}] CANCELLED: ${reason}`
                    : labOrder.notes,
            },
        });
    }
    async findByPatient(patientId) {
        return this.findAll({ patientId });
    }
    async findPendingOrders() {
        return this.findAll({ status: LabOrderStatus.PENDING });
    }
    async findAwaitingResults() {
        return this.prisma.labOrder.findMany({
            where: {
                status: {
                    in: [
                        LabOrderStatus.SENT_TO_PATIENT,
                        LabOrderStatus.SAMPLE_COLLECTED,
                        LabOrderStatus.PROCESSING,
                    ],
                },
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async generateRequisition(id) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { id: true, email: true },
                        },
                    },
                },
                orderingProvider: true,
            },
        });
        if (!labOrder) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        const requisitionData = {
            orderNumber: labOrder.orderNumber,
            panelName: labOrder.panelName,
            panelCodes: labOrder.panelCodes,
            labProvider: labOrder.labProvider,
            price: labOrder.price,
            patientPay: labOrder.patientPay,
            drawSiteAddress: labOrder.drawSiteAddress,
            scheduledDrawDate: labOrder.scheduledDrawDate,
            notes: labOrder.notes,
            patient: {
                firstName: labOrder.patient.firstName,
                lastName: labOrder.patient.lastName,
                dob: labOrder.patient.dob,
                gender: labOrder.patient.gender,
                phone: labOrder.patient.phone,
                address: labOrder.patient.address,
                user: {
                    email: labOrder.patient.user.email,
                },
            },
            orderingProvider: labOrder.orderingProvider
                ? {
                    firstName: labOrder.orderingProvider.firstName,
                    lastName: labOrder.orderingProvider.lastName,
                    specialty: labOrder.orderingProvider.specialty,
                    deaNumber: labOrder.orderingProvider.deaNumber,
                }
                : null,
            createdAt: labOrder.createdAt,
        };
        const filepath = await this.requisitionPdfService.generateRequisition(requisitionData);
        const storageKey = this.requisitionPdfService.getStorageKey(labOrder.orderNumber);
        await this.prisma.labOrder.update({
            where: { id },
            data: {
                requisitionPdfKey: storageKey,
                status: LabOrderStatus.REQUISITION_READY,
            },
        });
        return { filepath, storageKey };
    }
    getRequisitionPath(orderNumber) {
        return this.requisitionPdfService.getRequisitionPath(orderNumber);
    }
    requisitionExists(orderNumber) {
        return this.requisitionPdfService.requisitionExists(orderNumber);
    }
    async sendToPatient(id) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });
        if (!labOrder) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        if (!labOrder.requisitionPdfKey) {
            throw new common_1.BadRequestException('Requisition not yet generated. Generate requisition first.');
        }
        const pdfPath = this.getRequisitionPath(labOrder.orderNumber);
        if (!this.requisitionExists(labOrder.orderNumber)) {
            throw new common_1.NotFoundException('Requisition PDF file not found');
        }
        const patientName = `${labOrder.patient.firstName} ${labOrder.patient.lastName}`;
        const patientEmail = labOrder.patient.user.email;
        const result = await this.emailService.sendLabRequisition(patientEmail, patientName, labOrder.orderNumber, labOrder.panelName, pdfPath, labOrder.drawSiteAddress || undefined, labOrder.scheduledDrawDate || undefined);
        await this.prisma.labOrder.update({
            where: { id },
            data: {
                status: LabOrderStatus.SENT_TO_PATIENT,
                requisitionSentAt: new Date(),
            },
        });
        return result;
    }
};
exports.LabOrdersService = LabOrdersService;
exports.LabOrdersService = LabOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        requisition_pdf_service_1.RequisitionPdfService,
        email_service_1.EmailService])
], LabOrdersService);
//# sourceMappingURL=lab-orders.service.js.map