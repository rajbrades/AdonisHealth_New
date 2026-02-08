import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new NotFoundException('Patient profile not found');
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

    // Notify Concierge
    this.emailService.sendEmail({
      to: 'concierge@adonishealth.com',
      subject: `New Appointment Request: ${appointment.title}`,
      text: `Patient ${user.patientProfile.firstName} ${user.patientProfile.lastName} requested an appointment for ${appointment.date}.`,
    });

    return appointment;
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || user.role !== 'PATIENT' || !user.patientProfile) {
      // Provider/Concierge logic would go here to see all
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

  async findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, provider: true },
    });
  }

  async cancel(id: string, reason: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: { include: { user: true } }, provider: { include: { user: true } } },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    // 1. Alert Concierge
    this.logger.log(`Creating Concierge Task: Review cancellation for Appointment ${id}`);
    await this.emailService.sendEmail({
      to: 'concierge@adonishealth.com',
      subject: `URGENT: Appointment Cancelled - ${appointment.title}`,
      text: `Patient ${appointment.patient.firstName} cancelled their appointment scheduled for ${appointment.date}. Reason: ${reason}. Please follow up to reschedule.`,
    });

    // 2. Remove from Provider Calendar (simulated by email)
    if (appointment.provider) {
      this.logger.log(`Notifying Provider ${appointment.provider.lastName} of cancellation`);
      // In a real system, this would delete the Google/Outlook calendar event
      await this.emailService.sendEmail({
        to: appointment.provider.user.email,
        subject: `Appointment Cancelled: ${appointment.patient.lastName}, ${appointment.patient.firstName}`,
        text: `The appointment on ${appointment.date} has been cancelled.`,
      });
    }

    // 3. Confirm to Patient
    await this.emailService.sendEmail({
      to: appointment.patient.user.email,
      subject: 'Appointment Cancellation Confirmed',
      text: `Your appointment for ${appointment.title} on ${appointment.date} has been cancelled.\n\nPlease reschedule at your earliest convenience to stay on track with your protocol.`,
    });

    return updated;
  }

  async reschedule(id: string, newDate?: Date) {
    // Logic: Cancel old, create new (linked)
    const oldAppointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!oldAppointment) throw new NotFoundException('Appointment not found');

    const status = newDate ? 'SCHEDULED' : 'PENDING';
    const dateToUse = newDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 1 week from now if pending

    // Transaction to update old and create new
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

  // Reminder System Workflow
  // Run every day at 9 AM
  // @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleCancellationReminders() {
    this.logger.log('Running Cancellation Reminder Job...');

    // Find appointments cancelled 3, 7, or 14 days ago that haven't been rescheduled
    const daysToCheck = [3, 7, 14];

    for (const days of daysToCheck) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);

      // Find cancelled appointments from roughly this date
      // In reality, use a date range for the whole day
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
            none: {}, // Ensure no new appointment links back to this one
          }
        },
        include: { patient: { include: { user: true } } }
      });

      for (const appointment of cancelled) {
        // Check if patient has any future scheduled appointment (avoid spamming if they rebooked differently)
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

        // Email Concierge
        await this.emailService.sendEmail({
          to: 'concierge@adonishealth.com',
          subject: `Reminder: Patient hasn't rescheduled (${days} days)`,
          text: `Patient ${appointment.patient.firstName} cancelled ${days} days ago and has not rescheduled. Please reach out.`,
        });

        // Email Patient
        await this.emailService.sendEmail({
          to: appointment.patient.user.email,
          subject: 'Please Reschedule Your Appointment',
          text: `It's been ${days} days since you cancelled your appointment. Staying consistent is key to your results. Please reschedule soon.`,
        });
      }
    }
  }
}
