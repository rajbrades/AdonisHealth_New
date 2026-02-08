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
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    prisma;
    emailService;
    logger = new common_1.Logger(AppointmentsService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async create(createAppointmentDto, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });
        if (!user || !user.patientProfile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const appointment = await this.prisma.appointment.create({
            data: {
                ...createAppointmentDto,
                patientId: user.patientProfile.id,
            },
            include: {
                patient: { include: { user: true } },
                provider: { include: { user: true } },
            },
        });
        this.emailService.sendEmail({
            to: 'concierge@adonishealth.com',
            subject: `New Appointment Request: ${appointment.title}`,
            text: `Patient ${user.patientProfile.firstName} ${user.patientProfile.lastName} requested an appointment for ${appointment.date}.`,
        });
        return appointment;
    }
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });
        if (!user || user.role !== 'PATIENT' || !user.patientProfile) {
            return [];
        }
        return this.prisma.appointment.findMany({
            where: { patientId: user.patientProfile.id },
            orderBy: { date: 'asc' },
            include: {
                provider: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.appointment.findUnique({
            where: { id },
            include: { patient: true, provider: true },
        });
    }
    async cancel(id, reason) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { patient: { include: { user: true } }, provider: { include: { user: true } } },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment #${id} not found`);
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancellationReason: reason,
            },
        });
        this.logger.log(`Creating Concierge Task: Review cancellation for Appointment ${id}`);
        await this.emailService.sendEmail({
            to: 'concierge@adonishealth.com',
            subject: `URGENT: Appointment Cancelled - ${appointment.title}`,
            text: `Patient ${appointment.patient.firstName} cancelled their appointment scheduled for ${appointment.date}. Reason: ${reason}. Please follow up to reschedule.`,
        });
        if (appointment.provider) {
            this.logger.log(`Notifying Provider ${appointment.provider.lastName} of cancellation`);
            await this.emailService.sendEmail({
                to: appointment.provider.user.email,
                subject: `Appointment Cancelled: ${appointment.patient.lastName}, ${appointment.patient.firstName}`,
                text: `The appointment on ${appointment.date} has been cancelled.`,
            });
        }
        await this.emailService.sendEmail({
            to: appointment.patient.user.email,
            subject: 'Appointment Cancellation Confirmed',
            text: `Your appointment for ${appointment.title} on ${appointment.date} has been cancelled.\n\nPlease reschedule at your earliest convenience to stay on track with your protocol.`,
        });
        return updated;
    }
    async reschedule(id, newDate) {
        const oldAppointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { patient: true },
        });
        if (!oldAppointment)
            throw new common_1.NotFoundException('Appointment not found');
        const status = newDate ? 'SCHEDULED' : 'PENDING';
        const dateToUse = newDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return this.prisma.$transaction(async (tx) => {
            await tx.appointment.update({
                where: { id },
                data: {
                    status: 'RESCHEDULED',
                    cancelledAt: new Date(),
                    cancellationReason: 'Rescheduled by patient',
                },
            });
            const newAppointment = await tx.appointment.create({
                data: {
                    patientId: oldAppointment.patientId,
                    providerId: oldAppointment.providerId,
                    title: oldAppointment.title,
                    type: oldAppointment.type,
                    date: dateToUse,
                    duration: oldAppointment.duration,
                    rescheduledFromId: oldAppointment.id,
                    status: status,
                },
            });
            return newAppointment;
        });
    }
    async handleCancellationReminders() {
        this.logger.log('Running Cancellation Reminder Job...');
        const daysToCheck = [3, 7, 14];
        for (const days of daysToCheck) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - days);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            const cancelled = await this.prisma.appointment.findMany({
                where: {
                    status: 'CANCELLED',
                    cancelledAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    rescheduledTo: {
                        none: {},
                    }
                },
                include: { patient: { include: { user: true } } }
            });
            for (const appointment of cancelled) {
                const existingFutureAppt = await this.prisma.appointment.findFirst({
                    where: {
                        patientId: appointment.patientId,
                        status: 'SCHEDULED',
                        date: {
                            gte: new Date(),
                        },
                    },
                });
                if (existingFutureAppt) {
                    this.logger.log(`Skipping reminder for Patient ${appointment.patient.id} (already rescheduled)`);
                    continue;
                }
                this.logger.log(`Sending ${days}-day reminder for Appointment ${appointment.id}`);
                await this.emailService.sendEmail({
                    to: 'concierge@adonishealth.com',
                    subject: `Reminder: Patient hasn't rescheduled (${days} days)`,
                    text: `Patient ${appointment.patient.firstName} cancelled ${days} days ago and has not rescheduled. Please reach out.`,
                });
                await this.emailService.sendEmail({
                    to: appointment.patient.user.email,
                    subject: 'Please Reschedule Your Appointment',
                    text: `It's been ${days} days since you cancelled your appointment. Staying consistent is key to your results. Please reschedule soon.`,
                });
            }
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map