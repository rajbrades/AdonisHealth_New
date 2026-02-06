import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto, UpdateLabOrderStatusDto } from './dto/update-lab-order.dto';
import { RequisitionPdfService, RequisitionData } from './requisition-pdf.service';
import { EmailService } from '../email/email.service';

// Lab Order Status Workflow
export enum LabOrderStatus {
  PENDING = 'PENDING',
  REQUISITION_READY = 'REQUISITION_READY',
  SENT_TO_PATIENT = 'SENT_TO_PATIENT',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  PROCESSING = 'PROCESSING',
  RESULTS_RECEIVED = 'RESULTS_RECEIVED',
  REVIEWED = 'REVIEWED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Valid status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
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

@Injectable()
export class LabOrdersService {
  constructor(
    private prisma: PrismaService,
    private requisitionPdfService: RequisitionPdfService,
    private emailService: EmailService,
  ) {}

  /**
   * Generate a unique order number
   */
  private async generateOrderNumber(): Promise<string> {
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

  /**
   * Create a new lab order
   */
  async create(createLabOrderDto: CreateLabOrderDto) {
    const {
      patientId,
      panelName,
      panelCodes,
      labProvider,
      price,
      patientPay,
      drawSiteAddress,
      scheduledDrawDate,
      orderingProviderId,
      notes,
    } = createLabOrderDto;

    // Verify patient exists
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create the lab order
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

  /**
   * Get all lab orders with optional filters
   */
  async findAll(filters?: {
    patientId?: string;
    status?: string;
    labProvider?: string;
  }) {
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

  /**
   * Get a single lab order by ID
   */
  async findOne(id: string) {
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
      throw new NotFoundException('Lab order not found');
    }

    return labOrder;
  }

  /**
   * Get a lab order by order number
   */
  async findByOrderNumber(orderNumber: string) {
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
      throw new NotFoundException('Lab order not found');
    }

    return labOrder;
  }

  /**
   * Update a lab order
   */
  async update(id: string, updateLabOrderDto: UpdateLabOrderDto) {
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

  /**
   * Update lab order status with workflow validation
   */
  async updateStatus(id: string, updateStatusDto: UpdateLabOrderStatusDto) {
    const labOrder = await this.findOne(id);
    const { status, notes } = updateStatusDto;

    // Validate status transition
    const validTransitions = STATUS_TRANSITIONS[labOrder.status] || [];
    if (!validTransitions.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${labOrder.status} to ${status}. Valid transitions: ${validTransitions.join(', ')}`,
      );
    }

    const updateData: any = { status };

    // Auto-set timestamps based on status
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

  /**
   * Link lab results (LabPanel) to an order
   */
  async linkResults(labOrderId: string, labPanelId: string) {
    const labOrder = await this.findOne(labOrderId);

    // Verify the lab panel exists
    const labPanel = await this.prisma.labPanel.findUnique({
      where: { id: labPanelId },
    });
    if (!labPanel) {
      throw new NotFoundException('Lab panel not found');
    }

    // Verify the lab panel belongs to the same patient
    if (labPanel.patientId !== labOrder.patientId) {
      throw new BadRequestException('Lab panel does not belong to the same patient');
    }

    // Update the lab order with the linked panel and status
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

  /**
   * Cancel a lab order
   */
  async cancel(id: string, reason?: string) {
    const labOrder = await this.findOne(id);

    // Can only cancel if not already completed or cancelled
    if (
      labOrder.status === LabOrderStatus.COMPLETED ||
      labOrder.status === LabOrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Cannot cancel order with status: ${labOrder.status}`);
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

  /**
   * Get lab orders for a specific patient
   */
  async findByPatient(patientId: string) {
    return this.findAll({ patientId });
  }

  /**
   * Get pending lab orders (for requisition generation queue)
   */
  async findPendingOrders() {
    return this.findAll({ status: LabOrderStatus.PENDING });
  }

  /**
   * Get orders awaiting results
   */
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

  /**
   * Generate a requisition PDF for a lab order
   */
  async generateRequisition(id: string): Promise<{ filepath: string; storageKey: string }> {
    // Get the full order with patient and provider details
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
      throw new NotFoundException('Lab order not found');
    }

    // Prepare requisition data
    const requisitionData: RequisitionData = {
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

    // Generate the PDF
    const filepath = await this.requisitionPdfService.generateRequisition(requisitionData);
    const storageKey = this.requisitionPdfService.getStorageKey(labOrder.orderNumber);

    // Update the order with the requisition key and status
    await this.prisma.labOrder.update({
      where: { id },
      data: {
        requisitionPdfKey: storageKey,
        status: LabOrderStatus.REQUISITION_READY,
      },
    });

    return { filepath, storageKey };
  }

  /**
   * Get the filepath for a requisition PDF
   */
  getRequisitionPath(orderNumber: string): string {
    return this.requisitionPdfService.getRequisitionPath(orderNumber);
  }

  /**
   * Check if requisition exists
   */
  requisitionExists(orderNumber: string): boolean {
    return this.requisitionPdfService.requisitionExists(orderNumber);
  }

  /**
   * Send requisition to patient via email
   */
  async sendToPatient(id: string): Promise<{ success: boolean; messageId?: string }> {
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
      throw new NotFoundException('Lab order not found');
    }

    if (!labOrder.requisitionPdfKey) {
      throw new BadRequestException(
        'Requisition not yet generated. Generate requisition first.',
      );
    }

    const pdfPath = this.getRequisitionPath(labOrder.orderNumber);
    if (!this.requisitionExists(labOrder.orderNumber)) {
      throw new NotFoundException('Requisition PDF file not found');
    }

    const patientName = `${labOrder.patient.firstName} ${labOrder.patient.lastName}`;
    const patientEmail = labOrder.patient.user.email;

    const result = await this.emailService.sendLabRequisition(
      patientEmail,
      patientName,
      labOrder.orderNumber,
      labOrder.panelName,
      pdfPath,
      labOrder.drawSiteAddress || undefined,
      labOrder.scheduledDrawDate || undefined,
    );

    // Update status to SENT_TO_PATIENT
    await this.prisma.labOrder.update({
      where: { id },
      data: {
        status: LabOrderStatus.SENT_TO_PATIENT,
        requisitionSentAt: new Date(),
      },
    });

    return result;
  }
}
